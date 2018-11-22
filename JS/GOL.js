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

function generation() {
  if (once == 0) {
    //genCounterElement = document.getElementById("generation");
    var counter = 0;
    pause = 0;
    playIconElement.innerText = "pause";
    clearInterval(setIntervalId);
    setIntervalId = setInterval(function () {
      if (pause == 1) {
        clearInterval(setIntervalId);
      } else {
        counter = counter + 1;
        createCheckList();
        computeNextGen();
        draw();
        gen = gen + 1;
        var text = "Generation " + gen;
        genCounterElement.innerText = text;
      }
    }, delay);
  }
  once = 1;
}

var checkList = [];
var checkListId = 0;

function createCheckList() {
  checkList.length = 0;
  checkListId = 0;
  for (let i = 0; i < liveBoxes.length; i++) {
    let x = liveBoxes[i].x;
    let y = liveBoxes[i].y;
    addNeighbors(x, y);
  }
  //console.log("liveBoxes : " + liveBoxes.length);
  //console.log("checkList : " +  checkList.length);
}

function addNeighbors(x, y) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;

      if (boxes[col][row].checked == 0) {
        checkList[checkListId] = boxes[col][row];
        checkList[checkListId].checked = 1;
        checkListId += 1;
      }
    }
  }
}

function computeNextGen() {
  liveBoxes.length = 0;
  liveBoxId = 0;


  //countNeighbors
  for (let i = 0; i < checkList.length; i++) {
    let x = checkList[i].x;
    let y = checkList[i].y;
    checkList[i].neighbors = 0;
    checkList[i].checked = 0;
    let neighbors = countNeighbors(x, y);
    checkList[i].neighbors = neighbors;
  }


  //apply rules
  for (let i = 0; i < checkList.length; i++) {
    if (checkList[i].state == 0 && checkList[i].neighbors == 3) {
      checkList[i].state = 1;
      //checkList[i].age += 1;
      liveBoxes[liveBoxId] = checkList[i];
      liveBoxId += 1;
    } else if (checkList[i].state == 1 && (checkList[i].neighbors == 2 || checkList[i].neighbors == 3)) {
      //checkList[i].age += 1;
      liveBoxes[liveBoxId] = checkList[i];
      liveBoxId += 1;
    } else {
      checkList[i].state = 0;
      //checkList[i].age = 0;
    }
  }
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += boxes[col][row].state;
    }
  }
  sum -= boxes[x][y].state;
  return sum;
}

function draw() {
  if (boxWidth >= 3) {
    drawGrid();
    var width = boxWidth - 1;
    var offset = 1;
  } else {
    noGrid();
    var width = boxWidth;
    var offset = 0;
  }


  c.fillStyle = "green";
  for (let i = 0; i < liveBoxes.length; i++) {
    let x = (liveBoxes[i].x * boxWidth) + offset;
    let y = (liveBoxes[i].y * boxWidth) + offset;
    c.fillRect(x, y, width, width);
  }
}