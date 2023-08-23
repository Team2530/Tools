const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

const pen = document.getElementById("pen");
const eraser = document.getElementById("eraser");
const clear = document.getElementById("clear");
const piece = document.getElementById("piece");

// Mouse position
pos = {x: 0, y: 0}

// Current mode
const Mode = {
    DRAW: "draw",
    ERASE: "erase",
    PIECE: "piece",
    NONE: "none"
}

var currentMode = Mode.NONE;

var currentSelected = pen;

// resize canvas to current drawing area
resize();

// Button listeners
document.getElementById("pen").addEventListener("click", event => {
    selectTool("pen");
    currentMode = Mode.DRAW;
});

document.getElementById("eraser").addEventListener("click", event => {
    selectTool("eraser");
    currentMode = Mode.ERASE;
});

document.getElementById("clear").addEventListener("click", event => {
    clearField();
});

document.getElementById("piece").addEventListener("click", event => {
    selectTool("piece");
    currentMode = Mode.PIECE;
});

// Canvas listeners

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", setPosition);

function selectTool(id) {
    currentSelected.classList.remove("selected-tool");
    currentSelected.classList.add("nonactive");
    currentSelected = document.getElementById(id);
    document.getElementById(id).classList.add("selected-tool");
    document.getElementById(id).classList.remove("nonactive");
    currentSelected = document.getElementById(id);
}

function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}
  
function draw(e) {
    if(e.buttons !== 1) {
        return;
    }

    if(currentMode == Mode.PIECE || currentMode == Mode.NONE) {
        return;
    }

    if(currentMode == Mode.DRAW) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
    } else if(currentMode == Mode.ERASE) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 50;
    }
    

    ctx.beginPath();
    ctx.lineCap = 'round';

    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
}

function clearField() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}