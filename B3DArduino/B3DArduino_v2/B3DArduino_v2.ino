/*
 * Break Out 3D - CC Final Project Draft
 * Tavius Koktavy
 */

/*
 * DRAFTING BOARD - What do I need from the Arduino side?
 *  - (CHECK) Accelerometer input
 *  - (CHECK) Gyroscope input
 *  - Transmission to server
 *  - Listening for response data
 *    - Real world response (LED)
 * 
 */



#include "CurieIMU.h"
#include <SoftwareSerial.h>

//SoftwareSerial mySerial(2, 3); // RX, TX

void setup() {
  Serial.begin(115200); // initialize Serial communication
  
  while (Serial.available() <= 0) {
    Serial.println("Hello, world? Iterating until response."); // send a starting message
    delay(300);              // wait 1/3 second
  }
  
  // initialize device
  Serial.println("Initializing IMU device...");
  CurieIMU.begin();
  CurieIMU.setAccelerometerRate(1600); // Does this aid in smoothing or nah?

  // Set the accelerometer range in G's
  CurieIMU.setAccelerometerRange(4);
}

//float ax, ay, az;   //scaled accelerometer values
int ax, ay, az;

//void(* resetFunc) (void) = 0;  // declare reset fuction at address 0

void loop() {
  
  // Scaled or nah?
  //CurieIMU.readAccelerometerScaled(ax, ay, az);
  CurieIMU.readAccelerometer(ax, ay, az);
  
  if (Serial.available() > 0) {
    int inByte = Serial.read();
    // 'c' resets the Arduino if the game is won
    if (inByte == 'c') {
      while (Serial.available() <= 0) {
        Serial.println("Hello, world? Iterating until response."); // send a starting message
        delay(300);              // wait 1/3 second
  }
    }
    else {
      Serial.print(ax);
      Serial.print(",");
      Serial.println(ay);
    }

//   Serial.print(",");
//    Serial.println(az);
//    Serial.write(inByte);
//  analogWrite(9, inByte); // Should light up the LED?
//    Serial.print("hello");
//    Serial.print("\r");
//    Serial.print("\n");
  }

  // read accelerometer measurements from device, scaled to the configured range

  // display tab-separated accelerometer x/y/z values
//  Serial.print(ax + .1);
//  Serial.print(",");
//  Serial.print(ay - .01);
//  Serial.print(",");
//  Serial.print(az - .1);
//  Serial.println();
//  delay(50);
}
