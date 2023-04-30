# When using Mu, place 3rd party import files into the mu_code directory on your PC
# then copy them across using the "files" tab in the Mu editor

# IMPORTS
import bme280
import tcs3472
# import sound
import microbit
import math

# INITS
bme = bme280.bme280()  # BME280 Humidity, Pressure and Temperature Sensor
light_sensor = tcs3472.tcs3472()  # TCS3472 Visable Light and Colour Sensor
# sound = sound.sound()  # SPU0410HR5H-PB MEMS Microphone

# bme.set_qnh(1013.25) # Adjust for changes in sea level pressure (hPa)
# Used to calibrate altitude calculations

# See envirobit repo here: https://github.com/pimoroni/micropython-envirobit

# FUNCTIONS
# for van levelling and off-road driving
def van_pitch(): # max z is flat, max y is vertical hill
    # get accelerometer readings for hill incline in degrees
    pitch_y = microbit.accelerometer.get_y()
    pitch_z = microbit.accelerometer.get_z()
    pitch_result = int(math.degrees(math.atan2(pitch_y, -pitch_z)))
    return pitch_result

def van_roll(): # max z is flat, max x is fallen on side
    # get accelerometer readings for side camber
    roll_x = microbit.accelerometer.get_x()
    roll_z = microbit.accelerometer.get_z()
    roll_result = int(math.degrees(math.atan2(roll_x, -roll_z)))
    return roll_result

# MAIN LOOP
while True:
    # Read onboard sensors to determine magnetic heading, pitch and roll
    MB_Heading = microbit.compass.heading() # USB socket is the bearing direction
    MB_Pitch = van_pitch()
    MB_Roll = van_roll()

    # Read BME280 Air Values
    EB_Temp = int(bme.temperature())  # return the temperature in degrees C
    EB_Press = int(bme.pressure())  # return the pressure in hectopascals/millibars (100 pascals) - 1 bar = 100,000 pascals
    EB_Humid = int(bme.humidity())  # return the relative humidity in %
    EB_Alt = int(bme.altitude())  # return the altitude in feet, calculated against average pressure at sea level

    # Read the TCS3472 Light Values
    # EB_RGB = light_sensor.rgb()  # returns the corrected levels of red, green and blue out of 255
    EB_Light = light_sensor.light()  # return a raw reading of light level on a scale of 0-65535
    # light_sensor.set_leds()  # turn the leds on and off with 0 or 1


    # CSV Data Structure: Heading,Pitch,Roll,Temperature,Pressure,Humidty,Altitude,Light
    print(str(MB_Heading) + "," + str(MB_Pitch) + "," + str(MB_Roll) + "," + str(EB_Temp) + "," + str(EB_Press) + "," + str(EB_Humid) + "," + str(EB_Alt) + "," + str(EB_Light))
    microbit.sleep(1000)  # Sleep for 1 second

