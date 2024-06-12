//TODOLIST:

    //⚠️The clock does not run when tab is unfocused!

clockStartBtn.addEventListener("click", ()=>{
    clockStartBtn.classList.toggle("btnToggleStart")
    if (timerEngaged == false){
        console.log("!!runTimer function fired. ts_start should not be 0")
        runTimer(userHour, userMin, userSec)
    } else {
        if (!clockStartBtn.classList.contains("btnToggleStart")){
            clockStartBtn.innerHTML = "Pause"
            timerPlaying = false
            console.log("!!BUTTONTOGGLE START FOUND, THIS SHOULD APPEAR 1")
            console.log("timerPlaying should be FALSE", timerPlaying)
        } else {
            clockStartBtn.innerHTML = "Start"
            timerPlaying = true
            console.log("!!BUTTONTOGGLE START NOT FOUND, THIS SHOULD APPEAR 1")
            console.log("timerPlaying should be TRUE", timerPlaying)
        }
        UnPauseTimer()
    }
})

clockStopBtn.addEventListener("click", ()=>{
    if (!clockStartBtn.classList.contains("btnToggleStart")){
        clockStartBtn.classList.toggle("btnToggleStart")
    }
    clockStartBtn.innerHTML = "Start"
    stopTimer()
})


//Var Setup

let timerEngaged = false
let timerPlaying = false
let user = "CACA";

let userMin = 25
let userSec = 30
let userHour = 1 //unused

let miliRunInterval = null

//testing/placeholders
let chosenMin = 20
let chosenSec = 0
let chosenHour = 1
function userClockSetup(){
    fetch("/clockSetup", {
        method: "POST",
        body: JSON.stringify({ chosenPayload:{
            chosenMin : chosenMin,
            chosenSec : chosenSec,
            chosenHour : chosenHour
        }}),
        headers:{
            'Content-Type': 'application/json'
            },
    }).then(()=>{
        userMin = chosenMin;
        userSec = chosenSec;
        userHour = chosenHour;
    })
}

//functions to run at start
startUpMark()
userClockSetup()



async function startUpMark(){
    console.log("async treshold startup mark.")
    let _fetcher = await fetch("/startUpClockChk", {
        method: "POST",
        body: JSON.stringify({
            name: user, //⚠️need to set up back-end to accept user change for example. might need to remove from this function.
        }),
        headers:{
            'Content-Type': 'application/json'
            },
    })
    _fetcher = await _fetcher.json()    
    if (_fetcher.timeToRemove){
        console.log("!!resuming clock run:", _fetcher)
        const _obj = _fetcher.timeToRemove
        console.log("!!how much time to remove", _obj)
        console.log("!!example of seconds to remove:", _obj.seconds)
        timerPlaying = true;
        timerEngaged = true;
        timeShave(_obj)
        fetch("/unpauseClock")
        clockStartBtn.innerHTML = "Pause"// ⚙️fuse this with the button event listener
        clockStartBtn.classList.toggle("btnToggleStart")// ⚙️fuse this with the button event listener
        miliRun()
    } else if (_fetcher.timeToDisplay){
        console.log("resuming paused clock")
        const _obj = _fetcher.timeToDisplay
        console.log("how much time to display", _obj)
        timerPlaying = false;
        timerEngaged = true;
        timeShave(_obj)    
    } else {
        console.log("clock was detected as stopped/unexisting")
        //⚠️ bring in user-set userMin and stuff from back-end database.
        displaySeconds.innerHTML = chosenSec
        if (chosenSec > 10){
            secondXtraDigit.innerHTML = ""
        }
        displayMinutes.innerHTML = chosenMin
    }
    userMin = chosenMin;
    userSec = chosenSec;
    userhour = chosenHour;
}

function timeShave(_obj){ //fixes displayed clock by removing time from the user pre-defined "run time" (ex: 25min run time - 7 min elapsed.)
    if ((userSec - Math.floor(_obj.seconds)) < 0){
        console.log(`!!innerHTML = 60 + userSec(${userSec}) - Math.floor(_obj.seconds)(${Math.floor(_obj.seconds)}): ${60 + userSec - Math.floor(_obj.seconds)}`)
        userMin -= 1 //⚠️this could lead to issues..
        displaySeconds.innerHTML = 60 + userSec - Math.floor(_obj.seconds)
    } else {
        displaySeconds.innerHTML = userSec - Math.floor(_obj.seconds)   
    }
    if (userMin - Math.floor(_obj.minutes) < 0){
        userHour -= 1 //⚠️hours hasnt been set yet.
        console.log(`!!innerHTML = 60 + userMin(${userMin}) - Math.floor(_obj.minutes)(${Math.floor(_obj.minutes)}): ${60 + userMin - Math.floor(_obj.minutes)}`)
        displayMinutes.innerHTML = 60 + userMin - Math.floor(_obj.minutes)
    } else {
        displayMinutes.innerHTML = userMin-Math.floor(_obj.minutes)
        console.log(`!!innerHTML = userMin(${userMin}) - Math.floor(_obj.minutes)(${Math.floor(_obj.minutes)}): ${userMin-Math.floor(_obj.minutes)}`)
    }
    if (displaySeconds.innerHTML < 10){ // if digits for seconds are 1, add a 0 in front for beautification
        secondXtraDigit.innerHTML = 0
    } else {
        secondXtraDigit.innerHTML = "" // else none
    }
}

