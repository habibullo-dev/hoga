themeExtraOptions.innerHTML = `
<div class="themeOptionsCat">Background Customization
    <div class="optionCont"><p id="th1CityName">Tokyo</p>
        <label class="togSwitch"> 
            <input type="checkbox" id="th1CitySwitch" class="thOptionClickable">
            <span class="togRound"></span>
        </label>
    </div>
    <div class="optionCont"><p id=th1TimeName>Day</p>
        <label class="togSwitch"> 
            <input type="checkbox" id="th1TimeSwitch" class="thOptionClickable">
            <span class="togRound"></span>
        </label>
    </div>
</div>
`



/* let th1CityFlip;
let th1TimeFlip; */



th1TimeChange()

async function th1TimeChange(){
        console.log("detected time change")
        const th1BG = document.getElementById("backdropSky")
        //const th1Timebound = Array.from(document.getElementsByClassName("timeBound"))
        const currentHour = new Date().getHours()


        const th1TimeBoundCont = document.getElementById("timeBoundCont")
        const th1TimeSwitch = document.getElementById("th1TimeSwitch")
        const th1CitySwitch = document.getElementById("th1CitySwitch")
        const th1TimeName = document.getElementById("th1TimeName")
        const th1CityName = document.getElementById("th1CityName")
        









function th1CityFlip(){
    console.log("!!running city flip")
    if (th1CitySwitch.checked){     
        if (!th1TimeSwitch.checked){
            th1SeoulNight()
        } else {
            th1SeoulDay()
        }          
        th1CityName.innerText = "Seoul"
    } else {
        if (!th1TimeSwitch.checked){
            th1TokyoNight()
        } else {
            th1TokyoDay()
        }       
        th1CityName.innerText = "Tokyo"
    }
}

function th1TimeFlip(){
    console.log("!!running time flip")
    if (th1TimeSwitch.checked){
        th1ForceDay()
    } else {
        th1ForceNight()
    }
}

function th1ForceNight(){
    if (th1CitySwitch.checked){
        th1SeoulNight()
    } else {
        th1TokyoNight()
    }
    th1TimeName.innerText = "Night"
    th1TimeSwitch.checked = false
}

function th1ForceDay(){
    if (th1CitySwitch.checked){
        th1SeoulDay()
    } else {
        th1TokyoDay()
    }
    th1TimeName.innerText = "Day"
    th1TimeSwitch.checked = true
}

function th1TokyoDay(){
    th1BG.src = "../static/images/themes/DXM/014.webp"
    th1TimeBoundCont.innerHTML = `
    <img src="../static/images/themes/DXM/013.webp" class="parallaxElem ik-cloud timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="600" style="left:90%; top: 54%">
    <img src="../static/images/themes/DXM/012.webp" class="parallaxElem ik-cloud timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="900" style="left: 10%; top: 20%">
    <img src="../static/images/themes/DXM/010.webp" class="parallaxElem ik-fog2 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 40%">
    <img src="../static/images/themes/DXM/009.webp" class="parallaxElem ik-fog1 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 73%">    
    `
}

function th1TokyoNight(){
    th1BG.src = "../static/images/themes/DXM/008c.webp"
    th1TimeBoundCont.innerHTML = `
    <img src="../static/images/themes/DXM/007.webp" class="parallaxElem timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="287" style="top:15%; width:110%">
    <img src="../static/images/themes/DXM/006.webp" class="parallaxElem timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="500" style="left: 90%; top:20%; width:3.5rem; height:3.5rem">
    <img src="../static/images/themes/DXM/010.webp" class="parallaxElem ik-fog2 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 40%">
    <img src="../static/images/themes/DXM/009.webp" class="parallaxElem ik-fog1 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 73%">    
    `
}

function th1SeoulDay(){
    th1BG.src = "../static/images/themes/DXM/017.webp"
    th1TimeBoundCont.innerHTML = `
    <img src="../static/images/themes/DXM/010.webp" class="parallaxElem ik-fog2 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 40%">
    <img src="../static/images/themes/DXM/009.webp" class="parallaxElem ik-fog1 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 73%">    
    `
}

function th1SeoulNight(){
    th1BG.src = "../static/images/themes/DXM/016.webp"
    th1TimeBoundCont.innerHTML = ``
}







        
        thFuncArr = [th1CityFlip, th1TimeFlip]
        
        activeThemeSetup("force")
        if (currentHour > 6 && currentHour < 17){
            th1ForceDay()           
        } else {
            th1ForceNight()
        }

        parallaxStartUp({staticTitle:true, distCalc:1.5, rotaCalc:3}, paraStopButton, paraStartButton)
        await imgLoadPromise(th1TimeBoundCont);
        console.log("Content finished loading. deleting Loading Screen")
        loadingScreen.style.opacity="0";
        setTimeout(()=>{
            loadingScreen.innerHTML="";
        }, 150)

}


    
