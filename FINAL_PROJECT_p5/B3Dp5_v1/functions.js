





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
    stroke(0);
    strokeWeight(0.5);
    fill(this.bc);
    ellipse(this.bx, this.by, this.bd, this.bd);
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
    if (this.by > height || this.by < 0) {
      this.bys = -(this.bys);
    }  
  }
  
  // Collision detection for other balls
  this.ballHit = function(b) {
    var collide = dist(this.bx, this.by, b.bx, b.by);  // Distance function checks (x,y) of one object against (x2, y2) of another.
    if (collide < ((this.bd/2)+(o.bd/2))) {  // If the distance between the balls in less than their combined radius, we have collision.
      return true;
    } else {
      return false;
    }
  }
  
  // Collision detection and handling for hand front (BASIC)
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
    fill(this.hc);
    rectMode(CENTER);
    rect(this.hx, this.hy, this.hl, this.hw);
  }
  
  // Move the hand
  this.move = function() {
    this.hx = mouseX;
    this.hy = mouseY;  // optionally, 5/6*height
  }

}




