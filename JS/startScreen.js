

function textDisplay(){
  if (window.innerWidth >= 480){
    let intro = document.querySelector('.intro');
    intro.innerHTML = "Conway's Game of Life is a two-dimensional grid with square cells" + 
    "that could be either in a state of live or dead. <br> Each cell is influenced by the state of its nearest eight neighbors," +
    "in the cardinal and diagonal direction.";
  }
}

window.onload = textDisplay();