// P5.js animation

var phase, speed, maxCircleSize, numRows, numCols, numStrands, colorA, colorB;

var resize = 1.6;

// Setup  canvas
function setup() {

  // Create canvas
  var canvas = createCanvas(windowWidth/resize, 100 );

  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');

  noStroke();
  
  phase = 0;
  speed = .01;
  //maxCircleSize = 15;
  numRows = 2;
  numCols = 36;
  numStrands = 6;
  
  // Set colors
  rA = 133;
  gA = 174;
  bA = 120;
  rB = 26;
  gB = 129;
  bB = 161;

  colorA = color(rA,gA,bA);
  colorB = color(rB,gB,bB);

  //colorA = color(133, 174, 120);
  //colorB = color(26, 129, 161);
}


// Draw aimation
function draw() {

  maxCircleSize = windowWidth/60;

  background(245, 245, 245);
  phase = frameCount * speed;
  
  for(var strand = 0; strand < numStrands; strand += 2) {
    var strandPhase = phase + map(strand, 0, numStrands, 0, TWO_PI);
    
    for(var col = 20; col < numCols; col += 1) {
      var colOffset = map(col, 10, numCols, 0, TWO_PI);
      var x = map(col, 20, numCols, 60, width - 50);
      
      for(var row = 0; row < numRows; row += 1) {
        var y = height/2 + row * 10 + cos(strandPhase + colOffset) * 20;
        var sizeOffset = (cos(strandPhase + (row * numRows) + colOffset) + 1) * 0.5;
        var circleSize = sizeOffset * maxCircleSize;
        
        fill(lerpColor(colorA, colorB, row / numRows));
        ellipse(x, y, circleSize, circleSize);
      }
    }
  }
}

// Resize animation based on browser window Size
function windowResized() {

	resizeCanvas(windowWidth/resize, 100);
}

function mousePressed() {

	if (mouseX < windowWidth/resize && mouseX > windowWidth/40 
		&& mouseY > 20 && mouseY < 90) {
		colorA = color(random(255), random(255), random(255));
		colorB = color(random(255), random(255), random(255));
	}
}