let pointsLists;
let currentPointsList;
let redoPointsLists;
let myStrokeWeightEraser, myStrokeWeightBrush, myStroke;
let font;
let allowDragStrokeWeightBar;
let eraserImg;
let brushImg;
let eraserMode;
let undoImg;
let redoImg;
let isCtrlPressed;
let isZPressed;
let isYPressed;
let availableColors;
let selectedColor;

function preload(){
  font = loadFont("Montserrat-Regular.otf");
  brushImg = loadImage("icons8-paint-brush-64.png");
  eraserImg = loadImage("icons8-eraser-40.png");
  undoImg = loadImage("icons8-undo-40.png");
  redoImg = loadImage("icons8-redo-40.png");
}

function setup() {
  createCanvas(800, 600);
  textFont(font);
  selectedColor = 0;
  availableColors = [[0,0,0], [127,127,127], [136,0,21], [237,28,36], [255,127,39], [255,242,0], [34,177,76],
                     [0,162,232], [63,72,204], [163,73,164], [255,255,255], [195,195,195], [185,122,87], [255,174,201],
                     [255,201,14], [239,228,176], [181,230,29], [153,217,234], [112,146,190], [200,191,231]];
  myStrokeWeightBrush = 5;
  myStrokeWeightEraser = 40;
  myStroke = availableColors[selectedColor];
  drawBorders();
  pointsLists = [];
  currentPointsList = [];
  redoPointsLists = [];
}

function draw() {
  background(255);
  drawPoints();
  drawPointer();
  drawMenu();
  drawBorders();
  if (isCtrlPressed  && isZPressed) manageUndo();
  if (isCtrlPressed  && isYPressed) manageRedo();
}

function addPointToCurrentPointsList(x, y){
  let currentPoint = {};
  currentPoint.x = x;
  currentPoint.y = y;
  if(!eraserMode) currentPoint.strokeWeight = myStrokeWeightBrush;
  else currentPoint.strokeWeight = myStrokeWeightEraser;
  currentPoint.stroke = myStroke;
  currentPointsList.push(currentPoint);
}


function drawPoints() {
  for(var i = 0; i < pointsLists.length; i++) drawPointsList(pointsLists[i]);
  drawPointsList(currentPointsList);
}

function drawPointsList(pointsList){
  var firstPoint, secondPoint, onePoint;
  if (pointsList && pointsList.length > 1){
    for(var j = 0; j < pointsList.length - 1; j++){
      firstPoint = pointsList[j];
      secondPoint = pointsList[j+1];
      strokeWeight(firstPoint.strokeWeight);
      stroke(firstPoint.stroke);
      line(firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y);
    }
  }else if(pointsList && pointsList.length === 1){
    onePoint = pointsList[0];
    strokeWeight(onePoint.strokeWeight);
    stroke(onePoint.stroke);
    point(onePoint.x, onePoint.y);
  }
}


function drawBorders(){
  noFill();
  strokeWeight(1);
  stroke(0);
  rect(0, 0, width, height);
}

function drawMenu(){
  stroke(128);
  strokeWeight(5);
  line(0, 0.1*height, width, 0.1*height);
  
  image(undoImg, 0.05*width, 0.005*height, 40, 40);
  image(redoImg, 0.15*width, 0.005*height, 40, 40);
  image(brushImg, 0.275*width, 0.02*height, 40, 40);
  image(eraserImg, 0.35*width, 0.02*height, 40, 40);
  
  noFill();
  stroke(0);
  strokeWeight(1);
  if(!eraserMode) rect(0.27*width, 0.015*height, 45, 45);
  if(eraserMode) rect(0.347*width, 0.015*height, 45, 45);
  
  fill(availableColors[selectedColor]);
  rect(0.46*width, 0.0325*height, 25, 25);
  
  for(var i = 0; i < 10; i++){
    fill(availableColors[i]);  
    rect(i*0.025*width + 0.5*width, 0.0225*height, 15, 15);
    fill(availableColors[i+10]);  
    rect(i*0.025*width + 0.5*width, 0.0575*height, 15, 15);
  }
  
  stroke(0);
  strokeWeight(2);
  line(0.8*width, 0.06*height, 0.95*width, 0.06*height);
  
  fill(255);
  if(!eraserMode) rect(map(myStrokeWeightBrush, 1, 10, 0.795, 0.95)*width, 0.04*height, 0.01*width, 0.04*height);
  else rect(map(myStrokeWeightEraser, 1, 75, 0.795, 0.95)*width, 0.04*height, 0.01*width, 0.04*height);
  
  noFill();
  strokeWeight(0.5);
  if(!eraserMode){
    text("1", 0.79*width, 0.0625*height);
    text("10", 0.97*width, 0.0625*height);
  }else{
    text("1", 0.79*width, 0.0625*height);
    text("75", 0.97*width, 0.0625*height);
  }
  textAlign(CENTER);
  text("Grosor", 0.875*width, 0.03*height);
  text("Ctrl+Z", 0.076*width, 0.085*height);
  text("Ctrl+Y", 0.176*width, 0.085*height);
}

