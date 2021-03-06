/*
 * Breakout 3D - CC Final Project Draft  B:3D??
 * Tavius Koktavy
 */

/*
  DRAFTING BOARD - What do I need from the p5 side?
 
  - Graphics
    - 3D representation of the hand
    - The Camera
      - May need a WIDE angle of view (otherwise how can I tell where they're looking???)
      - Fixed or variable? Can I track this? (seems like trouble)
      - The camera must be the farthest thing back (always keep ball visible w/fixed)
        - With an invisible 'wall' plane as anti-goal/ball-kill-zone in front of that
        - The play-space should be bounded in front of this
          - Display a warning if player moves outside of space, but still keep accurate
            track of their position data to reset upon return.
            - (Use flex sensor when starting game to bound a custom space? By grabbing
              the corners, e.g. Front-bottom-left and Back-top-right, to allow for players
              of different heights, etc.)
    - The Ball
      - (CHECK) Start without gravity physics, get the ball bouncing off the hand as a block along
        a 2D plane, then 3D space
        - Next add acceleration response, that it bounces more dramatically when it
          impacts an accelerating paddle.
          - Then you can incorporate more complex angles via the gyroscope
    - The Wall
      - (CHECK) Create a grid of rectangular boxes
      - (CHECK) Have them disappear from the appropriate location upon impact
        - Could you do this by replacing the 'solid' brick with an 'empty' brick of 
          different properties?
            - This is also the way to add 'bonus' bricks
    - The Game
      - Perhaps use a counter that increments every time a brick is destroyed, triggering
        Game Over when it reaches the total number of bricks?
      - Points based on ball speed? More points if a brick is broken within a short time of
        the previous brick being broken?
    - Reading/Writing Data
      - Can both Arduino and p5 be sending messages back and forth???
        - How to sync this without colliding messages???
        - Arduino must send accel/gyro data (+ flex sensor for catch/pick up)
          - p5 translates this into paddle movements (+ ball control)
        - p5 then sends back accuracy data (+ ball held)
          - Arduino then translates this into the appropriate LED output

 */
 


function setup() {
  createCanvas(areaWidth, areaHeight);
  fill(0);
  //var columns = areaWidth/brickSize;
  //var rows = (height/2)/brickSize; // May need to be an adjusted bricksize as well
  
  // Blank brick array intitialization
  bricks = new Array(columns);        // Make an array over the width (columns)
  for (var i = 0; i < columns; i++) { // Loop over those columns
    bricks[i] = new Array(rows);      // And make a block for every row of every column
  }
  
  // Fill the array
  for (var co = 0; co < columns; co++) { // Loop over each column
    for (var ro = 0; ro < rows; ro++) {  // Loop over each row of the current column
      bricks[co][ro] = new brick(co, ro, round(random(1, 50))); // Initialize a block object in the array, at that (x,y) position
      bricks[co][ro].make();   // 'Activate' that block, giving it color and a shape
      //console.log()
    }
  }
  
  // Initialize play
  orbs = new Array();
  ball = new Ball(300, 300, 20, 255, 5, 9);
  orbs.push(ball);
  
  player = new Hand(mouseX, mouseY, 120, 20, color(255));
}



function draw() {
  background(0, 0, 0, 200);

  for (var i = 0; i < columns; i++) { // Loop over each column
    for (var j = 0; j < rows; j++) {  // Loop over each row of the current column
      for (var k = 0; k < orbs.length; k++) {
        orbs[k].brickHit(bricks[i][j]);    // Check for collision at this brick
        if (bricks[i][j].alive === false) {
          bricks[i][j].broken();
        }
        else {
          bricks[i][j].make();
        }
      }
    }
  }
  
  if (score == columns*rows) {
    console.log("U WONTON!");
  }
  
  for (var m = 0; m < orbs.length; m++) {
    orbs[m].render();
    orbs[m].move();
  }
  
  for (var c = 0; c < orbs.length; c++) {
    orbs[c].handHit(player);
    orbs[c].wallHit();
  }

  
  player.render();
  player.move();

  //console.log();
}