function intervalRemove(_interval){
    clearInterval(_interval)
    return null
}

function runTimer(_hour, _min, _sec){ //
    fetch("/clockStart")
        .then(res=>res.json())
        .then(res=> {
            miliRun(_hour, _min, _sec)
        })
    displayMinutes.innerHTML = Math.floor(_min)
    displaySeconds.innerHTML = Math.floor(_sec)
    clockStartBtn.innerHTML = "Pause"
    timerPlaying = true
    console.log("timerPlaying should be TRUE", timerPlaying)
    timerEngaged = true
}

function UnPauseTimer(_hour, _min, _sec){ //both pause and unpause
    console.log("!!RUNNING UNPAUSE TIMER - what is timerPlaying", timerPlaying)
    if (timerPlaying == true){
        console.log("pausing the clock because timerPlaying is true?", timerPlaying)
        if (miliRunInterval) {
            intervalRemove(miliRunInterval)
            console.log('Interval cleared');
        } else {
            console.log('⚠️⚠️⚠️No interval to clear');
        }
        //clearInterval(miliRunInterval)
        fetch("/pauseClock")
        timerPlaying = false
        return false
    } else {
        console.log("unpausing the clock because timerPlaying is false?", timerPlaying)
        fetch("/unpauseClock")
        miliRun(_hour, _min, _sec)
        timerPlaying = true
    }
}

function stopTimer(_hour, _min, _sec){
    console.log("clearing interval to stop timer.")
    fetch("/clockStop")
    intervalRemove(miliRunInterval)
    userMin = chosenMin;
    userSec = chosenSec;
    userHour = chosenHour;
    displayMinutes.innerHTML = Math.floor(userMin)
    displaySeconds.innerHTML = Math.floor(userSec)
    if (displaySeconds.innerHTML > 10){
        secondXtraDigit.innerHTML = ""
    }
    displayMilisec.innerHTML = 0
    timerPlaying = false
    timerEngaged = false
}

function timerAdjust(_interval, _hour, _min, _sec){
    adjustInterval = setInterval(()=>{
        fetch("/tsAdjust")
        /* .then(res=>res.json())
        .then(res=> {
            let epoch_mins = parseInt(res.minutes)%60*-1
            let epoch_secs = parseInt(res.seconds)%60*-1
            let epoch_milisecs = parseInt(res.miliseconds)%1000*-1
            console.log(`DISPLAY SEC: ${displaySeconds.innerHTML}`)
            console.log(`EPOCH SEC: ${60-epoch_secs}`)
            console.log(`DISPLAY MILISEC: ${displayMilisec.innerHTML}`)
            console.log(`EPOCH MILISEC: ${100-epoch_milisecs}`)
            if (parseInt(displaySeconds.innerHTML) != 60-epoch_secs){
                console.log("Adjusting epoch and local time")
                displaySeconds.innerHTML = 60-epoch_secs
            }
        })  */
    },_interval)
}

function miliRun(_hour, _min, _sec){
    intervalRemove(miliRunInterval)
    miliRunInterval = setInterval(()=>{
        if (displayMilisec.innerHTML <= 0){ // reset Milisecs to 100, remove a second.
            displayMilisec.innerHTML = 100
            displaySeconds.innerHTML = Math.floor(displaySeconds.innerHTML) - 1
        }
        if (displaySeconds.innerHTML <= 0 || displaySeconds.innerHTML == 60){ // reset seconds to 60, remove a minute.
            displaySeconds.innerHTML = 59
            displayMinutes.innerHTML = Math.floor(displayMinutes.innerHTML) - 1
        }
        if (displaySeconds.innerHTML < 10){ // if digits for seconds are 1, add a 0 in front for beautification
            secondXtraDigit.innerHTML = 0
        } else {
            secondXtraDigit.innerHTML = "" // else none
        }
        displayMilisec.innerHTML = Math.floor(displayMilisec.innerHTML) - 1
    }, 10)
}

/* function runTracker(){
    fetch("/runTracker" ,{
        method: "POST",
        body: JSON.stringify({
            name: user,
            pauseOrPlay: timerPlaying,
        }),
        headers:{
            'Content-Type': 'application/json'
            },
    })
    .then(res=>res.json())
    .then(res=>test
        //⚠️grab the res.minutes, res.sec etc and store them in a new local object.
        )
} */

//⚠️⚠️test
/* clockStartBtn.addEventListener("click", async ()=>{
    try {
        let fetcher = await fetch("/start");
        fetcher = await fetcher.text();
    }   
    catch (err) {
        console.error("301 - Problems with back-end fetch method")
    }

})

stopButton.addEventListener("click", async ()=>{
    let fetcher = await fetch("elapsed");
    fetcher = await fetcher.text();

}) */
//⚠️⚠️endof Test