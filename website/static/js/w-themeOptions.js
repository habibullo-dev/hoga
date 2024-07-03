
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
async function activeThemeSetup(){
    console.log("!! ACTIVETHEMESETUP FUNC RAN")
    /* await createWidget("w-themeOptions") */
    

    _innerHTML = thOptionsHTML;
    _funcArr = thFuncArr;
    
    console.log("!! WIDGETSETTINGSBULK CURRENTTHEME:", widgetSettingsBulk.currentTheme)


    themeExtraOptions.innerHTML = _innerHTML;
    const themeClickables = Array.from(document.querySelectorAll(".thOptionClickable"))
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

function setupFX(_type, _num){
    bgFXCont.innerHTML=""

    switch (_type){
        case "cancel":
            return;
        case "pixie":
            FXCreatePixies(50)
            break;
        case "fireflies":
            for (let i = 0; i<_num; i++){
                const firefly = document.createElement("div")
                firefly.classList.add("firefly")
                bgFXCont.appendChild(firefly)
            }
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
    const BGMCurrentTime = playingMusic.currentTime;
    const BGMDuration = playingMusic.duration;
    const _progressPercent = (BGMCurrentTime / BGMDuration) * 100;
    BGMBar.style.width = _progressPercent + '%';
    BGMCurrentTime.textContent = formatTime(BGMCurrentTime);
};

playingMusic.onloadedmetadata = ()=>{
    durationDisplay.textContent = formatTime(playingMusic.duration);
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
        if (e.target.dataset.music=="cancel"){return}
        playingMusic.src = `../static/sound/Music/${e.target.dataset.music}.mp3`
        playingMusic.load()
        playingMusic.play()
        BGMtitle.innerHTML = `${e.target.dataset.music}`
    }
        

}
