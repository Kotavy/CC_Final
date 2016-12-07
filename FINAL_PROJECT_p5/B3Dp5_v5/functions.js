




/////////////////////// Arduino ////////////////////////////

function serialSetup() {
  serial = new p5.SerialPort();
  //serial.on();  //a function that recognizes events
  //serial.on('list', printList);
  serial.on('connected', serverConnected);   // Callback call to prevent severConnected() as a blocking function
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
  
  serial.open(portName, options);
}

// With THANKS! from:
//https://itp.nyu.edu/physcomp/labs/labs-serial-communication/two-way-duplex-serial-communication-using-p5js/
function serialEvent() {
  // Read from the serial port
  var inString = serial.readStringUntil('\r\n');
  //check to see that there's actually a string there:
  if (inString.length < 39) { // This is greater that 0 bytes
      var sensors = split(inString, ',');            // split the string on the commas
      if (sensors.length > 1) { // if there are three elements
        locationY = map(sensors[0], -10000, 10000, height/2, height);
        locationX = map(sensors[1], 32000, -32000, -width*0.5, width*1.5);
        serial.write('x');
      }
  }
  else {
      serial.write('x');
      println('Attempting to connect');
  }
}

function serverConnected() {   // A callback function
  println('connected to server.');
}

function portOpen() {
  println('the serial port opened.');
}

function portClose() {
  println('The serial port closed');
}

function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function printList(portList) {
  for(var i = 0; i < portList.length; i++) {
    println(i + " " + portList[i]);
  }
}



/////////////////////// Game ////////////////////////////

//  Functions include:
//    resetSketch, startup, gameWon, gameOver, restart

// Reset Sketch
function resetSketch() {
  score = 0;
  
  // Blank 2D brick array intitialization
  bricks = new Array(columns);        // Make an array over the width (columns)
  for (var i = 0; i < bricks.length; i++) { // Loop over those columns
    bricks[i] = new Array(rows);      // And make a brick for every row of every column
  }
  
  // Fill the array
  for (var co = 0; co < columns; co++) { // Loop over each column
    for (var ro = 0; ro < rows; ro++) {  // Loop over each row of the current column
      bricks[co][ro] = new brick(co, ro, r(ro), g(ro), b(ro), round(random(0, 30))); // Initialize a brick object in the array, at that (x,y)/(col,row) position
      bricks[co][ro].render();   // 'Activate' that brick, giving it color and a shape
    }
  }
  
  // Initialize play
  for (var q = 0; q < 1; q++) { // loop with (q < X) to stress test
    newBall = new ball(width/2, 7*height/8, 20, 255, 5, -9);
    orbs.push(newBall);
    orbCount++;
  }
}

// Startup
function startup() {
  if (score === 0) {
    player = new hand(locationX, locationY, 120, 20, color(255));
    player.render();
    player.move();
    fill(255,255,255); // Set the text color
    textSize(24);
    text("This program CONTAINS DIALOGUE",100,140);
    text("It HAS SOME FUNCTIONS.",100,165);
    text("To play:",125,200);
    text("Hit SPACE to begin",100,400);
    if (keyCode == 32) {
      serial.write('c');
      gameActive = true;
    }
  }
}

// Restart
function restart() {
  if (score == columns*rows || orbCount === 0) {
    fill(255,255,255); // Set the text color
    textSize(24);
    text("Restart DIALOGUE",100,140);
    text("To play again:",125,200);
    text("Hit SPACE",100,400);
    if (keyCode == 32) {
      serial.write('c');
      gameActive = true;
      resetSketch();
    }
  }
}

// Game Won
function gameWon() {
  if (score == columns*rows) {
    //console.log("WONTON!");
    bg = [281, 165, 32, 30];
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("WINNAH!", width/2, height/2 - 1*height/10);
    text("You Scored: " + score + " points.", width/2, height/2);
    gameActive = false;
    serial.write('c');
  }
}

// Game Over
function gameOver() {
  if (orbCount === 0) {
    //console.log("lol");
    bg = [255, 0, 0, 30];
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2 - 1*height/10);
    gameActive = false;
    serial.write('c');
  }
}



/////////////////////// Ball ////////////////////////////

//  Functions include:
//    render, move, wallHit, ballHit, handHit

