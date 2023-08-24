const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

const pen = document.getElementById("pen");
const eraser = document.getElementById("eraser");
const clear = document.getElementById("clear");
const piece = document.getElementById("piece");
const line = document.getElementById("line");

// Mouse position
pos = { x: 0, y: 0 };

currentLinePos = { x: 0, y: 0 };
isFirstLine = true;

var isCubes = true;

// Current mode
const Mode = {
  DRAW: "draw",
  ERASE: "erase",
  PIECE: "piece",
  LINE: "line",
  NONE: "none",
};

var currentMode = Mode.NONE;

var currentSelected = pen;

// resize canvas to current drawing area
resize();

// Button listeners
pen.addEventListener("click", (event) => {
  selectTool(pen);
  currentMode = Mode.DRAW;
});

eraser.addEventListener("click", (event) => {
  selectTool(eraser);
  currentMode = Mode.ERASE;
});

clear.addEventListener("click", (event) => {
  clearField();

  // Reset line status on clear
  isFirstLine = true;
});

piece.addEventListener("click", (event) => {
  selectTool(piece);
  // Change to other piece only if is selected
  if(currentMode == Mode.PIECE) {
    isCubes = !isCubes;
    piece.innerText = isCubes ? "Cube" : "Cone";
  }
  currentMode = Mode.PIECE;
});

line.addEventListener("click", (event) => {
  selectTool(line);
  isFirstLine = true;
  currentMode = Mode.LINE;
});

// Canvas listeners

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", handleClick);
canvas.addEventListener("mousedown", handleClick);

window.addEventListener("resize", resize);

/**Select tool */
function selectTool(id) {
  currentSelected.classList.remove("selected-tool");
  currentSelected.classList.add("nonactive");
  currentSelected = id;
  id.classList.add("selected-tool");
  id.classList.remove("nonactive");
}

/**On resize window, update canvas width and height */
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

/**Draw on canvas */
function draw(e) {
  if (e.buttons !== 1) {
    return;
  }

  if (currentMode == Mode.DRAW) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
  } else if (currentMode == Mode.ERASE) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 50;
  } else {
    return;
  }

  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(pos.x, pos.y);
  handleClick(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

/**Draw lines */
function handleLine(e) {
  if (e.buttons !== 1) {
    return;
  }

  if (isFirstLine) {
    currentLinePos.x = getPos(e).x;
    currentLinePos.y = getPos(e).y;
    isFirstLine = false;
    return;
  }

  if (currentLinePos.x != getPos(e).x && currentLinePos.y != getPos(e).y) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 5;
    ctx.moveTo(currentLinePos.x, currentLinePos.y);
    currentLinePos.x = e.pageX - canvas.offsetLeft;
    currentLinePos.y = e.pageY - canvas.offsetTop;
    ctx.lineTo(currentLinePos.x, currentLinePos.y);
    ctx.stroke();
  }
}

function handlePiece(e) {
  if(e.buttons !== 1) {
    return;
  }

  ctx.globalCompositeOperation = "source-over";
  let path = new Path2D();
  if(isCubes) {
    path.roundRect(getPos(e).x - 15, getPos(e).y - 15, 30, 30, 10);
    ctx.fillStyle = "#8d24d4";
  } else {
    ctx.fillStyle = "#ffea03";
    path.roundRect(getPos(e).x - 15, getPos(e).y - 15, 30, 30, 3);
  }
  
  ctx.fill(path);

  if(!isCubes) {
    ctx.fillStyle = "#000000";
    path = new Path2D();
    path.ellipse(getPos(e).x, getPos(e).y, 5, 5, 0, 0 , 2 * Math.PI);
    ctx.fill(path);
  }
}
/**Handles a click event*/
function handleClick(e) {
  // On mouse down event and line
  if (currentMode == Mode.LINE) {
    handleLine(e);
    return;
  } else if (currentMode == Mode.PIECE) {
    handlePiece(e);
    return;
  }

  // account for offset
  pos.x = getPos(e).x;
  pos.y = getPos(e).y;
}

/**Get mouse position on screen */
function getPos(e) {
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    x = e.clientX;
    y = e.clientY;
}
  return { x, y };
}

/**Clear all drawings on field */
function clearField() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}
