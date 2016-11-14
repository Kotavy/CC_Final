




/////////////////////// Game ////////////////////////////

// Game Won
function gameWon() {
  if (score == columns*rows) {
    console.log("WONTON!");
    bg = [281, 165, 32, 10];
    fill(0);
    textAlign(CENTER);
    text("WONTON", width/2, height/2 - 1*height/10);
    text("You Scored: " + score + " points.", width/2, height/2);
    gameActive = false;
  }
}

// Game Over
function gameOver() {
  if (orbCount === 0) {
    console.log("lol");
    bg = [255, 0, 0, 10];
    fill(0);
    textAlign(CENTER);
    text("NONTON", width/2, height/2 - 1*height/10);
    gameActive = false;
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
      orbCount--;
      this.alive = false;
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
    this.hx = mouseX;
    this.hy = mouseY;  // optionally, 5/6*height
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








