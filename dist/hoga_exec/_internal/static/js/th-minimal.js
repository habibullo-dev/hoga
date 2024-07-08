thMinimal()

async function thMinimal(){

    FXCreateShootingStars(20)

    console.log("Content finished loading. deleting Loading Screen")
    loadingScreen.style.opacity="0";
    setTimeout(()=>{
        loadingScreen.innerHTML="";
    }, 150)
}