// Constructor
function ball(bx, by, bd, bc, bxs, bys) {
  this.bx = bx;
  this.by = by;
  this.bd = bd;
  this.bc = bc;
  this.bxs = bxs;
  this.bys = bys;
  this.alive = true;
  
  
  // Draw the ball
  this.render = function() {
    //push();
      stroke(0);
      strokeWeight(0.5);
      fill(this.bc);
      ellipse(this.bx, this.by, this.bd, this.bd);
    //pop();
  }
  
  
  // Move the ball
  this.move = function() {
    this.bx = this.bx + this.bxs;
    this.by = this.by + this.bys;
  }
  
  
  // Collision detection and handling for walls
  this.wallHit = function() {
    // Old: if (this.by > height || this.by < 0)  Adding the speed into the function allows for a 'predictive' effect.
    // This should eliminate cases where a ball gets stuck in the wall.
    if (this.bx + this.bxs > width - this.bd/2 || this.bx + this.bxs < this.bd/2) {
      this.bxs = -(this.bxs);
    }
    
    if (this.by + this.bys < this.bd/2) {
      this.bys = -(this.bys);
    }
  }
  
  
  //Destroy a ball out of bounds
  this.outOfBounds = function() {
    if (this.by - this.bd*4 > height) { // With generous padding
          this.bys = -(this.bys);

  //    orbCount--;
  //    this.alive = false;
    }
  }
  

  
  // Collision detection and handling for hand (BASIC)
  this.handHit = function(h) {
  
    // Collision check for upper edge of hand:
//  if (( (lower ball edge is below upper hand edge) and (also above the hand middle)  and  (the ball center is within left and right edges of the hand)
    if (this.bys > 0) {
      if ( (this.by + this.bd/2) >= (h.hy - h.hw/2)  &&  this.by < h.hy  &&  this.bx > (h.hx - h.hl/2)  &&  this.bx < (h.hx + h.hl/2) ) {
        this.bys = -(this.bys);
      }
    }
    
    // Why allow for collision with the bottom of the paddle? Because once 3D and hooked up to the Arduino,
    // this will allow the player to hit the ball with either side of their hand.
    //Collision check for lower edge of hand:
    if (this.bys < 0) {
      if ( (this.by - this.bd/2) <= (h.hy + h.hw/2)  &&  this.by > h.hy  &&  this.bx > (h.hx - h.hl/2)  &&  this.bx < (h.hx + h.hl/2) ) {
        this.bys = -(this.bys);
      }
    }
    
    // Collision check for left edge of hand:
    if (this.bxs > 0) {
      if ( (this.bx + this.bd/2) >= (h.hx - h.hl/2)  &&  this.bx <= h.hx  &&  this.by > (h.hy - h.hw/2)  &&  this.by < (h.hy + h.hw/2) ) {
        this.bxs = -(this.bxs);
      }
    }
    
    // Collision check for right edge of hand:
    if (this.bxs < 0) {                           // NOTE: This VVV can compare the ball edge instead for more strict detection.
                                                  // Comparing the object centers makes it easier for the player to hit.
                                                  // Can produce different bugs when paddle is in motion.
      if ( (this.bx - this.bd/2) <= (h.hx + h.hl/2)  &&  this.bx >= h.hx  &&  this.by > (h.hy - h.hw/2)  &&  this.by < (h.hy + h.hw/2) ) {
        this.bxs = -(this.bxs);
      }
    }
  }
  
  
  
  // Collision detection and handling for bricks
  this.brickHit = function(br) {

    // Collision check for upper edge of brick:
    if (this.bys > 0) {
      if ( (this.by + this.bd/2) >= br.bry  &&  this.by < (br.bry + brHeight/2)  &&  this.bx > br.brx  &&  this.bx < (br.brx + brWidth) ) {
        this.bys = -(this.bys);
        return true;
      }
    }
    
    // Collision check for lower edge of brick:
    if (this.bys < 0) {
      if ( (this.by - this.bd/2) <= (br.bry + brHeight)  &&  this.by > (br.bry + brHeight/2)  &&  this.bx > br.brx  &&  this.bx < (br.brx + brWidth) ) {
        this.bys = -(this.bys);
        return true;
      }
    }
      
    // Collision check for left edge of brick:
    // if it's moving to the right
    if (this.bxs > 0) {
    // if (the right edge of the ball is past the left edge of the brick and the)
      if ( (this.bx + this.bd/2) >= br.brx  &&  (this.bx + this.bd/2) < (br.brx + brWidth/2)  &&  this.by > br.bry  &&  this.by < (br.bry + brHeight) ) {
        this.bxs = -(this.bxs);
        return true;
      }
    }
    
    // Collision check for right edge of brick:
    if (this.bxs < 0) {
      if ( (this.bx - this.bd/2) <= (br.brx + brWidth)  &&  (this.bx - this.bd/2) > (br.brx + brWidth/2)  &&  this.by > br.bry  &&  this.by < (br.bry + br.brHeight) ) {
        this.bxs = -(this.bxs);
        return true;
      }
    }
  }

// Collision detection for other balls (??? How to make this reflect accurately?)
  // this.ballHit = function(b) {
  //   var collide = dist(this.bx, this.by, b.bx, b.by);  // Distance function checks (x,y) of one object against (x2, y2) of another.
  //   if (collide < ((this.bd/2)+(b.bd/2))) {  // If the distance between the balls in less than their combined radius, we have collision.
  //     console.log("BAM");
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}



