// The global variables used by B3D at runtime:


// Play Space
var areaWidth = 800;
var areaHeight = 800;
var brWidth = 100;
var brHeight = brWidth/3;
var columns = areaWidth/brWidth;
var rows = (areaHeight/4)/brHeight;

// Gameplay
var score = 0;
var orbCount = 0;
var gameActive = true;
var r = 0;
var g = 0;
var b = 0;
var gold = [281, 165, 32];
var bg = [r, g, b, 200];

// Item Arrays
var bricks;
var orbs = [];
