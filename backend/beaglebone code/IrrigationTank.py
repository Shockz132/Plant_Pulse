import time
import Adafruit_BBIO.ADC as ADC
from Adafruit_BBIO.SPI import SPI
import Adafruit_BBIO.PWM as PWM
import Adafruit_BBIO.GPIO as GPIO

import socketio

servo_pin = "P8_13"
# Constants for IR distance sensor
IR_PIN = "P9_38"
FLAME_PIN = "P9_37"

spin = False

# Setup ADC and PWM
sio = socketio.Client()
ADC.setup()

# Define device and garden IDs
device_id = "BBBW3"
garden_id = "NYP"
replenish_plant_water = False

@sio.event
def connect():
    print('Connection established')
    
@sio.event
def disconnect():
    print('Disconnected from server')

@sio.event
def replenishPlantWater(RxData):
    global replenish_plant_water
    if RxData['replenish_plant_water']:
        replenish_plant_water = True
    else:
        replenish_plant_water = False

while True:
    try:
        sio.connect('http://192.168.0.172:5000')
        break
    except:
        print("Try to reconnect")
        pass
        # time.sleep(1)

# Main loop
while True:
    # Read IR distance sensor
    ir_digital_value = ADC.read(IR_PIN)
    if ir_digital_value != 0:
        ir_analog_voltage = (ir_digital_value * 1.8) * (2200 / 1200)
        ir_DistanceCM = 29.988 * pow(ir_analog_voltage, -1.173)
        DistanceCM = round(ir_DistanceCM,0)
        tank = (19 - DistanceCM) / 19 * 100
        tank_percentage_filled = round(tank,0)
        if tank_percentage_filled < 0.0:
            tank_percentage_filled = 0.0
        print(tank_percentage_filled)
        if tank_percentage_filled < 20:
            refill_tank = True
        else:
            refill_tank = False
    
    
    flame_digital_value = ADC.read(FLAME_PIN)
    flame_analog_value = (flame_digital_value * 1.8) * (2200 / 1200)
    
    if flame_analog_value > 0.0050:
        flame_detected = True
    else:
        flame_detected = False
    
    if replenish_plant_water:
        PWM.stop("P8_19")
        PWM.start(servo_pin, 5, 50)
        PWM.set_duty_cycle(servo_pin, 3.5)
        time.sleep(0.5)
        PWM.set_duty_cycle(servo_pin, 5)
        time.sleep(0.5)
        PWM.stop(servo_pin)
    else:
        print("Plants have enough water.")

    data = {
        'device_id': device_id,
        'garden_id': garden_id,
        'refill_tank': refill_tank,
        'tank_percentage_filled': tank_percentage_filled,
        'flame_detected': flame_detected,
    }
    
    sio.emit('IrrigationTank', data)
    time.sleep(0.5)





