const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

const pen = document.getElementById("pen");
const eraser = document.getElementById("eraser");
const clear = document.getElementById("clear");
const piece = document.getElementById("piece");
const arrow = document.getElementById("arrow");

const sidebar = document.getElementById("sidebar");
const sidebarIcon = document.getElementById("sidebar-icon");

var sidebarIsOpen = false;
var sidebarJustClosed = true;

// Mouse position
var pos = { x: 0, y: 0 };

var currentLinePos = { x: 0, y: 0 };

var isLineStart = true;
var isFirstClick = true;

var isCubes = true;

// Current mode
const Mode = {
  DRAW: "draw",
  ERASE: "erase",
  PIECE: "piece",
  ARROW: "arrow",
  NONE: "none",
};

var selectedColor = "white";
var selectedColorElement = document.getElementById("color-white");

var currentMode = Mode.NONE;

// Set first selected tool to pen tool
var currentSelected = pen;

const GameStage = {
  AUTO: "auto",
  TELEOP: "teleop",
  ENDGAME: "endgame",
};

var currentGameStage = GameStage.AUTO;

var autoImage = new Image();
var teleopImage = new Image();
var endgameImage = new Image();

// ---------- Event Listeners --------- \\
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
  canvas.style.backgroundImage = "field23.png";

  // Reset line status on clear
  isLineStart = true;
  isFirstClick = true;
});

piece.addEventListener("click", (event) => {
  selectTool(piece);
  // Change to other piece only if is selected
  if (currentMode == Mode.PIECE) {
    isCubes = !isCubes;
    piece.style.backgroundImage = isCubes ? "url(icons/crop_square_FILL0_wght400_GRAD0_opsz24.svg)" : "url(icons/traffic-cone.svg)";
  }
  currentMode = Mode.PIECE;
});

arrow.addEventListener("click", (event) => {
  selectTool(arrow);
  isLineStart = true;
  isFirstClick = true;
  currentMode = Mode.ARROW;
});

// --------- Game Mode Selectors --------- \\
document.getElementById("auto").addEventListener("click", (event) => {
  saveCurrentStage();
  currentGameStage = GameStage.AUTO;
  ctx.drawImage(autoImage, 0, 0);
});

document.getElementById("teleop").addEventListener("click", (event) => {
  saveCurrentStage();
  currentGameStage = GameStage.TELEOP;
  ctx.drawImage(teleopImage, 0, 0);
});

document.getElementById("endgame").addEventListener("click", (event) => {
  saveCurrentStage();
  currentGameStage = GameStage.ENDGAME;
  ctx.drawImage(endgameImage, 0, 0);
});

document.getElementById("reset").addEventListener("click", (event) => {
    if(confirm("Reset Game-Planner? This will clear all drawings, field elements, robots, and match data")) {
      clearField();
      currentGameStage = GameStage.AUTO;
      autoImage = new Image();
      teleopImage = new Image();
      endgameImage = new Image();
    }
});

// Canvas listeners

canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", handleClick);
canvas.addEventListener("pointerdown", handleClick);

window.addEventListener("resize", resize);
window.addEventListener("load", resize);

document
  .getElementById("sidebar-icon")
  .addEventListener("pointerdown", handleSideBar);

function handleSideBar() {
  if (sidebarIsOpen) {
    sidebar.classList.remove("sidebar-visible");
    sidebar.classList.add("sidebar-hidden");
    sidebarIcon.classList.remove("icon-hidden");
    sidebarIcon.classList.add("icon-visible");
  } else {
    sidebar.classList.remove("sidebar-hidden");
    sidebar.classList.add("sidebar-visible");
    sidebarIcon.classList.remove("icon-visible");
    sidebarIcon.classList.add("icon-hidden");
  }

  sidebarIsOpen = !sidebarIsOpen;
  // If sidebar opens, reset arrow/line status
  isLineStart = true;

  isFirstClick = true;
}

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
  var image = document.getElementById("field-image");
  // Set width based on image original height and width, so that it should fit better on smaller screens
  ctx.canvas.height =
    (image.naturalHeight / image.naturalWidth) * window.innerWidth;
}

