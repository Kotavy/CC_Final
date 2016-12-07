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

void setup() {
  Serial.begin(9600); // initialize Serial communication
  //while (!Serial);    // wait for the serial port to open
  while (Serial.available() <= 0) {
    Serial.println("hello"); // send a starting message
    delay(300);              // wait 1/3 second
  }
  // initialize device
  Serial.println("Initializing IMU device...");
  CurieIMU.begin();
  CurieIMU.setAccelerometerRate(25);


  // Set the accelerometer range to 16G
  CurieIMU.setAccelerometerRange(2);
}

    //float ax, ay, az;   //scaled accelerometer values
    int ax, ay, az;

void loop() {
  
  // Scaled or nah?
  CurieIMU.readAccelerometer(ax, ay, az);
  
  //CurieIMU.readAccelerometerScaled(ax, ay, az);
  if (Serial.available() > 0) {
    int inByte = Serial.read();
    Serial.print(ax + .1);
    Serial.print(",");
    Serial.println(ay - .01);
//   Serial.print(",");
//    Serial.println(az - .1);
//    Serial.write(inByte);
//    analogWrite(9, inByte);
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



//
//
//
//// Necessary for board function
//#include "CurieIMU.h"
//
//
//
//void setup() {
//  Serial.begin(9600); // initialize Serial communication
//  while (!Serial);    // wait for the serial port to open
//
//  // initialize device
//  Serial.println("Initializing IMU device...");
//  CurieIMU.begin();
//
//  // Set the accelerometer range to 2G
//  CurieIMU.setAccelerometerRange(2);
//  // Set the gyroscope range to 250 degrees/second
//  CurieIMU.setGyroRange(250); // Scale hand speed to this
//
//  // See RawImuDataSerial for calibration on setup?
//}
//
//// Accel sample loop() code, baseline test
//void loop() {
//  float ax, ay, az;   //scaled Accel values
//  float gx, gy, gz; //scaled Gyro values
//
//  // Accellerometer data for orientation, scaled to the configured range
//  CurieIMU.readAccelerometerScaled(ax, ay, az);
//
//  // display tab-separated accelerometer x/y/z values
//  Serial.print("a:\t");
//  Serial.print(ax);
//  Serial.print("\t");
//  Serial.print(ay);
//  Serial.print("\t");
//  Serial.print(az);
//  Serial.println();
//
//  // Gyroscope data for movement, scaled to the configured range
//  CurieIMU.readGyroScaled(gx, gy, gz);
//
//  // display tab-separated gyro x/y/z values
//  Serial.print("g:\t");
//  Serial.print(gx);
//  Serial.print("\t");
//  Serial.print(gy);
//  Serial.print("\t");
//  Serial.print(gz);
//  Serial.println();
//}
//}



//void loop() {
//
//  // read accelerometer:
//  int x = CurieIMU.readAccelerometer(X_AXIS);
//  int y = CurieIMU.readAccelerometer(Y_AXIS);
//  int z = CurieIMU.readAccelerometer(Z_AXIS);
//
//}