function drawPointer(){
  if (mouseY > 0.1*height){
    noFill();
    strokeWeight(1);
    stroke(0);
    fill(myStroke[0], myStroke[1], myStroke[2], 75);
    if(!eraserMode) circle(mouseX, mouseY, map(myStrokeWeightBrush, 1, 10, 5, 15));
    else circle(mouseX, mouseY, map(myStrokeWeightEraser, 1, 75, 1, 75));
  }
}

function keyPressed(){
  if(key == 'z' || key == 'Z') isZPressed = true;
  if(key == 'y' || key == 'Y') isYPressed = true;
  if(keyCode == 17) isCtrlPressed = true;
}

function keyReleased(){
  if(key == 'z' || key == 'Z') isZPressed = false;
  if(key == 'y' || key == 'Y') isYPressed = false;
  if(keyCode == 17) isCtrlPressed = false;
}

function mouseDragged() {
  manageNewPoint();
  changeStrokeWidthBarPosition(false);
}

function mousePressed(){
  manageNewPoint();
  manageUndo();
  manageRedo();
  manageBrush();
  manageEraser();
  manageColors();
  changeStrokeWidthBarPosition(true);
}

function mouseReleased(){
  if(currentPointsList.length > 0){
    pointsLists.push(currentPointsList);
    currentPointsList = [];
    redoPointsLists = [];
  }
  allowDragStrokeWeightBar = false;
}

function manageNewPoint(){
  if (mouseY > 0.1*height) {
    addPointToCurrentPointsList(mouseX, mouseY);
  }else if (currentPointsList.length > 0){
    pointsLists.push(currentPointsList);
    currentPointsList = [];
    redoPointsLists = [];
  }
}

function manageUndo(){
  if ((mouseX > 0.05*width && mouseX < 0.05*width + 40 && 
      mouseY > 0.02*height && mouseY < 0.02*height + 50) || 
     isZPressed && isCtrlPressed){
    redoPointsLists.push(pointsLists.pop());
    isZPressed = false;
  }
}

function manageRedo(){
  if (redoPointsLists.length > 0 && 
      ((mouseX > 0.15*width && mouseX < 0.15*width + 40 && 
      mouseY > 0.02*height && mouseY < 0.02*height + 50) || 
     (isYPressed && isCtrlPressed))){         
    pointsLists.push(redoPointsLists.pop());
    isYPressed = false;
  }
}

function manageBrush(){
  if (mouseX > 0.27*width && mouseX < 0.27*width + 45 && 
      mouseY > 0.015*height && mouseY < 0.015*height + 45){
    myStroke = availableColors[selectedColor];
    eraserMode = false;
  }
}

function manageEraser(){
  if (mouseX > 0.347*width && mouseX < 0.347*width + 45 && 
      mouseY > 0.015*height && mouseY < 0.015*height + 45){
    myStroke = [255, 255, 255];
    eraserMode = true;
  }
}

function manageColors(){
  rect(i*0.025*width + 0.5*width, 0.0225*height, 15, 15);
  for(var i = 0; i < 10; i++){
    if (mouseX > i*0.025*width + 0.5*width && mouseX < i*0.025*width + 0.5*width + 15 &&
        mouseY > 0.0225*height && mouseY < 0.0225*height + 15){
      selectedColor = i;
      if (!eraserMode) myStroke = availableColors[selectedColor];
    }else if (mouseX > i*0.025*width + 0.5*width && mouseX < i*0.025*width + 0.5*width + 15 &&
        mouseY > 0.0575*height && mouseY < 0.0575*height + 15){
      selectedColor = i+10;
      if (!eraserMode) myStroke = availableColors[selectedColor];
    }
  }
}

function changeStrokeWidthBarPosition(mode){
  if (mouseX > 0.795*width && mouseX < 0.95*width && 
      mouseY > 0.03*height && mouseY < 0.09*height)
    if (mode || allowDragStrokeWeightBar){
      if(!eraserMode) myStrokeWeightBrush = map(mouseX, 0.795*width, 0.95*width, 1, 10)
      else myStrokeWeightEraser = map(mouseX, 0.795*width, 0.95*width, 1, 75)
      allowDragStrokeWeightBar = true;
    }
}