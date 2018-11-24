/*--------PANEL DISPLAY FUNCTIONS-------------------------*/

let panel = document.getElementById('panel');
let panelItem = document.querySelector('.panelItem');
let gameStatsContainer = document.querySelector('.gameStatsContainer');

let plusMinusButtons = document.getElementById("plusMinusButtons");
let plus = document.getElementById("plus");
let minus = document.getElementById('minus');
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

function hideButtons() {
  if (speedDisplayed == 1 || gridSizeDisplayed == 1) {
    plusMinusButtons.style.display = "none";
    speedDisplayed = 0;
    gridSizeDisplayed = 0;
  }

  if (saveDisplayed == 1) {
    saveButtons.style.display = "none";
    saveDisplayed = 0;
  }
}

function hideSpeedButtons() {

  if (speedDisplayed == 1 || gridSizeDisplayed == 1) {
    plusMinusButtons.style.display = "none";
    displayed = 0;
  }
}

function hideGridButtons() {
  if (saveDisplayed == 1) {
    saveButtons.style.display = "none";
    displayed = 0;
  }
}

function displaySpeedButtons() {
  sizeUpButton.removeEventListener('click', boxSizeDown);
  sizeDownButton.removeEventListener('click', boxSizeUp);
  speedUpButton.addEventListener('click', speedUp);
  speedDownButton.addEventListener('click', speedDown);
  plusMinusButtons.style.display = "none";



  if (speedDisplayed == 0) {
    plusMinusButtons.style.display = "grid";



    if (pageWidth < 480) {
      var margin = Math.floor(pageWidth / 7) + "px";
      var padding = Math.floor(((pageWidth / 7) - 20) / 2) + "px";
    } else {
      var margin = Math.floor(pageWidth / 12) + "px";
      var padding = Math.floor(((pageWidth / 12) - 20) / 2) + "px";
    }
    plus.style.paddingLeft = padding;
    plus.style.paddingRight = padding;
    minus.style.paddingLeft = padding;
    minus.style.paddingRight = padding;
    plusMinusButtons.style.left = margin;
    //plusMinusButtons.style.right = "";  //extend from here on wider screens
    speedDisplayed = 1;
    saveButtons.style.display = "none";
    saveDisplayed = 0;
    gridSizeDisplayed = 0;
  } else {
    plusMinusButtons.style.display = "none";
    speedDisplayed = 0;
  }
}

function displayGridButtons() {
  speedUpButton.removeEventListener('click', speedUp);
  speedDownButton.removeEventListener('click', speedDown);
  sizeUpButton.addEventListener('click', boxSizeDown);
  sizeDownButton.addEventListener('click', boxSizeUp);
  plusMinusButtons.style.display = "none";


  if (gridSizeDisplayed == 0) {
    plusMinusButtons.style.display = "grid";
    var margin = 0 + "px";
    if (pageWidth < 480) {
      var padding = Math.floor(((pageWidth / 7) - 20) / 2) + "px";
    } else {
      var padding = Math.floor(((pageWidth / 12) - 20) / 2) + "px";
    }
    plus.style.paddingLeft = padding;
    plus.style.paddingRight = padding;
    minus.style.paddingLeft = padding;
    minus.style.paddingRight = padding;
    plusMinusButtons.style.left = margin;
    gridSizeDisplayed = 1;
    saveButtons.style.display = "none";
    saveDisplayed = 0;
    speedDisplayed = 0;
  } else {
    plusMinusButtons.style.display = "none";
    gridSizeDisplayed = 0;
  }
}

function displaySaveButtons() {
  if (saveDisplayed == 0) {
    saveButtons.style.display = "grid";
    saveDisplayed = 1;
    plusMinusButtons.style.display = "none";
    speedDisplayed = 0;
    gridSizeDisplayed = 0;
    //noRespawn = 0;
  } else {
    saveButtons.style.display = "none";
    saveDisplayed = 0;
  }

}

function getOpenSavedButtonPosition() {
  if (window.innerWidth < 480) {
    /*var rect = openSavedButton.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    var button_center = Math.floor(rect.left + ((rect.right-rect.left)/2));
    console.log(button_center);
    saveButonPosition = button_center - 78;
    saveButtons.style.left = saveButonPosition + "px";*/
  } else {
    saveButtons.style.display = "none";
    saveDisplayed = 0;
  }
}