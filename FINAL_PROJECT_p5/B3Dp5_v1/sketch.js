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
      - Create a grid of rectangular boxes
      - Have them disappear from the appropriate location upon impact
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
  createCanvas(800, 600);
  fill(0);
  
  ball = new Ball(300, 300, 20, 255, 5, 9);
  player = new Hand(mouseX, mouseY, 120, 20, color(255));
}

function draw() {
  background(0);
  push();
  ball.render();
  ball.move();
  ball.handHit(player);
  ball.wallHit();
  player.render();
  player.move();
  pop();
  console.log();
}








