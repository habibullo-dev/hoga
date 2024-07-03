thDreamy()

async function thDreamy(){

    FXCreateFireFlies(14)

    console.log("Content finished loading. deleting Loading Screen")
    loadingScreen.style.opacity="0";
    setTimeout(()=>{
        loadingScreen.innerHTML="";
    }, 150)
}