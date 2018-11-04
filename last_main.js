// limits of this version

// DONE
// Save can only be donne on min boxWidth=4
// and if the pattern has max 1000 alive cells


// TO BE DONE
// boxWidth < 2 only authorized up to 1360px wide



/*----------------------------------------------------------------------------------------------------
  -------------------------------------Initialization----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/


let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
canvas.addEventListener('click', selectBox);

let wrapper = document.getElementById("wrapper");
let startScreen = document.getElementById("startScreen");

function displayGame(){
  startScreen.style.display= "none";
  wrapper.style.display= "grid";
  openFullscreen();
  setup();
}

function openFullscreen() {
  if (wrapper.requestFullscreen) {
    wrapper.requestFullscreen();
  } else if (wrapper.mozRequestFullScreen) { /* Firefox */
    wrapper.mozRequestFullScreen();
  } else if (wrapper.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    wrapper.webkitRequestFullscreen();
  } else if (wrapper.msRequestFullscreen) { /* IE/Edge */
    wrapper.msRequestFullscreen();
  }
}



/*--------PANEL DISPLAY FUNCTIONS-------------------------*/

let panel = document.getElementById('panel');
let panelItem = document.querySelector('.panelItem');
let gameStatsContainer = document.querySelector('.gameStatsContainer');

let plusMinusButtons = document.getElementById("plusMinusButtons");
let speedUpButton = document.getElementById('plus');
let speedDownButton = document.getElementById('minus');
let sizeUpButton = document.getElementById('plus');
let sizeDownButton = document.getElementById('minus');

let openSavedButton = document.getElementById('openSavedButton');
let saveButtons = document.getElementById('saveButtons');

let saveButton = document.getElementById('save');
let previousButton = document.getElementById('previous');
let nextButton = document.getElementById('next');
let deleteButton = document.getElementById('delete');

let speedIndicator = document.getElementById('speedIndicator');
let gridSizeIndicator = document.getElementById('gridSize');


var speedDisplayed = 0;
var gridSizeDisplayed = 0;
var saveDisplayed = 0;

function hideButtons(){
  if (speedDisplayed == 1 || gridSizeDisplayed == 1){
    plusMinusButtons.style.display = "none";
    speedDisplayed = 0;
    gridSizeDisplayed = 0;
  }

  if (saveDisplayed == 1){
    saveButtons.style.display = "none";
    saveDisplayed = 0;
  }
}

function hideSpeedButtons(){

  if (speedDisplayed == 1 || gridSizeDisplayed == 1){
    plusMinusButtons.style.display = "none";
    displayed = 0;
  }
}

function hideGridButtons(){
  if (saveDisplayed == 1){
    saveButtons.style.display = "none";
    displayed = 0;
  }
}

function displaySpeedButtons(){
  sizeUpButton.removeEventListener('click', boxSizeDown);
  sizeDownButton.removeEventListener('click', boxSizeUp);
  speedUpButton.addEventListener('click', speedUp);
  speedDownButton.addEventListener('click', speedDown);
  plusMinusButtons.style.display = "none";


  if (speedDisplayed == 0){
    plusMinusButtons.style.display = "grid";
    plusMinusButtons.style.left = "5px";
    plusMinusButtons.style.right = "";  //extend from here on wider screens
    speedDisplayed = 1;
    saveButtons.style.display = "none";
    saveDisplayed = 0;
    gridSizeDisplayed = 0;
  }
  else{
    plusMinusButtons.style.display = "none";
    speedDisplayed = 0;
  }
}

function displayGridButtons(){
  speedUpButton.removeEventListener('click', speedUp);
  speedDownButton.removeEventListener('click', speedDown);
  sizeUpButton.addEventListener('click', boxSizeDown);
  sizeDownButton.addEventListener('click', boxSizeUp);
  plusMinusButtons.style.display = "none";


  if (gridSizeDisplayed == 0){
    plusMinusButtons.style.display = "grid";
    plusMinusButtons.style.left = ""; //extend from here on wider screens
    plusMinusButtons.style.right = "5px";
    gridSizeDisplayed = 1;
    saveButtons.style.display = "none";
    saveDisplayed = 0;
    speedDisplayed = 0;
  }
  else{
    plusMinusButtons.style.display = "none";
    gridSizeDisplayed = 0;
  }
}

