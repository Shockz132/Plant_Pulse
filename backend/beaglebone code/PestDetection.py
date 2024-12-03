import socketio
import time
import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.PWM as PWM

sio = socketio.Client()
GPIO.setup("P9_15", GPIO.IN)
GPIO.setup("P8_18", GPIO.IN)
GPIO.setup("P8_17", GPIO.IN)

buzzerEnable = False

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
    
MotionDetectionStatus1 = 0
MotionDetectionStatus2 = 0

while True:
    try:
        MotionDetectionStatus1 = GPIO.input("P9_15")
        MotionDetectionStatus2 = GPIO.input("P8_18")
        if GPIO.input("P8_17"):
            if buzzerEnable == True:
                print("Buzzer disabled")
                buzzerEnable = False
            else:
                print("Buzzer enabled")
                buzzerEnable = True
        if MotionDetectionStatus1 or MotionDetectionStatus2:
            if buzzerEnable == True:
                sio.emit('PestDetection', {'device_id': "BBBW2", 'garden_id': "NYP", 'pest_detected': True, 'buzzer_status': True})
            else:
                sio.emit('PestDetection', {'device_id': "BBBW2", 'garden_id': "NYP", 'pest_detected': True, 'buzzer_status': False})
            if buzzerEnable == True:
                PWM.start("P9_16", 50)
                PWM.set_frequency("P9_16", 523)
                time.sleep(0.5)
                PWM.set_frequency("P9_16", 587)
                time.sleep(0.5)
            else:
                PWM.stop("P9_16")
        else:
            if buzzerEnable == True:
                sio.emit('PestDetection', {'device_id': "BBBW2", 'garden_id': "NYP", 'pest_detected': False, 'buzzer_status': True})
            else:
                sio.emit('PestDetection', {'device_id': "BBBW2", 'garden_id': "NYP", 'pest_detected': False, 'buzzer_status': False})
            PWM.stop("P9_16")
        print("Data sent!")
    except:
        print('Unable to transmit data')
        pass
    time.sleep(1.5)
