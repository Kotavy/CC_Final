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
          
    - (CHECK) The Wall
      - (CHECK) Create a grid of rectangular boxes
      - (CHECK) Have them disappear from the appropriate location upon impact
        - (CHECK) Could you do this by replacing the 'solid' brick with an 'empty' brick of 
          different properties? (Nah, just make that array position null, for memory)
          - (CHECK) This is also the way to add 'bonus' bricks
            
    - The Game
      - (CHECK) Perhaps use a counter that increments every time a brick is destroyed, triggering
        Game Win when it reaches the total number of bricks.
      - Points based on ball speed? More points if a brick is broken within a short time of
        the previous brick being broken?
        - (CHECK) Score output in game window
      - Highscores:
        // This prints all the lines from the source text file.
        String[] lines = loadStrings("high_scores.txt");
        println("there are " + lines.length + " lines");
        println(lines);
        
        // This writes the array to a file, each on a separate line
        String words = "apple bear cat dog";
        String[] list = split(words, ' ');
        saveStrings("high_scores.txt", list);
        
    - The Interface
      - (CHECK) Yes -> Can both Arduino and p5 be sending messages back and forth???
        - (CHECK) byte listeners -> How to sync this without colliding messages???
        - (Semi-CHECK) Arduino must send accel/gyro data (+ flex sensor for catch/pick up)
          - (CHECK) p5 translates this into paddle movements (+ ball control)
            - Could be smoother with more complex algorithms
        - p5 then sends back accuracy data (+ ball held)
          - Arduino then translates this into the appropriate LED output

 */
 


function setup() {
  createCanvas(areaWidth, areaHeight);
  serialSetup();
  resetSketch();
}



function draw() {
  background(bg);
  //fill(circleColor);           // fill depends on the button
  
  gameWon();
  gameOver();
  // Allow other things to happen, such as when the player successfully catches the last remaining ball (by sensor flex activation below some distance) the game "pauses" and only the background, ball, and hand render.
  if (gameActive === false) {
    startup();
    //restart();
    return;
  }
  
  text("Score: " + highscore, 1*width/10, 9*height/10);

  // Collision/Bricks loop
  for (var o = 0; o < orbs.length; o++) {           // For every ball in the orb array
    if (orbs[o].alive === true) {                   // If so,
      orbs[o].wallHit();                            // Check for collision with walls
      orbs[o].handHit(player);                      // Check for collision with hand
      for (var co = 0; co < columns; co++) {
        for (var ro = 0; ro < rows; ro++) {
          if (bricks[co][ro] !== null) {            // If the brick exists
             if (orbs[o].brickHit(bricks[co][ro]) === true) { // Check for collision
               bricks[co][ro].destroy();             // If so, increment score/activate special bricks
               bricks[co][ro] = null;
             }
            else {
              bricks[co][ro].render();              // Otherwise, render
            }
          }
        }
      }
    }
  }
  
  // Update loop
  for (var i = 0; i < orbs.length; i++) {
    //console.log
    if (orbs[i].alive === true) {           // For each ball still in play
      orbs[i].outOfBounds();                // Check to see if it should be
      orbs[i].render();                     // Render and
      orbs[i].move();                       // Update position data
    }
  }
  
  player.render();
  player.move();

  //console.log("Orbs[] length is: " + orbs.length);
}








