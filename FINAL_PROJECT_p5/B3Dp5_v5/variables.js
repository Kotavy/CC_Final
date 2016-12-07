// The global variables used by B3D at runtime:


// Arduino
var serial;
var portName = 'COM20';
//var inData;
var outByte = 0;
var options = {
  baudrate: 115200,
};

var locationY = areaWidth/2;
var locationX = 5*areaHeight/6;
var circleColor = (0, 30, 235);

// Play Space
var areaWidth = 800;     // These are passed to createCanvas()
var areaHeight = 800;    // Maintain multiples of 100 for best results
var brWidth = 100;
var brHeight = brWidth/3;
var columns = areaWidth/brWidth;
var rows = (areaHeight/8)/brHeight;  // Divide areaHeight by exponents of 2 to change 'difficulty'

// Gameplay
var score = 0;
var orbCount = 0;
var gameActive = false;
var r = 0;
var g = 0;
var b = 0;
var gold = [281, 165, 32];
var bg = [r, g, b, 200];


// Item Arrays
var bricks;
var orbs = [];