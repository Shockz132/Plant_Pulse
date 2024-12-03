import socketio
import time
import board
import Adafruit_BBIO.GPIO as GPIO
from Adafruit_BBIO.SPI import SPI

# oled display
import busio
import digitalio
import adafruit_ssd1306
from board import SCL, SDA
from PIL import Image, ImageDraw, ImageFont

# gesture sensor
import adafruit_apds9960.apds9960

# Analog Key
import Adafruit_BBIO.ADC as ADC


sio = socketio.Client()

@sio.event
def connect():
    print('Connection established.')

@sio.event
def disconnect():
    print('Disconnected from server.')

while True:
    try:
        # remember to change ip address !!
        sio.connect('http://192.168.0.172:5000')
        break
    except:
        print("Try to connect to the server.")
        pass

# irgesture variables
# Create sensor object, communicating over the board's default I2C bus
i2c = board.I2C()

apds9960 = adafruit_apds9960.apds9960.APDS9960(i2c)
apds9960.enable_proximity = True
apds9960.enable_gesture = True


# OLED diplsay
def OLEDClickInit():
    Pin_DC = digitalio.DigitalInOut(board.P9_14)
    Pin_DC.direction = digitalio.Direction.OUTPUT
    Pin_DC.value = False
    Pin_RESET = digitalio.DigitalInOut(board.P9_12)
    Pin_RESET.direction = digitalio.Direction.OUTPUT
    Pin_RESET.value = True
    L_I2c = busio.I2C(SCL, SDA)
    return L_I2c

def DrawOLEDPage(text):
    ImageObj = Image.new("1", (Display.width, Display.height))
    
    Draw = ImageDraw.Draw(ImageObj)
    Draw.rectangle((0, 0, Display.width - 1, Display.height - 1), outline=1, fill=0)
    
    Font = ImageFont.load_default()
    
    if len(text) > 15:
        Draw.text((35, 10), text[0:15], font=Font, fill=1)
        Draw.text((35, 20), text[15:len(text)], font=Font, fill=1)
    else:
        Draw.text((35, 10), text[0:15], font=Font, fill=1)
    
    Display.image(ImageObj)
    Display.show()

G_I2c = OLEDClickInit()
Display = adafruit_ssd1306.SSD1306_I2C(128, 32, G_I2c, addr=0x3C)



# 7 seg
def SevenSegInit():
    GPIO.setup("P8_19", GPIO.OUT)
    GPIO.setup("P8_14", GPIO.OUT)
    GPIO.output("P8_19", GPIO.HIGH)
    GPIO.output("P8_14", GPIO.HIGH)
    L_Spi0 = SPI(0,0)
    L_Spi0.mode = 0
    return L_Spi0

def SevenSegDisplay(L_Spi0, L_Number):
    DigitList = [0x7E, 0x0A, 0xB6, 0x9E, 0xCA, 0xDC, 0xFC, 0x0E, 0xFE, 0xDE]
    OnesDigit = L_Number % 10
    TensDigit = L_Number / 10
    L_Spi0.writebytes([DigitList[int(OnesDigit)], DigitList[int(TensDigit)]])

G_Spi0 = SevenSegInit()

# Analog Key
ADC.setup()

page_count = 0
SevenSegDisplay(G_Spi0, 1)
task_list = []

sio.emit('fetchBBBWTasks', {"garden_id": "NYP"})

@sio.event
def TaskBoardTasks(RxData):
    global task_list
    if RxData['task_board_tasks'] != task_list:
        task_list = []
        temp_task_list = RxData['task_board_tasks']
        for task in temp_task_list:
            task_list.append({'id': task['id'], 'title': task['title'], 'garden_id': task['garden_id'] })
    else:
        pass

DrawOLEDPage("Waiting...")
print("Initialised")

while True:
    try:
        gesture = apds9960.gesture()
                
        if gesture == 0x01:
            #print("up")
            print("swipe either left or right")
            sio.emit('fetchBBBWTasks', {"garden_id": "NYP"})
        elif gesture == 0x02:
            #print("down")
            print("swipe either left or right")
            sio.emit('fetchBBBWTasks', {"garden_id": "NYP"})
        elif gesture == 0x03:
            print("page left")
            sio.emit('fetchBBBWTasks', {"garden_id": "NYP"})
            if page_count > 0:
                page_count -= 1
                SevenSegDisplay(G_Spi0, page_count + 1)
            else:
                DrawOLEDPage("No more pages..")
                time.sleep(0.2)
        elif gesture == 0x04:
            print("page right")
            sio.emit('fetchBBBWTasks', {"garden_id": "NYP"})
            page_count += 1
            if page_count >= 0 and page_count < len(task_list):
                SevenSegDisplay(G_Spi0, page_count + 1)
            else:
                page_count -= 1
                DrawOLEDPage("No more pages..")
                time.sleep(0.2)
        
        if len(task_list) != 0:
            DrawOLEDPage(task_list[page_count]['title'])
        else:
            DrawOLEDPage("No pages..")
        
        DigitalValue = ADC.read("P9_39")
        if DigitalValue >= 0.00 and DigitalValue < 0.10:
            # print("No Key is Pressed")
            pass
        elif DigitalValue > 0.16 and DigitalValue < 0.18:
            print("T6 Key is Pressed")
        elif DigitalValue > 0.33 and DigitalValue < 0.35:
            print("T5 Key is Pressed")
        elif DigitalValue > 0.50 and DigitalValue < 0.52:
            print("T4 Key is Pressed")
        elif DigitalValue > 0.69 and DigitalValue < 0.71:
            print("T3 Key is Pressed")
        elif DigitalValue > 0.86 and DigitalValue < 0.88:
            print("T2 Key is Pressed")
        elif DigitalValue > 0.90 and DigitalValue < 1.10:
            print("T1 Key is Pressed")
            if len(task_list) > 0:
                message = task_list[page_count]['title'] + " removed"
                sio.emit('BBBWTaskBoard', {'page_removed': task_list[page_count]['id']})
                print(f"removed: {message}")
                task_list.remove(task_list[page_count])
            else:
                print("no pages to remove")
        else:
            pass
        # print("Waiting for Data..")
    except Exception as e:
        print(e)
        print("Unable to transmit data.")
        time.sleep(1)
        pass