
// Primary Vars 
window.user = {
    "loggedIn": false,
    "email": "empty.com",
    "name": "",
};
window.dbSettingsBulk = {};
window.widgetSettingsBulk = {};
window.clockSettingsBulk = {}//shove all the rounds, worktime, breaktime, current round, current time and isworking here.

// w-timer Vars

let rounds = 3; // Number of rounds
let workTime = 25 * 60; // Work time in seconds
let breakTime = 5 * 60; // Break time in seconds
let currentTime = workTime; // Initialize current time to work time
console.log("!!Reset currenttime to WorkTime, ", currentTime)
let currentRound = 1; // Current round
let isWorking = true; // Flag to track if it's work time or break time
let timerInterval; // Interval ID for timer
let timerPaused = true;

let tsTimerDesync=0;
let tsTimerResync=0;
let tsTimerCurrent=0;





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
            if (alarmSound.currentTime >= fadePoint && alarmSound.volume > 0.2) {
                alarmSound.volume -= 0.1;
            }
            // When volume at zero stop all the intervals here.
            if (alarmSound.volume <= 0.0) {
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

// Function to create notification
function createNotification(_code, _text, _duration, _img) {
    for (child of (Array.from(notifContBottom.children))){
        if (child.dataset.code == _code){
        console.log("duplicate notif detected. Cancelling", _code)
        return
        }
    }
    console.log("!!Created a notif!");
    const notification = document.createElement("div");
    notification.classList.add("notification");

    // Styles
    notification.dataset.code = _code
    notification.style.position = "relative";
    notification.style.bottom = "2rem";
    notification.style.right = "2rem";
    notification.classList.add("th-oblongBase")
    notification.style.fontFamily = "Albert Sans";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "8px";
    notification.style.zIndex = "10000";
    notification.style.opacity = "1";
    notification.style.transition = "opacity 0.5s ease-in-out";
    notification.style.display = "flex"
    notification.style.marginTop = "0.3rem"

    if (_img){
        const extraImg = document.createElement("div")
        extraImg.style.width = "2rem"
        extraImg.style.height = "2rem"
        extraImg.style.backgroundSize = "contain"
        extraImg.style.marginRight = "0.6rem"
        extraImg.style.backgroundImage = _img
        notification.appendChild(extraImg)
    }

    const notifCont1 = document.createElement("div");
    notifCont1.style.display = "flex"
    notifCont1.style.flexDirection = "column"
    notification.appendChild(notifCont1)

    // Create and style the icon image
    const icon = document.createElement("img");
    icon.src = "../static/images/logo-rev.png";
    icon.alt = "Icon";
    icon.style.width = "40px"; // Adjust the width of the icon as needed
    icon.style.display = "block"; // Ensure icon is on its own line

    // Create and style the text element
    const text = document.createElement("div");
    text.textContent = _text;
    text.style.marginTop = "5px"; // Adjust spacing between icon and text
    text.style.fontSize = "0.9rem"; // Adjust font size of the text

    // Append icon and text to notification container
    notifCont1.appendChild(icon);
    notifCont1.appendChild(text);


    notifContBottom.appendChild(notification);

    // Fade out after 2 seconds
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
        notification.remove();
        }, 500); // Remove element after fade out animation
    }, _duration);
}

//Push Notification and Web Workers
if ("Notification" in window) {
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            console.log("Notification permission granted");
        } else if (permission === "denied") {
            console.log("Notification permission denied");
            // Handle denied permission
        } else {
            console.log("Notification permission default (dismissed)");
            // Handle default (dismissed) permission
        }
    });
}

//Worker Special
window.workerMsgInterval = false


/* 
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(function(registration) {
            console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch(function(error) {
            console.error("Service Worker registration failed:", error);
        });
}
 */
function showNotification(_title, _text) {
    if (Notification.permission === "granted") {
        const notification = new Notification(_title, {
            body: _text
            // Other options like icon, image, etc., can be added
        });
        // Handle notification events (e.g., onclick)
        notification.onclick = function () {
            console.log("Notification clicked");
            // Perform actions when notification is clicked
        };
    }
}

window.worker1Interval