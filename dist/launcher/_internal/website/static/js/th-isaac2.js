parallaxStartUp({staticTitle:true, distCalc:1.5, rotaCalc:3}, paraStopButton, paraStartButton)
th2TimeChange()

async function th2TimeChange(){


    
    document.querySelector("#vw-sumer").classList.add(`vw-roll${Math.floor(Math.random() * (4 - 1) + 1)}`);

    console.log("Content finished loading. deleting Loading Screen")
    loadingScreen.style.opacity="0";
    setTimeout(()=>{
        loadingScreen.innerHTML="";
    }, 150)
}