(function() {

  const progressBar = document.getElementById("progress-bar");
  const settingsBtn = document.getElementById("settingsBtn"); // Event listeners for settings button and iframe
  const iframe = document.getElementById("task-frame");
  const watchMinutes = document.getElementById("watchMinutes");
  const watchSeconds = document.getElementById("watchSeconds")
  const timerWidgetCont = document.querySelector(".timer-container").parentElement

  timerWidgetCont.style.overflow = "visible"
  console.log("!! settingsBtn defined, ", settingsBtn)

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
    const circles = progressBar.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
      const circleProgress = ((index + 1) / (rounds + 1)) * 100;
      if (progressWidth >= circleProgress) {
        circle.classList.add('completed');
      } 
    });
  }

  function updateTimerDisplay(minutes, seconds){
    document.getElementById("timer-display").textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // Function to start the timer
  function startTimer() {
    console.log("!!TIMER CURRENTIME, WORKTIME", currentTime, workTime)

    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    updateTimerDisplay(minutes, seconds)
    thEnclencherWatch(minutes, seconds)
    timerPaused = false;
    clearInterval(timerInterval)

    timerInterval = setInterval(() => {
      currentTime--;
      
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;
      watchSeconds.style.transform= `rotate(${seconds*6%360}deg)`;
      if (seconds === 0){
        watchMinutes.style.transform= `rotate(${minutes*6%360}deg)`;
      }
      updateTimerDisplay(minutes, seconds)
      updateProgressBar();
      timerIntervalCheck(currentTime) 
    }, 1000);

    document.getElementById("startBtn").style.display = "none";
    document.getElementById("pauseBtn").style.display = "inline-block";

  }

  function timerIntervalCheck(_valChk){
    if (_valChk <= 0) {
      clearInterval(timerInterval);
      if (isWorking) {
        if (currentRound < rounds) {
          //moving to break time
          console.log("!! Entering breaktime: current time, break time ", currentTime, breakTime)
          isWorking = false;
          currentRound++;
          currentTime = breakTime;
          document.getElementById("timer-state").textContent = "Break";
          createNotification(888, "Break time!", 3000)
        } else {
          //timer finished. ⚠️⚠️⚠️ it is not pausing, currently i believe. check
          document.getElementById("timer-state").textContent = "Completed";
          document.getElementById("startBtn").style.display = "inline-block";
          document.getElementById("pauseBtn").style.display = "none";
          timerPaused = true;
          return;
        }
        playAlert(currentAlarm1);
      } else {
        //going back to work time
        currentTime = workTime;
        //showNotification(`Pomodoro Started!", "HOGA detected your break time was completed. We started your next ${workTime} minute Pomodoro session for you.`)
        isWorking = true;
        document.getElementById("timer-state").textContent = "Work";
        playAlert(currentAlarm2);
        createNotification(999, "Timer started.", 3000)
      }
      tsTimerCurrent = currentTime
      tsTimerDesync = Date.now()/1000
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;
      updateTimerDisplay(minutes, seconds)
      showNotification(`HOGA: Alert`)
      /* setTimeout(startTimer, 1000); */
      startTimer()
    }
  }

  // Function to pause the timer
  function pauseTimer() {
    clearInterval(timerInterval);
    timerPaused = true;
    document.getElementById("startBtn").style.display = "inline-block";
    document.getElementById("pauseBtn").style.display = "none";
  }

  // Function to stop the timer
  function stopTimer() {  
    clearInterval(timerInterval);
    currentTime = workTime;
    isWorking = true;
    timerPaused = true;
    currentRound = 1;
    document.getElementById("timer-display").textContent = "25:00";
    document.getElementById("timer-state").textContent = "Work";
    renderProgressBar();

    document.getElementById("startBtn").style.display = "inline-block";
    document.getElementById("pauseBtn").style.display = "none";
    thResetWatchTicks()
  }

  // Function to reset the timer
  function resetTimer() {
    clearInterval(timerInterval);
    currentTime = workTime
    isWorking = true;
    timerPaused = true;
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
    thResetWatchTicks()
  }

  function updateTimerSettings(data) {
    workTime = data.focusTime * 60; // Convert minutes to seconds
    console.log("Updating worktime with focusTime - ", data.focusTime)
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
    } else {
      timerPaused = true;
    }
  }

  // Event listeners for control buttons
  document.getElementById("startBtn").addEventListener("click", startTimer);
  document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
  document.getElementById("stopBtn").addEventListener("click", stopTimer);
  document.getElementById("resetBtn").addEventListener("click", resetTimer);



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
    if (event.data && typeof event.data === "object" && event.data.focusTime) {
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
    const _payload = JSON.stringify({ clock_info: clockSettingsBulk, email: user.email });
    navigator.sendBeacon('/user_clock_settings', _payload);
  });

  window.addEventListener('beforeunload', function (evt) {
    if (isWorking){
      evt.returnValue = 'Timer is currently running. Would you like to confirm leaving the page?';
      return 'Timer is currently running. Would you like to confirm leaving the page?';
    }
  });


  async function restoreTimeSettings(){
    if (widgetSettingsBulk?.["w-timer"]?.["timerValues"] !== undefined){
      console.log("Restoring time settings", widgetSettingsBulk["w-timer"]["timerValues"])
      const res = widgetSettingsBulk["w-timer"]["timerValues"]
      rounds = res.rounds
      workTime = res.workTime==null?1500:res.workTime
      breakTime = res.breakTime==null?300:res.breakTime
      currentTime = res.currentTime==null?1500:res.currentTime
      currentRound = res.currentRound
      isWorking = res.isWorking
      renderProgressBar();
      startTimer() //start and almost instantly stop the timer to set in the retrieved data.
      setTimeout(pauseTimer, 100)
    }
    console.log("No previous timer data found, restoration aborted")
  }

  restoreTimeSettings()
  let timerFrameId;

  function timerSync(_live){
    if (timerPaused == false){
      if (document.visibilityState !== 'visible') {
        tsTimerDesync = Date.now()/1000; // Capture timestamp when tab is unfocused by user
        tsTimerCurrent = currentTime
        console.log("!!User out of focus. TStimerCurrent + TSDesync: ", tsTimerCurrent, tsTimerDesync)
        /* timerFrameReq() */
        console.log("!!Tab visibility false - Starting worker1")
      }
      if (document.visibilityState === 'visible') {
        tsTimerResync = Date.now()/1000
        currentTime = Math.ceil(tsTimerCurrent - (tsTimerDesync!=0?(tsTimerResync - tsTimerDesync):0)) 
        startTimer() //WILL THIS WORK? IDK
        console.log("!!User back in focus. tsTimerResync - tsTimerDesync", tsTimerResync, tsTimerDesync)
        console.log("!!User back in focus. timerCurrent - the above: ", tsTimerCurrent, Math.ceil(tsTimerResync-tsTimerDesync))
        console.log("!!then what is currentTime, ", currentTime)
        console.log("!!Tab visibility true - Interrupting worker1")
        tsTimerDesync = 0;
        tsTimerResync = 0;
        createNotification(560, "Timer synchronization in progress...", 2700, "url(../static/icons/timerAnim.gif)")     
      }
    }
  }

  document.addEventListener('visibilitychange', () => {
    timerSync()
  });
  /* 
  function timerFrameReq(){
    timerFrameId = requestAnimationFrame(testRenameLater)
  }

  function testRenameLater(){
      const bgTimeChk = tsTimerCurrent - (tsTimerDesync - Date.now()/1000)
      timerIntervalCheck(bgTimeChk)
  }
  */

  //mutation observer - testing purpose
  const timerTargetNode = document.getElementById("timer-display");
  const timerConfig = { attributes: true, childList: true};

  const timerCallback = (mutationList, timerObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("WARNING A timer child node has been added or removed.");
      } else if (mutation.type === "attributes") {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
      }
    }
  };

  // Create an observer instance linked to the callback function
  const timerObserver = new MutationObserver(timerCallback);

  // Start observing the target node for configured mutations
  timerObserver.observe(timerTargetNode, timerConfig);

  //special watch theme stuff
  function thEnclencherWatch(_minRota, _secRota){
    _secRota = !_secRota?60:_secRota;
    watchSeconds.style.transform= `rotate(${_secRota*6%360}deg)`
    watchMinutes.style.transform= `rotate(${_minRota*6%360}deg)`
    console.log("ROTA FOR MINUTES AT: ", _minRota*6)
  } 


  function thResetWatchTicks(){
    watchSeconds.style.transform= `rotate(${currentTime%60}deg)`
    watchMinutes.style.transform= `rotate(${Math.floor(currentTime/60)}deg)`
  }

  //Worker for background timer

  var worker = new Worker('../static/js/worker.js');

  worker.onmessage = function() { //called every 1 second according to the worker in worker.js
    if (document.visibilityState !== "visible"){
      const bgTimeChk = tsTimerCurrent + (tsTimerDesync - Date.now()/1000); 
  /*     console.log("!!running worker in background. bgTimeChk val: ", bgTimeChk)
      console.log("!!tsTimerCurrent!!: ", tsTimerCurrent)
      console.log("!!tsTimerDesync: ", tsTimerDesync)
      console.log("!!date now: ", Date.now()/1000)
      console.log("!!then wtf is timer desync - date now?? ", tsTimerDesync-Date.now()/1000) */
      timerIntervalCheck(bgTimeChk)
    }
  };

})() //end of IIFE

function timerCurrentSave(){
  clockSettingsBulk.rounds = rounds
  clockSettingsBulk.workTime = workTime
  clockSettingsBulk.breakTime = breakTime
  clockSettingsBulk.currentTime = currentTime
  clockSettingsBulk.currentRound = currentRound
  clockSettingsBulk.isWorking = isWorking
  console.log("saving current timer settings.")
  return clockSettingsBulk
}





