import socketio
import time
import board
import digitalio
import busio
import adafruit_bme680
import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.ADC as ADC
import adafruit_veml6070
import adafruit_ssd1306
from board import SCL, SDA
from PIL import Image, ImageDraw, ImageFont

#ENV
i2c = board.I2C()
bme680 = adafruit_bme680.Adafruit_BME680_I2C(i2c, 0x77)
#UV3
uv = adafruit_veml6070.VEML6070(i2c)
#IR distance
ADC.setup()

ADC.setup()
sio = socketio.Client()

@sio.event
def connect():
    print('Connection established.')

@sio.event
def disconnect():
    print('Disconnected from server.')
    
while True:
    try:
        sio.connect('http://192.168.0.172:5000')
        break
    except:
        print("Try to connect to the server.")
        pass 
        time.sleep(0.5)

#ENV
bme680.sea_level_pressure = 1008.5
temperature_offset = -5

def OLEDClickInit():
    Pin_DC = digitalio.DigitalInOut(board.P9_16)
    Pin_DC.direction = digitalio.Direction.OUTPUT
    Pin_DC.value = False
    Pin_RESET = digitalio.DigitalInOut(board.P9_23)
    Pin_RESET.direction = digitalio.Direction.OUTPUT
    Pin_RESET.value = True
    L_I2c = busio.I2C(SCL, SDA)
    return L_I2c

G_I2c = OLEDClickInit() 
Display = adafruit_ssd1306.SSD1306_I2C(128, 32, G_I2c, addr=0x3C)

ImageObj = Image.new("1", (Display.width, Display.height))
Draw = ImageDraw.Draw(ImageObj)

Font = ImageFont.load_default()

while True:
    digital_value = ADC.read("P9_39")
    if digital_value != 0:
        analog_voltage = (digital_value * 1.8) * (2200 / 1200)
        distance_cm = 29.988 * pow(analog_voltage, -1.173)
        distance_cm_float = float(distance_cm)
        print("Distance(cm): %f" % distance_cm_float)
        print('Distance data sent!')
    
    temp = bme680.temperature + temperature_offset
    temp_float = float(temp)
    print("\nTemperature: %0.1f C" % temp_float)
    print('Temperature data sent!')
    
    humidity = bme680.relative_humidity
    humidity_float = float(humidity)
    print("Humidity: %0.1f %%" % humidity_float)
    print('Humidity data sent!')
    
    uv_raw = uv.uv_raw
    uv_raw_float = float(uv_raw)
    print('UV Reading: {0}'.format(uv_raw_float))
    print('UV data sent!')
    
    sio.emit('PlantPlot', {'device_id': "BBBW4", 'plot_id': 1, 'garden_id': "NYP", 'moisture_value': round(humidity_float, 1), 'temperature_value': round(temp_float, 1), 'plant_height': round(distance_cm_float, 1), 'light_value': round(uv_raw_float, 1)} )
    
    Draw.rectangle((0, 0, Display.width - 1, Display.height - 1), outline=1, fill=0)
    Text = "Ht: %.2f cm" % distance_cm_float
    Draw.text((35, 10), Text, font=Font, fill=1)
    Text = "UV: %.2f cm" % uv_raw_float
    Draw.text((35, 20), Text, font=Font, fill=1)
    Display.image(ImageObj)
    Display.show()
    time.sleep(1)
    Draw.rectangle((0, 0, Display.width - 1, Display.height - 1), outline=1, fill=0)
    Text = "Tempt: %.2f cm" % temp_float
    Draw.text((35, 10), Text, font=Font, fill=1)
    Text = "Moisture: %.2f cm" % humidity_float
    Draw.text((35, 20), Text, font=Font, fill=1)
    Display.image(ImageObj)
    Display.show()
        
    time.sleep(0.5)