function displaySaveButtons(){
  if (saveDisplayed == 0){
    saveButtons.style.display = "grid";
    saveDisplayed = 1;
    plusMinusButtons.style.display = "none";
    speedDisplayed = 0;
    gridSizeDisplayed = 0;
    //noRespawn = 0;
  }
  else{
    saveButtons.style.display = "none";
    saveDisplayed = 0;
  }

}


function getOpenSavedButtonPosition(){
  if (window.innerWidth < 480){
    var rect = openSavedButton.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    var button_center = Math.floor(rect.left + ((rect.right-rect.left)/2));
    console.log(button_center);
    saveButonPosition = button_center - 78;
    saveButtons.style.left = saveButonPosition + "px";
  }
  else{
    saveButtons.style.display = "none";
    saveDisplayed = 0;
  }
}




/*----------------------------------------------------------------------------------------------------
  -------------------------------------GAME SETUP----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/


// grid global vars
let grid;
let cols;
let rows;
let boxWidth;


var pageWidth;
var pageHeight;
function getScreenRatio(){
  pageWidth = window.innerWidth;
  pageHeight = window.innerHeight;
  var screenRatio = pageWidth/pageHeight;
  //console.log(screenRatio);
  return screenRatio;
}



function resize(){
  //pageWidth = window.innerWidth;
  //pageHeight = window.innerHeight;
  pageWidth = window.screen.availWidth;
  pageHeight = window.screen.availHeight;

  var rect = panel.getBoundingClientRect();
  var panelHeight = rect.bottom - rect.top;
  console.log("panelHeight : " + panelHeight);

  // rect = gameStatsContainer.getBoundingClientRect();
  // var gameStatsContainerHeight = rect.bottom - rect.top;

  
  if (pageWidth/pageHeight > 1){
    canvas.width = pageWidth;
    canvas.height = pageHeight - (panelHeight/2);
  }
  else{
    canvas.width = pageWidth;
    canvas.height = pageHeight - panelHeight;
  }

  /*if(pageWidth>770){
    canvas.width = Math.floor(pageWidth/50)*50 ;
    canvas.height = Math.floor(pageHeight/50)*50;
  }*/
}

function setup(){
  resize();
  createSizeList();
  cols = canvas.width / boxWidth;
  rows = canvas.height / boxWidth;
  //drawGrid();
  getOpenSavedButtonPosition();
  createGridArray();
  loadPatterns();
  random();
  draw();
  genCounterElement.innerText= "Generation 0";
  gridSizeIndicator.innerText= cols + "*" + rows;
}


var minSize = 1;
var maxSize = 100;
var sizeList = [];
var boxSizeId = 4;
var nextSize = minSize;
function createSizeList(){
  //var lastSize = minSize;
  var sizeCounter = 0;
  var maxWidth = canvas.width;
  var maxHeight = canvas.height;

  for(i=minSize; i<=100; i++){
    var found = 0;
    var width = maxWidth;
    var height = maxHeight;


    while (found != 1 && width >= canvas.width-10 && height >= canvas.height-10){
      if (width % i == 0){
        if (height % i == 0){
          //if (last_X_numberOfBoxes != width/i && last_Y_numberOfBoxes != height/i){
            sizeList[sizeCounter] = new Size(i, width, height) ;
            sizeList[sizeCounter].canvas_H_offset = Math.floor((maxWidth - width)/2);
            sizeList[sizeCounter].canvas_V_offset = Math.floor((maxHeight - height)/2);
            /*console.log("\nsize : " + i);
            console.log("width : " + width);
            console.log("height : " + height);*/
            sizeCounter = sizeCounter + 1;
            found = 1;
          //  var last_X_numberOfBoxes = width / i;
          //  var last_Y_numberOfBoxes = height / i;
          //}
        }
        else{
          height -= 1;
        }
      }
      else {
        width -= 1;
      }
    }
  }


  boxWidth = sizeList[boxSizeId].boxSize;
  canvas.width = sizeList[boxSizeId].canvas_width;
  canvas.height = sizeList[boxSizeId].canvas_height;
}

