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
  currentMode = Mode.PIECE;
});

line.addEventListener("click", (event) => {
  selectTool(line);
  isFirstLine = true;
  currentMode = Mode.LINE;
});

// Canvas listeners

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", setPosition);
canvas.addEventListener("mousedown", setPosition);

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
      setPosition(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
}

/**Draw lines */
function handleLine(e) {
  if (e.buttons !== 1) {
    return;
  }

  if(isFirstLine) {
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
/**Set mouse position, different if in line mode */
function setPosition(e) {
    // On mouse down event and line
    if (currentMode == Mode.LINE) {
        handleLine(e);
        return;
    }

  // account for offset
  pos.x = e.pageX - canvas.offsetLeft;
  pos.y = e.pageY - canvas.offsetTop;
}

/**Get mouse position on screen */
function getPos(e) {
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
  return {x, y};
}

/**Clear all drawings on field */
function clearField() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}