/////////////////////// Hand ////////////////////////////

//  Functions include:
//    render, move

// Constructor
function hand(hx, hy, hl, hw, hc /* hxs, hys */) { // Will eventually need z-axis and accel/gyro vars
  this.hx = hx;
  this.hy = hy;
  this.hl = hl;
  this.hw = hw;
  this.hc = hc;
  // this.hxs = hxs;
  // this.hys = hys;
  
  // Draw the hand
  this.render = function() {
    push();
    fill(this.hc);
    rectMode(CENTER);
    rect(this.hx, this.hy, this.hl, this.hw);
    pop();
  }
  
  // Move the hand
  this.move = function() {
    this.hx = locationX;
    this.hy = locationY;  // optionally, 5/6*height
  }

}



/////////////////////// Brick ////////////////////////////

//  Functions include:
//    render, wreck

// Brick object constructor:
function brick(x, y, r, g, b, s) {
  this.brx = x * brWidth;  // Properties of every brick
  this.bry = y * brHeight;
  this.r = r;
  this.g = g;
  this.b = b;
  this.special = s;
  if (this.special == 3) {
    // Special Qualities
    this.r = gold[0];
    this.g = gold[1];
    this.b = gold[2];
  }
  
  this.render = function() {
    fill(this.r, this.g, this.b);
    rect(this.brx, this.bry, brWidth, brHeight);
  }
  
  this.destroy = function() {
    if (this.special == 3) {
      newBall = new ball((this.brx + brWidth/2), (this.bry + brHeight/2), 20, gold, random(3, 6), random(-5, -9));
      orbs.push(newBall);
      orbCount++;
      //console.log(orbs);
    }
    score++;
    //console.log("Score: " + score + " Brick broken at " + this.brx + " ," + this.bry);
    
  }
}



/////////////////////// Colors ////////////////////////////
function r(row) {
  rd = abs(map(row, 0, rows, 255, -255));
  return rd;
}

function g(row) {
  grn = map(row, 0, rows, 85, 595);
  if (grn > 255) {
    grn = 255 - (grn - 255);
  }
  return grn;
}

function b(row) {
  blu = abs(map(row, 0, rows, 85, -425));
  if (blu > 255) {
    blu = 255 - (blu - 255);
  }
  return blu;
}



// Color conversion algorithm from https://gist.github.com/mjackson/5311256

// /**
// * Converts an RGB color value to HSV. Conversion formula
// * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
// * Assumes r, g, and b are contained in the set [0, 255] and
// * returns h, s, and v in the set [0, 1].
// *
// * @param   Number  r       The red color value
// * @param   Number  g       The green color value
// * @param   Number  b       The blue color value
// * @return  Array           The HSV representation
// */
// function rgbToHsv(r, g, b) {
//   r /= 255, g /= 255, b /= 255;

//   var max = Math.max(r, g, b), min = Math.min(r, g, b);
//   var h, s, v = max;

//   var d = max - min;
//   s = max == 0 ? 0 : d / max;

//   if (max == min) {
//     h = 0; // achromatic
//   } else {
//     switch (max) {
//       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//       case g: h = (b - r) / d + 2; break;
//       case b: h = (r - g) / d + 4; break;
//     }

//     h /= 6;
//   }

//   return [ h, s, v ];
// }