function drawGrid(){
  c.fillStyle="black";
  c.fillRect(0,0,canvas.width,canvas.height);

  c.lineWidth = 1;
  c.strokeStyle = "#333e";

  for (var i=1; i<cols; i++){
    c.beginPath();
    c.moveTo(((i*boxWidth)+0.5),1);
    c.lineTo(((i*boxWidth)+0.5), (canvas.height));
    c.stroke();
  }

  for (var i=1; i<rows; i++){
    c.beginPath();
    c.moveTo(1,((i*boxWidth)+0.5));
    c.lineTo(canvas.width, ((i*boxWidth)+0.5));
    c.stroke();
  }
}

function noGrid(){
  c.fillStyle="black";
  c.fillRect(0,0,canvas.width,canvas.height);
}

var boxes;
var boxId;
function createGridArray(){
  boxes = make2DArray(cols,rows);
  boxId = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      //let state = Math.floor(Math.random() * Math.floor(2));
      let state = 0;
      createBox(i,j,state);
      boxId += 1;
    }
  }
}

var liveBoxes = [];
var liveBoxId =0;
function createBox(x, y, state, checked, neighbors, age){

  boxes[x][y] = new box(boxId, x, y,state, checked, neighbors, age);
  boxes[x][y].checked = 0;
  boxes[x][y].neighbors = 0;
  boxes[x][y].age = 0;

  // store live boxes in a list
  if (state == 1){
    liveBoxes[liveBoxId] = boxes[x][y];
    liveBoxId += 1;
  }
}



