thOptionsHTML = `
<div class="themeOptionsCat">Background Customization
    <div class="optionCont">
        <button class="themeOptionsBtn thOptionClickable">Switch</button><text class="themeOptionsText">Phone Animation</text>
    </div>
    <div class="optionCont">
        <button class="themeOptionsBtn thOptionClickable">Switch</button><text class="themeOptionsText">Screen Animation</text>
    </div>
</div>
`
thFuncArr = [th3ScreenFlip1, th3ScreenFlip2]




th3Particles()
createWidget("w-themeOptions")

function th3ScreenFlip1(){
    const th3Screen1 = document.querySelector("#th3Screen1")
    th3i1<1?th3i1++:th3i1=0
    th3Screen1.src = `../static/images/themes/DXM/V002${th3i1}.webp`
}

function th3ScreenFlip2(){
    const th3Screen2 = document.querySelector("#th3Screen2")
    th3i1<2?th3i1++:th3i1=0
    th3Screen2.src = `../static/images/themes/DXM/V001${th3i1}.webp`
}






async function th3Particles(){

    for (let i = 0; i<50; i++){
        const pixieCont = document.createElement("div")
        pixieCont.innerHTML = `<div class="pixie"></div>`
        pixieCont.classList.add("pixie-container")
        bgFXCont.appendChild(pixieCont)
    }

    console.log("Content finished loading. deleting Loading Screen")
    loadingScreen.style.opacity="0";
    setTimeout(()=>{
        loadingScreen.innerHTML="";
    }, 150)
}