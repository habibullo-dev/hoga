let rounds = 3; // Number of rounds
let workTime = 25 * 60; // Work time in seconds
let breakTime = 5 * 60; // Break time in seconds
let currentTime = workTime; // Initialize current time to work time
let currentRound = 1; // Current round
let isWorking = true; // Flag to track if it's work time or break time
let timerInterval; // Interval ID for timer

window.clockSettingsBulk = {}; //shove all the rounds, worktime, breaktime, current round, current time and isworking here.

const progressBar = document.getElementById("progress-bar");

// Function to create a step (circle) in the progress bar
function createStep(isCompleted) {
  const step = document.createElement("div");
  step.className = "circle" + (isCompleted ? " completed" : "");
  return step;
}

// Function to render the progress bar
function renderProgressBar() {
  progressBar.innerHTML = ""; // Clear existing steps
  const totalSteps = rounds + 1; // Total segments including the end

  // Create the progress line background element
  const progressLineBg = document.createElement("div");
  progressLineBg.className = "progress-line-bg";
  progressBar.appendChild(progressLineBg);

  // Create the progress line element
  const progressLine = document.createElement("div");
  progressLine.className = "progress-line";
  progressBar.appendChild(progressLine);

  // Create circles for each segment
  for (let i = 0; i < totalSteps; i++) {
    const isCompleted = i < currentRound;
    progressBar.appendChild(createStep(isCompleted));
  }

  updateProgressBar(); // Ensure the progress bar is updated
}

function updateProgressBar() {
  const totalRoundTime = workTime; // Total time for one full round (work time only)

  // Calculate total progress within the current round
  let totalProgress = (currentRound - 1) * workTime;

  // Adjust progress based on whether it's work time or break time
  if (isWorking) {
    // During work time, deduct the current time remaining
    totalProgress += workTime - currentTime;
  }

  // Calculate the width of the progress line as a percentage of the total round time
  const progressWidth = (totalProgress / (workTime * rounds)) * 100;

  // Update the progress line width relative to the progress bar container
  const progressBarWidth = progressBar.clientWidth;
  const progressLineWidth = (progressBarWidth * progressWidth) / 100;

  const progressLine = progressBar.querySelector(".progress-line");

  // Only update the progress line width if it's during work time
  if (isWorking) {
    progressLine.style.width = `${progressLineWidth}px`;
  }

  // Update completed circles based on progress
  const circles = progressBar.querySelectorAll(".circle");
  circles.forEach((circle, index) => {
    const circleProgress = ((index + 1) / (rounds + 1)) * 100;
    if (progressWidth >= circleProgress) {
      circle.classList.add("completed");
    }
  });
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    currentTime--;

    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.getElementById("timer-display").textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    updateProgressBar();

    if (currentTime <= 0) {
      clearInterval(timerInterval);

      if (isWorking) {
        if (currentRound < rounds) {
          currentTime = breakTime;
          isWorking = false;
          currentRound++;
          document.getElementById("timer-state").textContent = "Break";
        } else {
          document.getElementById("timer-state").textContent = "Completed";
          document.getElementById("startBtn").style.display = "inline-block";
          document.getElementById("pauseBtn").style.display = "none";
          return;
        }
      } else {
        currentTime = workTime;
        isWorking = true;
        document.getElementById("timer-state").textContent = "Work";
      }

      setTimeout(startTimer, 1000);
    }
  }, 1000);

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("pauseBtn").style.display = "inline-block";
}

// Function to pause the timer
function pauseTimer() {
  clearInterval(timerInterval);

  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("pauseBtn").style.display = "none";
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  currentTime = workTime;
  isWorking = true;
  currentRound = 1;
  document.getElementById("timer-display").textContent = "25:00";
  document.getElementById("timer-state").textContent = "Work";
  renderProgressBar();

  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("pauseBtn").style.display = "none";
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  currentTime = workTime;
  isWorking = true;
  currentRound = 1;
  document.getElementById("timer-display").textContent = `${Math.floor(
    workTime / 60
  )
    .toString()
    .padStart(2, "0")}:${(workTime % 60).toString().padStart(2, "0")}`;
  document.getElementById("timer-state").textContent = "Work";
  renderProgressBar();

  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("pauseBtn").style.display = "none";
}

function updateTimerSettings(data) {
  workTime = data.focusTime * 60; // Convert minutes to seconds
  breakTime = data.breakTime * 60; // Convert minutes to seconds
  isInfinite = data.isInfinite;
  autoStart = data.autoStart;
  if (typeof data.rounds === "number" && data.rounds > 0) {
    rounds = data.rounds;
  }

  resetTimer();
  renderProgressBar();

  if (autoStart) {
    startTimer();
  }
}

// Event listeners for control buttons
document.getElementById("startBtn").addEventListener("click", startTimer);
document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
document.getElementById("stopBtn").addEventListener("click", stopTimer);
document.getElementById("resetBtn").addEventListener("click", resetTimer);

// Event listeners for settings button and iframe
const settingsBtn = document.getElementById("settingsBtn");
const iframe = document.getElementById("task-frame");

// Ensure iframe is initially hidden
if (iframe) {
  iframe.style.display = "none";
}

// Show/hide iframe on settings button click
settingsBtn.addEventListener("click", function () {
  if (iframe) {
    iframe.style.display = iframe.style.display === "block" ? "none" : "block";
  }
});

// Listen for messages from the iframe
window.addEventListener("message", function (event) {
  if (event.data && typeof event.data === "object") {
    updateTimerSettings(event.data);
  }
});

// Close iframe on receiving message "closeIframe"
window.addEventListener("message", function (event) {
  if (event.data === "closeIframe") {
    if (iframe) {
      iframe.style.display = "none";
    }
  }
});

// Initial render of the progress bar
renderProgressBar();

window.addEventListener("unload", function () {
  clockSettingsBulk.currentTime = currentTime;
  const _payload = JSON.stringify({
    clock_info: clockSettingsBulk,
    email: user.email,
  });
  navigator.sendBeacon("/user_clock_settings", _payload);
});

window.addEventListener("beforeunload", function (evt) {
  if (isWorking) {
    evt.returnValue =
      "Timer is currently running. Would you like to confirm leaving the page?";
    return "Timer is currently running. Would you like to confirm leaving the page?";
  }
});

function timerCurrentSave() {
  clockSettingsBulk.rounds = rounds;
  clockSettingsBulk.workTime = workTime;
  clockSettingsBulk.breakTime = breakTime;
  clockSettingsBulk.currentTime = currentTime;
  clockSettingsBulk.currentRound = currentRound;
  clockSettingsBulk.isWorking = isWorking;
  return clockSettingsBulk;
}

async function restoreTimeSettings() {
  const res = widgetSettingsBulk["w-timer"]["timerValues"];
  rounds = res.rounds;
  workTime = res.workTime;
  breakTime = res.breakTime;
  currentTime = res.currentTime;
  currentRound = res.currentRound; 
  isWorking = res.isWorking;
  renderProgressBar();
  startTimer(); 
}

restoreTimeSettings();
