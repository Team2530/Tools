// Red/Blue alliance colors
COLORS = ["#ED1C24", "#0066B3"];

// Button keymap
KEYMAP = [
  ["s", 0, 1],
  ["s", 0, -1],
  ["s", 1, 1],
  ["s", 1, -1],
  ["p", 0, 1],
  ["p", 0, -1],
  ["p", 1, 1],
  ["p", 1, -1],
];
// Scores array
scores = [0, 0];
// Penalties array
penalties = [0, 0];

// Total match time
matchTime = 150;
// is currently running match
isStarted = false;

isRunning = false;

// Last timer update time
startTime = 0;

// Time remaining in match
timeRemaining = matchTime;

// For flashing timer
flashCount = 0;

// Sounds Have been played
teleopHasNotPlayed = true;
endgameHasNotPlayed = true;
finalHasNotBeenPlayed = true;

// Game is finished
isFinished = false;

function updateScores() {
  document.getElementById("rs").innerText = `${scores[0]}`;
  document.getElementById("rp").innerText = `-${penalties[0]}`;
  document.getElementById("bs").innerText = `${scores[1]}`;
  document.getElementById("bp").innerText = `-${penalties[1]}`;
}

document.addEventListener(
  "keydown",
  (event) => {
    let key = event.key;
    let code = event.code;

    if (code == "Space") {
      start();
      event.preventDefault();
    } else if (code == "Enter") {
      stop();
      event.preventDefault();
    } else if (key == "r" && isFinished) {
      reveal();
    } else if ("12345678".includes(key) && isStarted) {
      let action = KEYMAP[parseInt(key) - 1];
      console.log(`${key}: ${action}`);
      if (action[0] == "s") {
        scores[action[1]] = Math.max(0, scores[action[1]] + action[2]);
      } else {
        penalties[action[1]] = Math.max(0, penalties[action[1]] + action[2]);
      }
      updateScores();
    }
  },
  false
);

document.getElementById("time").innerText = convert(timeRemaining) + ".00";
document.getElementById("time").style.color = "#56ea16";

function start() {
  updateScores();
  if (timeRemaining == matchTime) {
    new Audio("start.mp3").play();
  }
  startTime = Date.now();
  isRunning = true;
  isStarted = true;
  if(endgameHasNotPlayed) {
    document.getElementById("time").style.color = "white";
  }
  
}

function reveal() {
  // if (timeRemaining > 0) return;
  document.getElementById("winner").setAttribute("style", "display: block");

  let finalscores = [scores[0] - penalties[0], scores[1] - penalties[1]];

  let winner = finalscores[0] > finalscores[1] ? 0 : 1;
  let winningteam_el = document.getElementById("winningteam");

  winningteam_el.style.color = COLORS[winner];
  winningteam_el.innerText = ["RED TEAM", "BLUE TEAM"][winner] + "!";

  if (finalscores[1] == finalscores[0]) {
    // Handle tie WIP
    winningteam_el.style.color = "#FFCC00";
    winningteam_el.innerText = "TIED!";
  } else {
    document
      .getElementById(winner == 1 ? "fr" : "fb")
      .parentElement.classList.remove("winningteam");
    document
      .getElementById(winner == 0 ? "fr" : "fb")
      .parentElement.classList.add("winningteam");
  }
  document.getElementById("fr").innerText = `${finalscores[0]}`;
  document.getElementById("frp").innerText = `Penalty: ${penalties[0]}`;
  document.getElementById("fb").innerText = `${finalscores[1]}`;
  document.getElementById("fbp").innerText = `Penalty: ${penalties[1]}`;

  setTimeout(
    () => document.getElementById("revealcover").classList.add("hideoverlay"),
    2000
  );
  // WIP
}

function stop() {
  isRunning = false;
}

function reset() {
  if (!confirm("Are you sure you want to reset? Scores will be reset.")) {
    return;
  }
  document.getElementById("revealcover").classList.remove("hideoverlay");
  document.getElementById("winner").setAttribute("style", "display: none");
  scores = [0, 0];
  penalties = [0, 0];
  updateScores();
  stop();
  timeRemaining = matchTime;
  document.getElementById("time").innerText = convert(timeRemaining) + ".00";
  document.getElementById("time").style.color = "#56ea16";
  teleopHasNotPlayed = true;
  endgameHasNotPlayed = true;
  finalHasNotBeenPlayed = true;
  isFinished = false;
  isStarted = false;
}

function updateTime() {
  timeRemaining -= (Date.now() - startTime) / 1000;
  startTime = Date.now();
}

function convert(seconds) {
  extraZero = "";
  fraction = Math.floor(seconds / 60);
  if (seconds - 60 * fraction < 10) {
    extraZero = "0";
  }
  return (
    "" +
    fraction +
    ":" +
    extraZero +
    (seconds - 60 * fraction)
  ).substring(0, 7);
}

function flash() {
  flashCount++;
  if (flashCount >= 75) {
    currentColor = document.getElementById("time").style.color;
    if (currentColor == "white") {
      document.getElementById("time").style.color = "red";
    } else {
      document.getElementById("time").style.color = "white";
    }

    flashCount = 0;
  }
}

/*Main Funciton (does all updates)*/
function main() {
  if (isRunning) {
    updateTime();
    document.getElementById("time").innerText = convert(timeRemaining);
  }

  if (timeRemaining < 120 && teleopHasNotPlayed) {
    new Audio("teleop.mp3").play();
    teleopHasNotPlayed = false;
  }

  if (timeRemaining < 30 && endgameHasNotPlayed) {
    new Audio("whistle.mp3").play();
    document.getElementById("time").style.color = "yellow";
    endgameHasNotPlayed = false;
  }

  if (isRunning && timeRemaining <= 0 && finalHasNotBeenPlayed) {
    new Audio("endbuzzer.mp3").play();
    document.getElementById("time").style.color = "red";
    finalHasNotBeenPlayed = false;
    isFinished = true;
  }

  if (timeRemaining <= 0) {
    document.getElementById("time").innerText = "0:00.00";
    stop();
    flash();
  }
}


setInterval(main, 10);