/**Draw on canvas */
function draw(e) {
  if (isFirstClick) {
    handleClick(e);
    isFirstClick = false;
  }
  // If finger/mouse isn't currently being pressed, return
  if (e.buttons !== 1) {
    return;
  }

  if (currentMode == Mode.DRAW) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 5;
  } else if (currentMode == Mode.ERASE) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 50;
  } else {
    return;
  }

  // Draw line / erase
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(pos.x, pos.y);
  handleClick(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

/**Draw lines */
function handleLine(e) {
  // If startpoint for line, just save the position for later
  if (isLineStart) {
    currentLinePos.x = getPos(e).x;
    currentLinePos.y = getPos(e).y;
    isLineStart = false;
    return;
  }
  // If new endpoint for line, draw the arrow
  if (currentLinePos.x != getPos(e).x && currentLinePos.y != getPos(e).y) {
    ctx.lineCap = "round";
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 5;

    endX = getPos(e).x;
    endY = getPos(e).y;
    angle = Math.atan2(endY - currentLinePos.y, endX - currentLinePos.x);
    head_angle = Math.PI / 6;

    // Adjust for line thickness
    endY -= ctx.lineWidth * Math.sin(angle);
    endX -= ctx.lineWidth * Math.cos(angle);

    ctx.beginPath();
    ctx.moveTo(currentLinePos.x, currentLinePos.y);
    // Tip of arrow at touch/cursor point
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(endX, endY);
    // head liength of 10px and angle between of 30 deg
    ctx.lineTo(
      endX - 10 * Math.cos(angle - Math.PI / 6),
      endY - 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - 10 * Math.cos(angle + Math.PI / 6),
      endY - 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    currentLinePos.x = getPos(e).x;
    currentLinePos.y = getPos(e).y;
  }
}

function handlePiece(e) {
  // If mouse button/finger isn't currently active, return
  if (e.buttons !== 1 || isFirstClick) {
    isFirstClick = false;
    return;
  }

  ctx.globalCompositeOperation = "source-over";
  let path = new Path2D();
  if (isCubes) {
    // Rounded purple rectangle for cubes
    ctx.fillStyle = "#8d24d4";
    path.roundRect(getPos(e).x - 15, getPos(e).y - 15, 30, 30, 10);
  } else {
    // Rounded yellow rectangle for cones
    ctx.fillStyle = "#ffea03";
    path.roundRect(getPos(e).x - 15, getPos(e).y - 15, 30, 30, 3);
  }

  ctx.fill(path);

  // Fill in clear circle for middle of cones
  if (!isCubes) {
    ctx.fillStyle = "#000000";
    ctx.globalCompositeOperation = "destination-out";
    path = new Path2D();
    path.ellipse(getPos(e).x, getPos(e).y, 5, 5, 0, 0, 2 * Math.PI);
    ctx.fill(path);
  }
}
/**Handles a click event*/
function handleClick(e) {
  console.log(e.type);
  // On mouse down event and line
  if (!sidebarIsOpen) {
    if (currentMode == Mode.PIECE) {
      handlePiece(e);
      return;
    }

    if (currentMode == Mode.ARROW) {
      if (isLineStart && e.type == "pointerdown") {
        handleLine(e);
      } else if (!isLineStart && e.type == "pointerup") {
        handleLine(e);
        isLineStart = true;
      }
    }

    if (e.type == "pointerdown" || e.type == "pointermove") {
      // account for offset
      pos.x = getPos(e).x;
      pos.y = getPos(e).y;
    }
  } else {
    // Only fire sidebar on pointerdown event
    if (e.type == "pointerdown") {
      handleSideBar();
    }
  }
}

/**Get mouse/finger position on screen */
function getPos(e) {
  let touch =
    (e.touches && e.touches[0]) ||
    (e.pointerType && e.pointerType === "touch" && e);
  let x = (touch || e).clientX - canvas.offsetLeft;
  let y = (touch || e).clientY - canvas.offsetTop;
  return { x, y };
}

/**Clear all drawings on field */
function clearField() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function selectColor(event) {
  selectedColorElement.classList.remove("selected-color");
  selectedColorElement = document.getElementById(event.currentTarget.id);
  selectedColorElement.classList.add("selected-color");
  selectedColor = event.currentTarget.style.backgroundColor;
  event.currentTarget.classList.add("selected-circle");
}

/* Saves current field state to current state */
function saveCurrentStage() {
  switch (currentGameStage) {
    case "auto":
      autoImage.src = canvas.toDataURL();
      break;
    case "teleop":
      teleopImage.src = canvas.toDataURL();
      break;
    case "endgame":
      endgameImage.src = canvas.toDataURL();
      break;
  }

  clearField();
}