/*----------------------------------------------------------------------------------------------------
  -------------------------------OBJECT CONSTRUCTORS----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/



function box(boxId, x,y,state, checked, neighbors, age){
  this.boxId = boxId;
  this.x = x;
  this.y = y;
  this.state = state;
  this.checked = checked;
  this.neighbors = neighbors;
  this.age = age;
}

function Size(boxSize, canvas_width, canvas_height, canvas_H_offset, canvas_V_offset){
  this.boxSize = boxSize;
  this.canvas_width = canvas_width;
  this.canvas_height = canvas_height;
  this.canvas_H_offset = canvas_H_offset;
  this.canvas_V_offset = canvas_V_offset;
}

function pattern(id, name, pattern, H_start, H_end, H_spread, H_gridSize, V_start, V_end, V_spread, V_gridSize, displayed){
  this.id = id;
  this.name = name;
  this.pattern = pattern;
  this.H_start = H_start;
  this.H_end = H_end;
  this.H_spread = H_spread;
  this.H_gridSize = H_gridSize;
  this.V_start = V_start;
  this.V_end = V_end;
  this.V_spread = V_spread;
  this.V_gridSize = V_gridSize;
  this.displayed = displayed;
}



/*----------------------------------------------------------------------------------------------------
  -------------------------------------GAME----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/



var gen = 0;
var pause = 1;
var delay = 0;
var once = 0;
var setIntervalId;
var genCounterElement = document.getElementById("generation");
var playIconElement = document.getElementById("playIcon");
function generation(){
  if (once == 0){
    //genCounterElement = document.getElementById("generation");
    var counter = 0;
    pause = 0;
    playIconElement.innerText = "pause";
    clearInterval(setIntervalId);
    setIntervalId = setInterval( function(){
      if (pause == 1){
        clearInterval(setIntervalId);
      }
      else{
      counter = counter + 1;
      createCheckList();
      computeNextGen();
      draw();
      gen = gen + 1;
      var text = "Generation " + gen;
      genCounterElement.innerText= text;
     }
    }, delay);
  }
  once = 1;
}

var checkList = [];
var checkListId = 0;
function createCheckList(){
  checkList.length = 0;
  checkListId = 0;
  for (let i=0 ; i<liveBoxes.length; i++){
    let x = liveBoxes[i].x;
    let y = liveBoxes[i].y;
    addNeighbors(x, y);
  }
  //console.log("liveBoxes : " + liveBoxes.length);
  //console.log("checkList : " +  checkList.length);
}

function addNeighbors (x, y){
  for (let i=-1; i<2; i++){
    for (let j=-1; j<2; j++){
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;

        if (boxes[col][row].checked == 0){
          checkList[checkListId] = boxes[col][row];
          checkList[checkListId].checked = 1;
          checkListId += 1;
        }
    }
  }
}

function computeNextGen(){
  liveBoxes.length = 0;
  liveBoxId = 0;


  //countNeighbors
  for (let i=0 ; i<checkList.length; i++){
    let x = checkList[i].x;
    let y = checkList[i].y;
    checkList[i].neighbors = 0;
    checkList[i].checked = 0;
    let neighbors = countNeighbors(x, y);
    checkList[i].neighbors = neighbors;
   }


  //apply rules
  for (let i=0 ; i<checkList.length; i++){
    if (checkList[i].state == 0 && checkList[i].neighbors == 3){
      checkList[i].state=1;
      //checkList[i].age += 1;
      liveBoxes[liveBoxId] = checkList[i];
      liveBoxId += 1;
    }
    else if (checkList[i].state == 1 && (checkList[i].neighbors == 2 || checkList[i].neighbors == 3)){
      //checkList[i].age += 1;
      liveBoxes[liveBoxId] = checkList[i];
      liveBoxId += 1;
    }
    else{
      checkList[i].state = 0;
      //checkList[i].age = 0;
    }
  }
}

function countNeighbors (x, y){
  let sum = 0;
  for (let i=-1; i<2; i++){
    for (let j=-1; j<2; j++){
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += boxes[col][row].state;
    }
  }
  sum -= boxes[x][y].state;
  return sum;
}

function draw(){
  if(boxWidth >= 3){
    drawGrid();
    var width = boxWidth-1;
    var offset = 1;
  }
  else{
    noGrid();
    var width = boxWidth;
    var offset = 0;
  }


  c.fillStyle="green";
  for (let i=0 ; i<liveBoxes.length; i++){
      let x = (liveBoxes[i].x * boxWidth) + offset;
      let y = (liveBoxes[i].y * boxWidth) + offset;
      c.fillRect(x,y,width,width);
  }
}




/*----------------------------------------------------------------------------------------------------
  -------------------------------------UI FUNCTIONS-------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/



function selectBox(e){
  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
    // mouse position
    var pos = getMousePos(canvas, e); // in OTHER FUNCTIONS section
          xpos = pos.x -1;
          ypos = pos.y-1;

    // box grid position
    var boxX = Math.ceil(xpos/boxWidth) ;
    var boxY = Math.ceil(ypos/boxWidth) ;
    //console.log(boxX + "-" + boxY);

    // box start coordonates
    var startX = (boxX-1)*boxWidth;
    var startY = (boxY-1)*boxWidth;

    // draw box & change cell state in grid
    if (boxes[boxX-1][boxY-1].state == 0){
      boxes[boxX-1][boxY-1].state = 1;
      c.fillStyle="blue";
      c.fillRect(startX,startY,boxWidth-1,boxWidth-1);
    }
    else if (boxes[boxX-1][boxY-1].state == 1){
      boxes[boxX-1][boxY-1].state = 0;
      liveBoxes.splice[liveBoxId] = boxes[boxX-1][boxY-1];
      liveBoxId -= 1;
      c.fillStyle="#555";
      c.fillRect(startX,startY,boxWidth-1,boxWidth-1);
    }


    liveBoxes.length = 0;
    liveBoxId = 0;
    drawGrid();
    for (let i=0 ; i<cols; i++){
      for (let j=0; j<rows; j++){
        if(boxes[i][j].state == 1){
          liveBoxes[liveBoxId] = boxes[i][j];
          liveBoxId += 1;
        }
      }
    }

    gen = 0;
    genCounterElement.innerText= gen;

    draw();
  }


function playPause(){

  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
  if (pause == 1){
    if (gen == 0){
      patternZone(); // in OTHER FUNCTIONS section
      cachePattern();  // in OTHER FUNCTIONS section
    }
    pause = 0;
    generation();
  }
  else{
    pause = 1;
    once = 0;
    playIconElement.innerText = "play_arrow";
  }
}

function pauseGame(){
  pause = 1;
  once = 0;
  playIconElement.innerText = "play_arrow";
}

function replay(){

   if (patternObjects[patternNumber] != null){
     patternObjects[patternNumber].displayed = 0;
   }
  H_spread = startPatternObject.H_spread;
  V_spread = startPatternObject.V_spread;

  checkList.length = 0;
  checkListId = 0;
  liveBoxes.length = 0;
  liveBoxId = 0;
  gen = 0;
  genCounterElement.innerText= gen;

  while (H_spread > cols ||  V_spread > rows){
    boxSizeDown();
    liveBoxes.length=0;
    liveBoxId = 0;
  }

  var colsDiff = (cols - H_spread);
  var rowsDiff = (rows - V_spread);
  var H_offset = Math.floor(colsDiff/2);
  var V_offset = Math.floor(rowsDiff/2);

  for (var i = 0; i<cols; i++){
    for (var j = 0; j<rows; j++){
      boxes[i][j].state = 0;
      boxes[i][j].neighbors = 0;
      boxes[i][j].checked = 0;
      boxes[i][j].age = 0;

      if (i >= H_offset && i < H_offset+H_spread && j >= V_offset && j < V_offset+V_spread){
        boxes[i][j].state = startPattern[i-H_offset][j-V_offset];

        if (startPattern[i-H_offset][j-V_offset] == 1){
          liveBoxes[liveBoxId] = boxes[i][j];
          liveBoxId += 1;
        }
      }
    }
  }
  draw();
}


function random(){
  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
  liveBoxes.length=0;
  liveBoxId = 0;
  checkList.length=0;
  checkListId = 0;
  drawGrid();
  gen = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      let state = 0;
      if (Math.random() > 0.5){
        state = Math.floor(Math.random() * Math.floor(2));
      }
      boxes[i][j].state = state;
      if (state == 1){
        liveBoxes[liveBoxId] = boxes[i][j];
        liveBoxId += 1;
      }
    }
  }
  draw();
}

function clearGame(){
  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
  pauseGame();
  liveBoxes.length=0;
  liveBoxId = 0;
  checkList.length=0;
  checkListId = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      boxes[i][j].state = 0;
      boxes[i][j].neighbors = 0;
      boxes[i][j].checked = 0;
    }
  }
  drawGrid();
  gen = 0;
  genCounterElement.innerText= gen;
}

var delta = 0;
function speedUp(){
  if (delta >= 5){

  //}

  //if (delay >= 5 ){
    if (pause == 0){
      playPause();
      delay = delay - delta;
      playPause();
    }
    else{
      delay = delay - delta;
    }

    delta = delta - 5;
  }
  var speed = Math.ceil(((1500 - delay)/1500)*100);
  console.log('speedUp => ' + "delay : " + delay);
  console.log("speed : " + speed + "%");
  console.log("delta : " + delta + "ms");
  var text = speed + "%";
  speedIndicator.innerText= text;
}

function speedDown(){


  if (delay < 1500 ){
    delta = delta + 5;
    if (pause == 0){
      playPause();
      delay = delay + delta;
      playPause();
    }
    else{
      delay = delay + delta;
    }
  }
   var speed = Math.ceil(((1500 - delay)/1500)*100);
   console.log('speedDown => ' + "delay : " + delay);
   console.log("speed : " + speed + "%");
   console.log("delta : " + delta + "ms");
   if (speed == 0){
     var text = speed + 1 + "%";
   }
   else{
     var text = speed + "%";
   }

   speedIndicator.innerText= text;
}


function boxSizeUp(){
  if (boxSizeId < sizeList.length-1){

    liveBoxes.length = 0;
    liveBoxId = 0;
    checkList.length = 0;
    checkListId = 0;

    boxSizeId = boxSizeId + 1;
    boxWidth = sizeList[boxSizeId].boxSize;
    canvas.width = sizeList[boxSizeId].canvas_width;
    canvas.height = sizeList[boxSizeId].canvas_height;
    var canvas_H_offset = sizeList[boxSizeId].canvas_H_offset + "px";
    var canvas_V_offset = sizeList[boxSizeId].canvas_V_offset + "px";
    canvas.style.marginLeft = canvas_H_offset
    canvas.style.marginTop = canvas_V_offset;

    var newCols = canvas.width/boxWidth;
    var newRows = canvas.height/boxWidth;
    var colsDiff = (cols - newCols);
    var rowsDiff = (rows - newRows);
    var H_offset = Math.floor(colsDiff/2);
    var V_offset = Math.floor(rowsDiff/2);



    var newSet = make2DArray(newCols,newRows);     // in OTHER FUNCTIONS section
    var newSetId = 0;
    for (let i=0 ; i<newCols; i++){
      for (let j=0; j<newRows; j++){
        newSet[i][j] = boxes[i+H_offset][j+V_offset];
        newSet[i][j].boxId = newSetId;
        newSet[i][j].x = i;
        newSet[i][j].y = j;
        if (newSet[i][j].state == 1){
          liveBoxes[liveBoxId] = newSet[i][j];
          liveBoxId += 1;
        }
        newSetId += 1;
      }
    }


    cols = newCols;
    rows = newRows;
    boxes = make2DArray(cols,rows);   // in OTHER FUNCTIONS section
    boxes = newSet;
    drawGrid();
    draw();
    gridSizeIndicator.innerText= cols + "*" + rows;
    //console.log(newSet);
    //console.log(boxes);
  }
}

function boxSizeDown(){
  if (boxSizeId >= 1){

    //pauseGame();

    liveBoxes.length = 0;
    liveBoxId = 0;
    checkList.length = 0;
    checkListId = 0;

    var tempSet = make2DArray(cols,rows);    // in OTHER FUNCTIONS section
    tempSetId = 0;
    var tempSet = boxes;

    boxSizeId = boxSizeId - 1;
    boxWidth = sizeList[boxSizeId].boxSize;
    canvas.width = sizeList[boxSizeId].canvas_width;
    canvas.height = sizeList[boxSizeId].canvas_height;

    var canvas_H_offset = sizeList[boxSizeId].canvas_H_offset + "px";
    var canvas_V_offset = sizeList[boxSizeId].canvas_V_offset + "px";
    canvas.style.marginLeft = canvas_H_offset
    canvas.style.marginTop = canvas_V_offset;

    var newCols = canvas.width/boxWidth; //12 => 16
    var newRows = canvas.height/boxWidth;// start 2 end 13 ystart 1 end 6
    var colsDiff = (newCols - cols); //4
    var rowsDiff = (newRows - rows);
    var H_offset = Math.floor(colsDiff/2);  //2
    var V_offset = Math.floor(rowsDiff/2);
    var oldCols = cols;
    var oldRows = rows;

    cols = newCols;
    rows = newRows;
    createGridArray();
    //console.log(tempSet);
    //console.log(boxes);

    for (let i=0 ; i<oldCols; i++){
      for (let j=0; j<oldRows; j++){
        boxes[i+H_offset][j+V_offset].state = tempSet[i][j].state;
        if (boxes[i+H_offset][j+V_offset].state == 1){
          liveBoxes[liveBoxId] = boxes[i+H_offset][j+V_offset];
          liveBoxId += 1;
        }
        tempSetId += 1;
      }

    gridSizeIndicator.innerText= cols + "*" + rows;
    }





    drawGrid();
    draw();
  }
}



var patternId = 0;
var patternName = "";
var savedPatterns = new Array();
function savePattern(){
  // if (patternObjects[patternNumber] != null){
  //   patternObjects[patternNumber].displayed = 0;
  // }
  if (boxWidth > 3){
    if (patternObjects[patternNumber] == null ||  patternObjects[patternNumber].displayed == 0){

      patternZone();  // in OTHER FUNCTIONS section
      var saved = make2DArray(H_spread,V_spread);  // in OTHER FUNCTIONS section

      // save and avoid empty pattern
      console.log('save');
      var allowedPatternSize = 0;
      for (let i=0 ; i<H_spread; i++){
        for (let j=0; j<V_spread; j++){
          saved[i][j] = boxes[i+H_start][j+V_start].state;
          allowedPatternSize += saved[i][j];
        }
      }

      if (allowedPatternSize > 0 && allowedPatternSize < 1000){
        //console.log(saved);
        console.log("Number of cells : " + allowedPatternSize);
        savedPatterns[patternId] = saved;
        patternName = "Pattern_" + (patternId+1);

        createPatternObject(saved);  // in OTHER FUNCTIONS section

        patternNumber = patternId;
        patternId = patternId + 1;
        storePattern();
      }
      else{
        console.log("empty pattern");
      }
    }
  }
}

function storePattern(){
  console.log("stored");
  //localStorage.clear();
  //localStorage.removeItem("ID");
  let str = JSON.stringify(patternId);
  localStorage.setItem("LastID", str);


  //str = JSON.stringify(patternObjects[patternId]);
  str = JSON.stringify(patternObjects);
  //console.log(str);
  //var Name = "Pattern_" + (patternId+1);
  var Name = "PatternObjects";
  localStorage.setItem(Name, str);

}

function loadPatterns(){
  if (localStorage.getItem("LastID") === null || localStorage.getItem("LastID") <=0 ){
    localStorage.setItem("LastID", 0);
  }
  else if (localStorage.getItem("PatternObjects")  != null){
    let original = localStorage.getItem("LastID");
    patternId = JSON.parse(original);
    console.log(original);

    /*for(var i=0; i<=patternId; i++){
      var Name = 'Pattern_' + (i+1);
      original = localStorage.getItem(Name);
      patternObjects[i] = JSON.parse(original);
      console.log(original);
    }*/

    original = localStorage.getItem("PatternObjects");
    patternObjects = JSON.parse(original);

    patternObjects[patternId-1].displayed = 0;
    //patternId = patternId +1;
  }
}

