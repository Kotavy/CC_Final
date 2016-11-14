





/////////////////////// Ball ////////////////////////////

// Functions include:
//  render, move, wallHit, ballHit, handHit

// Constructor
function Ball(bx, by, bd, bc, bxs, bys) {
  this.bx = bx;
  this.by = by;
  this.bd = bd;
  this.bc = bc;
  this.bxs = bxs;
  this.bys = bys;
  
  // Draw the ball
  this.render = function() {
    push();
    stroke(0);
    strokeWeight(0.5);
    fill(this.bc);
    ellipse(this.bx, this.by, this.bd, this.bd);
    pop();
  }
  
  // Move the ball
  this.move = function() {
    this.bx = this.bx + this.bxs;
    this.by = this.by + this.bys;
  }
  
  // Collision detection and handling for walls
  this.wallHit = function() {
    if (this.bx > width || this.bx < 0) {
      this.bxs = -(this.bxs);
    }
    if (this.by < 0 /*|| this.by > height*/) {
      this.bys = -(this.bys);
    }

  }
  
  // Destroy a ball out of bounds
  this.lost = function() {
    if (this.by > height) {
      return true;
    } else {
      return false;
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
    
    // Collision check for lower edge of hand:
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
    if (this.bxs < 0) {                           // NOTE: This VVV can compare the ball edge for more strict detection. Comparing the centers makes it easier for the player to hit. Can produce different bugs when paddle is in motion.
      if ( (this.bx - this.bd/2) <= (h.hx + h.hl/2)  &&  this.bx >= h.hx  &&  this.by > (h.hy - h.hw/2)  &&  this.by < (h.hy + h.hw/2) ) {
        this.bxs = -(this.bxs);
      }
    }
  }
  
  
  
  // Collision detection and handling for bricks
  this.brickHit = function(br) {
  
    if (br.alive === true) {
      // Collision check for upper edge of brick:
      if (this.bys > 0) {
        if ( (this.by + this.bd/2) >= br.bry  &&  this.by < (br.bry + brHeight/2)  &&  this.bx > br.brx  &&  this.bx < (br.brx + brWidth) ) {
          this.bys = -(this.bys);
          br.wreck();
        }
      }
    
      // Collision check for lower edge of brick:
      if (this.bys < 0) {
        if ( (this.by - this.bd/2) <= (br.bry + brHeight)  &&  this.by > (br.bry + brHeight/2)  &&  this.bx > br.brx  &&  this.bx < (br.brx + brWidth) ) {
          this.bys = -(this.bys);
          br.wreck();
        }
      }
      
      // Collision check for left edge of brick:
      // if it's moving to the right
      if (this.bxs > 0) {
      // if (the right edge of the ball is past the left edge of the brick and the)
        if ( (this.bx + this.bd/2) >= br.brx  &&  (this.bx + this.bd/2) < (br.brx + brWidth/2)  &&  this.by > br.bry  &&  this.by < (br.bry + brHeight) ) {
          this.bxs = -(this.bxs);
          br.wreck();
        }
      }
    
      // Collision check for right edge of brick:
      if (this.bxs < 0) {
        if ( (this.bx - this.bd/2) <= (br.brx + brWidth)  &&  (this.bx - this.bd/2) > (br.brx + brWidth/2)  &&  this.by > br.bry  &&  this.by < (br.bry + br.brHeight) ) {
          this.bxs = -(this.bxs);
          br.wreck();
        }
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

// Functions include:
//  render, move

// Constructor
function Hand(hx, hy, hl, hw, hc /* hxs, hys */) { // Will eventually need z-axis and accel/gyro vars
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

// Brick object constructor:
function brick(x, y, s) {
  this.brx = x * brWidth;  // Properties of every brick
  this.bry = y * brHeight;
  this.r = 255;
  this.g = 255;
  this.b = 255;
  this.alive = true;
  this.special = s;
  if (this.special == 3) {
    // Special Qualities
    this.g = 0;
    this.b = 0;
  }
  
  
  // Two functions of brick objects:
    // Make overwrites the object's color variables, then prints to draw
  this.make = function() {
    fill(this.r, this.g, this.b);
    rect(this.brx, this.bry, brWidth, brHeight);
  }
  
  this.wreck = function() {
    if (this.special == 3) {
      ball = new Ball((this.brx + brWidth/2), (this.bry + brHeight/2), 20, 200, random(3, 6), random(-5, -9));
      orbs.push(ball);
      // orbs.splice(this, 1);
      //console.log(orbs);
    }
    this.alive = false;
    score++;
    console.log("Score: " + score + " Brick broken at " + this.brx + " ," + this.bry);

  }
  
  this.broken = function() {
    fill(0);
    rect(this.brx, this.bry, brWidth, brHeight);
  }
  
}



