
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