function deletePattern(){
  if (patternObjects[patternNumber].displayed == 1 ){
    patternObjects.splice(patternNumber, 1);
    patternId -= 1;


    if (patternId <0){
      patternId = 0;
    }

    patternNumber -= 1;
    if (patternNumber <0){
      patternNumber = 0;
    }
    clearGame();
    storePattern();
    loadPatterns();
 }
}



var patternNumber = 0;
function skipPrevious(){
  if (patternNumber > 0){
    patternObjects[patternNumber].displayed = 0;
    patternNumber = patternNumber - 1;
  }
  showSavedPattern();  // in OTHER FUNCTIONS section
  patternObjects[patternNumber].displayed = 1;
}

function skipNext(){
  if (patternNumber < patternId-1){
    patternObjects[patternNumber].displayed = 0;
    patternNumber = patternNumber + 1;
  }
  showSavedPattern();   // in OTHER FUNCTIONS section
  patternObjects[patternNumber].displayed = 1;
}




/*----------------------------------------------------------------------------------------------------
  -------------------------------------OTHER FUNCTIONS----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/



function make2DArray(cols, rows){
      let arr = new Array(cols);
      for (let i=0; i<arr.length; i++){
        arr[i] = new Array(rows);
      }
      return arr;
    }

function getMousePos(canvas, e) {
      var rect = canvas.getBoundingClientRect();
      return {x: e.clientX - rect.left, y: e.clientY - rect.top};
  }

var H_start = 0;
var H_end = 0;
var V_start = 0;
var V_end = 0;
var H_spread = 0;
var V_spread = 0;
function patternZone(){
  var started = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      if (boxes[i][j].state==1 && started == 0){
        H_start = i;
        H_end = i;
        V_start = j;
        V_end = j;

        started = 1;
      }
      else if(boxes[i][j].state==1){
        if (j < V_start){
          V_start = j;
        }
        if (i > H_end){
          H_end = i;
        }
        if (j > V_end){
          V_end = j;
        }
      }
    }
  }
  H_spread = H_end - H_start + 1;
  V_spread = V_end - V_start + 1;
  // console.log("H start : " + H_start);
  // console.log("H end : " + H_end);
  // console.log("H spread : " + H_spread);
  // console.log("V start : " + V_start);
  // console.log("V end : " + V_end);
  // console.log("V spread : " + V_spread);
  console.log("PatternId : " + patternId);
}

var startPatternObject;
function cachePattern(){
  //gridState.length = 0;
  startPattern = make2DArray(H_spread, V_spread);
  for (var i = 0; i<H_spread; i++){
    for (var j = 0; j<V_spread; j++){
      startPattern[i][j] = boxes[i+H_start][j+V_start].state;
    }
  }

  var id = startPattern;
  var name = startPattern;
  var H_gridSize = cols;
  var V_gridSize = rows;
  startPatternObject = new pattern(id, name, startPattern, H_start, H_end, H_spread, H_gridSize, V_start, V_end, V_spread, V_gridSize);
}

var patternObjects = [];
function createPatternObject(saved){
  var id = patternId;
  var name = patternName;
  var H_gridSize = cols;
  var V_gridSize = rows;
  var displayed = 1;
  //var pattern = savedPatterns[patternId];
  patternObjects[id] = new pattern(id, name, saved, H_start, H_end, H_spread, H_gridSize, V_start, V_end, V_spread, V_gridSize, displayed);
}

function showSavedPattern(){
  H_spread = patternObjects[patternNumber].H_spread;
  V_spread = patternObjects[patternNumber].V_spread;
  savedPattern = patternObjects[patternNumber].pattern;

  checkList.length = 0;
  checkListId = 0;
  liveBoxes.length = 0;
  liveBoxId = 0;
  gen = 0;
  genCounterElement.innerText= gen;

  while (H_spread > cols ||  V_spread > rows){
    boxSizeDown();
    liveBoxes.length=0;
    liveBoxId = 0;
  }

  var colsDiff = (cols - H_spread);
  var rowsDiff = (rows - V_spread);
  var H_offset = Math.floor(colsDiff/2);
  var V_offset = Math.floor(rowsDiff/2);

  for (var i = 0; i<cols; i++){
    for (var j = 0; j<rows; j++){
      boxes[i][j].state = 0;
      boxes[i][j].neighbors = 0;
      boxes[i][j].checked = 0;
      boxes[i][j].age = 0;

      if (i >= H_offset && i < H_offset+H_spread && j >= V_offset && j < V_offset+V_spread){
        boxes[i][j].state = savedPattern[i-H_offset][j-V_offset];

        if (savedPattern[i-H_offset][j-V_offset] == 1){
          liveBoxes[liveBoxId] = boxes[i][j];
          liveBoxId += 1;
        }
      }
    }
  }
  draw();
}


//window.onload = setup;
