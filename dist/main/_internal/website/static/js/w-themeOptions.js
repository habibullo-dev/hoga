
console.log("!!THEMEOPTIONS WAS JUST DEFINED? ", themeOptions)
const selectFXBtn = Array.from(document.querySelectorAll(".selectFXBtn")) //⚠️ obsolete?


document.querySelector("#focusModeSwitch").addEventListener("click", ()=>{ //To avoid redeclaration conflict, storing id in variable WITHIN the event listener
    const focusModeSwitch =  document.getElementById("focusModeSwitch")
    console.log("focus mode toggled!")
    focusModeSwitch.classList.toggle("focusModeOn")
    if (focusModeSwitch.classList.contains("focusModeOn")){
        loadingScreen.innerHTML='<div id="loadingBarBlackBG" style="filter: blur(20px); transition: all 1.5sec ease-in;">'
        loadingScreen.style.opacity="0.95"
        
    } else {
        loadingScreen.style.opacity="0"
        loadingScreen.innerHTML=""
    }
})
//activeThemeSetup()




//Theme options widget function - global-level ⚠️⚠️⚠️
async function activeThemeSetup(_force){
    console.log("!! ACTIVETHEMESETUP FUNC RAN")
    /* await createWidget("w-themeOptions") */
    
    if (!_force){
        _innerHTML = thOptionsHTML;
        themeExtraOptions.innerHTML = _innerHTML;
    }
    _funcArr = thFuncArr;
    
    console.log("!! WIDGETSETTINGSBULK CURRENTTHEME:", widgetSettingsBulk.currentTheme)


    const themeClickables = Array.from(document.querySelectorAll(".thOptionClickable"))
    console.log("!! WHAT ARE THE THEME CLICKABLES, ", themeClickables)
    themeClickables.forEach((clickable, i)=>{
        try {
            clickable.addEventListener("click", _funcArr[i])
        } catch(error) {
            console.log(error, ` - Index ${i} out of bounds for _funcArr? `, _funcArr, " - Double-check: ", _funcArr[i])
        }
    })
    if (themeOptions.classList.contains("display-toggle")){
        themeOptions.classList.toggle("display-toggle")
    }
    console.log("Finished setting up clickables for your option theme.", _funcArr)
}

function FXCreatePixies(_num){
    for (let i = 0; i<_num; i++){
        const pixieCont = document.createElement("div")
        pixieCont.innerHTML = `<div class="pixie"></div>`
        pixieCont.classList.add("pixie-container")
        bgFXCont.appendChild(pixieCont)
    }
}

function FXCreateShootingStars(_num){
    const nightFX = document.createElement("div")
    nightFX.classList.add("night")
    bgFXCont.appendChild(nightFX)
    for (let i = 0; i<_num; i++){
        const shootingStar = document.createElement("div")
        shootingStar.classList.add("shooting_star")
        nightFX.appendChild(shootingStar)
    }
}

function FXCreateFireFlies(_num){
    for (let i = 0; i<_num; i++){
        const firefly = document.createElement("div")
        firefly.classList.add("firefly")
        bgFXCont.appendChild(firefly)
    }
}

function FXCreateEnergy(){
    const starfield1 = document.createElement("div")
    starfield1.id = "stars"
    bgFXCont.appendChild(starfield1)
    const starfield2 = document.createElement("div")
    starfield2.id = "stars2"
    bgFXCont.appendChild(starfield2)
    const starfield3 = document.createElement("div")
    starfield3.id = "stars3"
    bgFXCont.appendChild(starfield3)
}

function setupFX(_type, _num){
    bgFXCont.innerHTML=""

    switch (_type){
        case "cancel":
            return;
        case "pixie":
            FXCreatePixies(50)
            break;
        case "fireflies":
            FXCreateFireFlies(14)
            break;
        case "snowfall":
            break;
        case "rain":
            break;
        case "pug":
            const pugDog = document.createElement("div")
            pugDog.id = "gifPug"
            bgFXCont.appendChild(pugDog)
            break;
        case "shootingstar":
            FXCreateShootingStars(20)
            break;
        case "energy":
            FXCreateEnergy()
            break;
    }
    if (document.getElementById("focusModeSwitch").classList.contains("focusModeOn")){
        focusModeSwitch.classList.toggle("focusModeOn")
        loadingScreen.style.opacity="0"
        loadingScreen.innerHTML=""
    }
    
}

/* SFX AND MUSIC PLAYERS */

let playingMusic = new Audio();
playingMusic.onpause = function (){}
playingMusic.onplay = function (){}
playingMusic.onended = function (){}

const BGMBar = document.getElementById('BGMBar');
const BGMBarContainer = document.getElementById('BGMBarContainer');
const BGMCurrentTime = document.getElementById('BGMCurrentTime');
const BGMDuration = document.getElementById('BGMDuration');
const BGMtitle = document.getElementById(`BGMtitle`)

let playingBGSFX = new Audio();
playingBGSFX.loop = true;



