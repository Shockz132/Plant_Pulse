import socketio
import time
import Adafruit_BBIO.ADC as ADC
import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.PWM as PWM

sio = socketio.Client()
ADC.setup()
GPIO.setup("P8_10", GPIO.IN)
OldDigitalValue = 0
PreviousDoorDetectionStatus = 0

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

while True:
    # force click
    try:
        NewDigitalValue = ADC.read("P9_40")
        print("Mass of food waste(gf): %f" % (NewDigitalValue * 101.9716212978))
        if(abs(NewDigitalValue - OldDigitalValue) > 0.1):
            OldDigitalValue = NewDigitalValue
    except:
        print('Unable to transmit data.')
        pass
    time.sleep(0.4)
    
    # Reed click & buzzer
    try:
        CurrentDoorDetectionStatus = GPIO.input("P8_10")
        if CurrentDoorDetectionStatus:
            print("No foood waste has been thrown in.")
            Open_Close = False
        else:
            PWM.start("P9_14", 50)
            PWM.set_frequency("P9_14", 523)
            time.sleep(0.3)
            PWM.stop("P9_14")
            print("Food waste has been thrown in.")
            Open_Close = True
            PreviousDoorDetectionStatus = CurrentDoorDetectionStatus
    except:
        print('Unable to transmit data.')
        pass
    time.sleep(1)

    # IR distance & buzzer
    try:
        DigitalValue = ADC.read("P9_37")
        if DigitalValue != 0:
            AnalogVoltage = (DigitalValue * 1.8) * (2200 / 1200)
            DistanceCM = 29.988 * pow(AnalogVoltage , -1.173)
            PercentageFilled = ((29.373678 - DistanceCM) / 29.373678) * 100
            if PercentageFilled <= 0:
                PercentageFilled = 0
            if PercentageFilled <= 55:
                print("Percentage Filled: %f" % PercentageFilled)
            else:
                PWM.start("P9_14", 50)
                PWM.set_frequency("P9_14", 523)
                time.sleep(0.3)
                PWM.stop("P9_14")
                print("Please clear the Food Waste Bin")
                print("Percentage Filled: %f" % PercentageFilled)
        time.sleep(0.4)
    except:
        print('Unable to transmit data.')
        pass
    time.sleep(0.4)
    sio.emit('FoodWasteBin', {'device_id': "BBBW5", 'garden_id': 'NYP', 'bin_opened': Open_Close, "bin_percentage_filled": round(PercentageFilled, 1), "weight": round(NewDigitalValue * 101.9716212978, 1)})
    print('Data sent!')