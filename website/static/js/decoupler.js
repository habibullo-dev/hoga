
// Primary Vars 
window.user = {
    "loggedIn": false,
    "email": "empty.com",
    "name": "",
};
window.dbSettingsBulk = {};
window.widgetSettingsBulk = {};

// w-timer Vars

let rounds = 3; // Number of rounds
let workTime = 25 * 60; // Work time in seconds
let breakTime = 5 * 60; // Break time in seconds
let currentTime = workTime; // Initialize current time to work time
let currentRound = 1; // Current round
let isWorking = true; // Flag to track if it's work time or break time
let timerInterval; // Interval ID for timer

window.clockSettingsBulk = {}//shove all the rounds, worktime, breaktime, current round, current time and isworking here.



// Pop-up Vars

const popupImportant = document.getElementById("popup-important")
const popupImpWindow = document.getElementById("popup-imp-window")
const popupSpecial1 = document.getElementById("popup-special1")
const popupSpecial2 = document.getElementById("popup-special2")
const popupImpText = document.getElementById("popup-imp-text")
const popupImpBtn1 = document.getElementById("popup-button1")
const popupImpBtn2 = document.getElementById("popup-button2")

const notifContBottom = document.getElementById("notifContBottom")

function createUrgentPopUp(_innerText, _btn1, _btn2, _btn1Text, _btn2Text) {
    popupImportant.style.display = "flex";
    popupImpWindow.style.display = "flex";
    popupImpText.innerText = _innerText
    popupImpBtn1.addEventListener("click", _btn1)
    popupImpBtn2.addEventListener("click", _btn2)
    popupImpBtn1.innerText = _btn1Text
    popupImpBtn2.innerText = _btn2Text
    popupImpBtn1.addEventListener("click", () => { closeUrgentPopUp(popupImpBtn1, _btn1) })
    popupImpBtn2.addEventListener("click", () => { closeUrgentPopUp(popupImpBtn2, _btn2) })
}

function closeUrgentPopUp(_btn, _btnFunc) {
    popupImportant.style.display = "none";
    popupImpText.innerHTML = ""
    _btn.removeEventListener("click", _btnFunc)
}


//Music/SFX Vars

window.playingMusic = new Audio(); //used in theme options
let currentAlarm = "alarm2.mp3"
let alarmSound = new Audio();


function playAlert(_url, _duration){
    alarmSound.src = ("../static/sound/SFX/"+_url)
    
    alarmSound.onloadedmetadata = function(){
        if (!_duration){
            _duration = alarmSound.duration
        }
        alarmSound.volume = 0.8
        alarmSound.play()

        if (!playingMusic.paused){
            playingMusic.pause();
            setTimeout(()=>{
                playingMusic.play()
            }, _duration*1000+400)
        }

        const fadePoint = _duration - 2; 
        const fadeAudio = setInterval(function () {
            // Only fade if past the fade out point or not at zero already
            if ((alarmSound.currentTime >= fadePoint) && (alarmSound.volume != 0.0)) {
                alarmSound.volume -= 0.1;
            }
            // When volume at zero stop all the intervals here.
            if (alarmSound.volume === 0.0) {
                clearInterval(fadeAudio);
            }
        }, 200)

        setTimeout(()=>{
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }, _duration*1000)
    };

    alarmSound.load()
}