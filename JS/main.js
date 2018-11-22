// Save can only be donne on min boxWidth=4
// and if the pattern has max 1000 alive cells
// mod...



let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

let wrapper = document.getElementById("wrapper");
let startScreen = document.getElementById("startScreen");

function displayGame() {
  startScreen.style.display = "none";
  wrapper.style.display = "grid";
  //openFullscreen();
  setup();
  resize();
  random();
}


/*----------------------------------------------------------------------------------------------------
  -------------------------------------GAME SETUP----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/

let grid;
let cols;
let rows;
let boxWidth;

function setup() {
  // postData();
  // loadJSON();
  createSizeList();
  cols = canvas.width / boxWidth;
  rows = canvas.height / boxWidth;
  //drawGrid();
  getOpenSavedButtonPosition();
  createGridArray();
  loadPatterns();
  random();
  draw();
  genCounterElement.innerText = "Generation 0";
  gridSizeIndicator.innerText = cols + "*" + rows;
  for (let i = 0; i < 12; i++) {
    speedDown();
  }
}

var minSize = 1;
var maxSize = 100;
var sizeList = [];
var boxSizeId = 4;

function createSizeList() {
  sizeList.length = 0;
  //var lastSize = minSize;
  var sizeCounter = 0;
  var maxWidth = canvas.width;
  var maxHeight = canvas.height;

  for (i = minSize; i <= 100; i++) {
    var found = 0;
    var width = maxWidth;
    var height = maxHeight;


    while (found != 1 && width >= canvas.width - 10 && height >= canvas.height - 10) {
      if (width % i == 0) {
        if (height % i == 0) {
          //if (last_X_numberOfBoxes != width/i && last_Y_numberOfBoxes != height/i){
          sizeList[sizeCounter] = new Size(i, width, height);
          sizeList[sizeCounter].canvas_H_offset = Math.floor((maxWidth - width) / 2);
          sizeList[sizeCounter].canvas_V_offset = Math.floor((maxHeight - height) / 2);
          /*console.log("\nsize : " + i);
          console.log("width : " + width);
          console.log("height : " + height);*/
          sizeCounter = sizeCounter + 1;
          found = 1;
          //  var last_X_numberOfBoxes = width / i;
          //  var last_Y_numberOfBoxes = height / i;
          //}
        } else {
          height -= 1;
        }
      } else {
        width -= 1;
      }
    }
  }


  boxWidth = sizeList[boxSizeId].boxSize;
  canvas.width = sizeList[boxSizeId].canvas_width;
  canvas.height = sizeList[boxSizeId].canvas_height;
}

function drawGrid() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.lineWidth = 1;
  c.strokeStyle = "#222";

  for (var i = 1; i < cols; i++) {
    c.beginPath();
    c.moveTo(((i * boxWidth) + 0.5), 1);
    c.lineTo(((i * boxWidth) + 0.5), (canvas.height));
    c.stroke();
  }

  for (var i = 1; i < rows; i++) {
    c.beginPath();
    c.moveTo(1, ((i * boxWidth) + 0.5));
    c.lineTo(canvas.width, ((i * boxWidth) + 0.5));
    c.stroke();
  }
}

function noGrid() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
}

var boxes;
var boxId;

function createGridArray() {
  boxes = make2DArray(cols, rows);
  boxId = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      //let state = Math.floor(Math.random() * Math.floor(2));
      let state = 0;
      createBox(i, j, state);
      boxId += 1;
    }
  }
}

var liveBoxes = [];
var liveBoxId = 0;

function createBox(x, y, state, checked, neighbors, age) {

  boxes[x][y] = new box(boxId, x, y, state, checked, neighbors, age);
  boxes[x][y].checked = 0;
  boxes[x][y].neighbors = 0;
  boxes[x][y].age = 0;

  // store live boxes in a list
  if (state == 1) {
    liveBoxes[liveBoxId] = boxes[x][y];
    liveBoxId += 1;
  }
}


/*----------------------------------------------------------------------------------------------------
  -------------------------------OBJECT CONSTRUCTORS----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/

function box(boxId, x, y, state, checked, neighbors, age) {
  this.boxId = boxId;
  this.x = x;
  this.y = y;
  this.state = state;
  this.checked = checked;
  this.neighbors = neighbors;
  this.age = age;
}

function Size(boxSize, canvas_width, canvas_height, canvas_H_offset, canvas_V_offset) {
  this.boxSize = boxSize;
  this.canvas_width = canvas_width;
  this.canvas_height = canvas_height;
  this.canvas_H_offset = canvas_H_offset;
  this.canvas_V_offset = canvas_V_offset;
}

function pattern(id, name, pattern, H_start, H_end, H_spread, H_gridSize, V_start, V_end, V_spread, V_gridSize, displayed) {
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
  -------------------------------------OTHER FUNCTIONS----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/


function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

var pageWidth;
var pageHeight;

function getScreenRatio() {
  pageWidth = window.innerWidth;
  pageHeight = window.innerHeight;
  var screenRatio = pageWidth / pageHeight;
  //console.log(screenRatio);
  return screenRatio;
}

function resize() {
  //playPause();
  /*console.log("Pattern Width : " + H_spread);
  console.log("Window innerWidth : " + canvas.width);
  console.log("Pattern Height : " + V_spread);
  console.log("Window innerHeight : " + canvas.height);*/

  if (boxes != null) {
    patternZone();
    cachePattern();
  }

  if (boxWidth != 1) {
    pageWidth = window.innerWidth;
    pageHeight = window.innerHeight;
    //pageWidth = window.screen.availWidth;
    //pageHeight = window.screen.availHeight;

    var rect = panel.getBoundingClientRect();
    var panelHeight = rect.bottom - rect.top;
    //console.log("panelHeight : " + panelHeight);

    canvas.width = pageWidth;
    canvas.height = pageHeight - (panelHeight + 4);

    createSizeList();
    cols = canvas.width / boxWidth;
    rows = canvas.height / boxWidth;
    getOpenSavedButtonPosition();
    createGridArray();
    if (startPatternObject != null) {
      replay();
    }
    gridSizeIndicator.innerText = cols + "*" + rows;
    //playPause();
  } else {
    var H_ratio = window.innerWidth / pageWidth;
    var V_ratio = window.innerHeight / pageHeight;
    if ((H_ratio >= 1 && V_ratio >= 1)) {
      pageWidth = window.innerWidth;
      pageHeight = window.innerHeight;
      //pageWidth = window.screen.availWidth;
      //pageHeight = window.screen.availHeight;

      var rect = panel.getBoundingClientRect();
      var panelHeight = rect.bottom - rect.top;
      //console.log("panelHeight : " + panelHeight);

      canvas.width = pageWidth;
      canvas.height = pageHeight - (panelHeight + 4);

      createSizeList();
      cols = canvas.width / boxWidth;
      rows = canvas.height / boxWidth;
      getOpenSavedButtonPosition();
      createGridArray();
      if (startPatternObject != null) {
        replay();
      }
      gridSizeIndicator.innerText = cols + "*" + rows;
      //playPause();
    }
  }
}