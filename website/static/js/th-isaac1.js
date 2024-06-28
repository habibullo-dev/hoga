
th1TimeChange()

async function th1TimeChange(){
        console.log("detected time change")
        const th1BG = document.getElementById("backdropSky")
        const th1Timebound = Array.from(document.getElementsByClassName("timeBound"))
        const th1TimeBoundCont = document.getElementById("timeBoundCont")
        console.log("Console", th1TimeBoundCont, document.getElementById("timeBoundCont"))
        const currentHour = new Date().getHours()


        if (currentHour > 6 && currentHour < 17){
            th1BG.src = "../static/images/themes/DXM/014.webp"
            th1Timebound.forEach((elem)=>{
                elem.remove
            })
            th1TimeBoundCont.innerHTML = `
            <img src="../static/images/themes/DXM/013.webp" class="parallaxElem ik-cloud timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="600" style="left:90%; top: 54%">
            <img src="../static/images/themes/DXM/012.webp" class="parallaxElem ik-cloud timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="900" style="left: 10%; top: 20%">
            <img src="../static/images/themes/DXM/010.webp" class="parallaxElem ik-fog2 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 40%">
            <img src="../static/images/themes/DXM/009.webp" class="parallaxElem ik-fog1 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 73%">    
            `
        } else {
            th1BG.src = "../static/images/themes/DXM/008.webp"
            th1Timebound.forEach((elem)=>{
                elem.remove
            })
            th1TimeBoundCont.innerHTML = `
            <img src="../static/images/themes/DXM/007.webp" class="parallaxElem timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="287" style="top:15%; width:110%">
            <img src="../static/images/themes/DXM/006.webp" class="parallaxElem timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="500" style="left: 90%; top:20%; width:3.5rem; height:3.5rem">
            <img src="../static/images/themes/DXM/010.webp" class="parallaxElem ik-fog2 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 40%">
            <img src="../static/images/themes/DXM/009.webp" class="parallaxElem ik-fog1 timeBound" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="68" style="top: 73%">    
            `
        }
        parallaxStartUp({staticTitle:true, distCalc:1.5, rotaCalc:3}, paraStopButton, paraStartButton)
        await imgLoadPromise(th1TimeBoundCont);
        console.log("Content finished loading. deleting Loading Screen")
        loadingScreen.style.opacity="0";
        setTimeout(()=>{
            loadingScreen.innerHTML="";
        }, 150)

}


    