playingMusic.ontimeupdate = ()=>{
    const _BGMCurrentTime = playingMusic.currentTime;
    const _BGMDuration = playingMusic.duration;
    const _progressPercent = (_BGMCurrentTime / _BGMDuration) * 100;
    BGMBar.style.width = _progressPercent + '%';
    BGMCurrentTime.textContent = formatTime(_BGMCurrentTime);
};

playingMusic.onloadedmetadata = ()=>{
    BGMDuration.textContent = formatTime(playingMusic.duration);
};

function playBGM(){
    if (playingMusic.src){
        playingMusic.play();
    }
}
function pauseBGM(){
    playingMusic.pause();
}
function stopBGM(){
    playingMusic.pause()
    playingMusic.currentTime = 0
    playingMusic.src = ""
    BGMtitle.innerHTML = ""
}
let themeMusicVolumeDialElem = document.getElementById("themeMusicVolumeDial");
let themeMusicIncElem = document.getElementById("themeMusicInc");
let themeMusicDecElem = document.getElementById("themeMusicDec");
let SFXVolumeDialElem = document.getElementById("SFXVolumeDial");
let SFXIncElem = document.getElementById("SFXInc");
let SFXDecElem = document.getElementById("SFXDec");

let themeMusicVolumeDialCurrRotation = 0;
let SFXvolumeDialCurrRotation = 0;

function updateThemeMusicDialRotation(_value) {
    themeMusicVolumeDialElem.style.transform = `rotate(${_value}deg)`;
    console.log("updateThemeMusicDialRotation was called");
}
playingMusic.volume = 0.5;
function volumeBGM(_value){
    if (_value == "+"){
        playingMusic.volume = Math.round(Math.min(playingMusic.volume + 0.1, 1.0) * 10) / 10;
        themeMusicVolumeDialCurrRotation = Math.min(themeMusicVolumeDialCurrRotation + 18, 90);
        console.log("themeMusicVolumeDialCurrRotation was incremented: ", themeMusicVolumeDialCurrRotation);
        updateThemeMusicDialRotation(themeMusicVolumeDialCurrRotation);
        console.log(playingMusic.volume);
    } else {
        playingMusic.volume = Math.round(Math.max(playingMusic.volume - 0.1, 0) * 10) / 10;
        themeMusicVolumeDialCurrRotation = Math.max(themeMusicVolumeDialCurrRotation - 18, -90);
        console.log("themeMusicVolumeDialCurrRotation was decremented: ", themeMusicVolumeDialCurrRotation)
        updateThemeMusicDialRotation(themeMusicVolumeDialCurrRotation);
        console.log(playingMusic.volume);
    }
}

themeMusicIncElem.addEventListener("click", ()=> {
    volumeBGM("+");
    console.log("event listener on theme music dial was triggered", );
})
themeMusicDecElem.addEventListener("click", ()=> {
    volumeBGM("-");
})


function updateSFXDialRotation() {
    SFXVolumeDialElem.style.transform = `rotate(${SFXvolumeDialCurrRotation}deg)`;
}
playingBGSFX.volume = 0.5
function volumeSFX(_value){
    if (_value == "+"){
        playingBGSFX.volume = Math.round(Math.min(playingBGSFX.volume + 0.1, 1.0) * 10) / 10;
        SFXvolumeDialCurrRotation = Math.min(SFXvolumeDialCurrRotation + 18, 90);
        console.log("SFXvolumeDialCurrRotation was incremented: ", SFXvolumeDialCurrRotation);
        updateSFXDialRotation();
        console.log(playingBGSFX.volume);
    } else {
        playingBGSFX.volume = Math.round(Math.max(playingBGSFX.volume - 0.1, 0) * 10) / 10;
        SFXvolumeDialCurrRotation = Math.ceil(Math.max(SFXvolumeDialCurrRotation - 18, -90));
        console.log("SFXvolumeDialCurrRotation was decremented: ", SFXvolumeDialCurrRotation);
        updateSFXDialRotation();
        console.log(playingBGSFX.volume);

    }
}

SFXIncElem.addEventListener("click", ()=> {
    volumeSFX("+");
})
SFXDecElem.addEventListener("click", ()=> {
    volumeSFX("-");
})

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}

BGMBarContainer.addEventListener('click', function(e) {
    const rect = BGMBarContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const totalWidth = rect.width;
    const seekTime = (offsetX / totalWidth) * playingMusic.duration;
    playingMusic.currentTime = seekTime;
});

function playSFX(e){
    if(e.target.dataset.sfx){
        playingBGSFX.pause()
        playingBGSFX.currentTime = 0
        if (e.target.dataset.sfx=="cancel"){return}
        playingBGSFX.src = `../static/sound/SFX/${e.target.dataset.sfx}.ogg`
        playingBGSFX.load()
        playingBGSFX.play()
    }else if (e.target.dataset.music){
        playingMusic.pause()
        playingMusic.currentTime = 0
        BGMtitle.innerHTML = ""
        if (e.target.dataset.music=="cancel"){return}
        playingMusic.src = `../static/sound/Music/${e.target.dataset.music}.mp3`
        playingMusic.load()
        playingMusic.play()
        BGMtitle.innerHTML = `${e.target.dataset.music}`
    }
        

}