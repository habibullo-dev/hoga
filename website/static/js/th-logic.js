//⚠️INSTRUCTIONS AT THE END OF THE CODE⚠️

const bgFXCont = document.getElementsByClassName("bg-effect")[0] 

let thOptionsHTML;
let thFuncArr;

let th3i1 = 0 //special vars for theme 3
let th3i2 = 0

//Startup theme recall


window.thKillSwitch;
window.loadingScreen = document.createElement("div")


loadingScreen.id="loadSCreenCont"
let loadBars = Array.from(document.querySelectorAll(".loadInner"))
const parentGrid = document.getElementById("grid-container")
parentGrid.insertBefore(loadingScreen, parentGrid.firstChild)



document.addEventListener("DOMContentLoaded", function () {

    const thDevBtn = document.getElementById("dev-pick-button"),
        thDevPicks = document.getElementById("nav-dev-picks"),
        thThemeBtn = document.getElementById("theme-pick-button"),
        thThemeSimple = document.getElementById("nav-themes-simple")

    const themeOptionsBtn = document.getElementById("w-themeOptions")
    const themesBtnArr = Array.from(thDevPicks.children)
    const themeOptions = document.querySelector("#themeOptions") //store the name of the theme options container.
    const themeExtraOptions = document.querySelector("#themeExtraOptions")

    Array.from(document.querySelectorAll(".themeSwitch")).forEach((btn)=>{
        btn.addEventListener("click", ()=>{themeExtraOptions.innerHTML = ""})
    })

/*     themeOptionsBtn.addEventListener("click", ()=>{
        console.log("!!WIDGETSETTINGSBULK STATUS", widgetSettingsBulk)
        if (!widgetSettingsBulk["w-themeOptions"]){ //⚠️⚠️⚠️🚧
            console.log("spawning theme widget")
            createWidget("w-themeOptions")
        } else {
            console.log("attempting to remove widget for theme")
            gridContainer.removeChild(widgets["w-themeOptions"]);
            console.log("!!toggleWidgetState - what is widgets[widgetId], ", widgets["w-themeOptions"]) //THIS IS THE DAMN DIV! FINALLY
            widgetSettingsBulk["w-themeOptions"].active = false;//🚧consider the widget as inactive.
            delete widgets["w-themeOptions"];
        }
    }) */

    
    Array.from(document.querySelectorAll(".themeSwitch")).forEach((theme)=>{
        
            

            const _th = theme.dataset.themename
            console.log("THEME DETECT? ", _th)
            theme.addEventListener("click", ()=>{console.log("At button click time, what is _th? ", _th)
            loadThemeSet(`../static/css/${_th}.css`, `../static/js/${_th}.js`, `../static/html/${_th}.html`, _th)})
        
    })

    thDevBtn.addEventListener("click", ()=>{
        thDevPicks.classList.toggle("display-toggle")
        thDevBtn.classList.toggle("nav-focused")
    })

    thThemeBtn.addEventListener("click", ()=>{
        thThemeSimple.classList.toggle("display-toggle")
        thThemeBtn.classList.toggle("nav-focused")
    })

    
    themeOptionsBtn.addEventListener("click", ()=>{
        themeOptions.classList.toggle("display-toggle")
        /* themeOptions.classList.toggle("expand-up") */
    })

})


const loadThemeSet = async function(_css, _js, _html, _themeName){
    console.log(`!!Props ID - CSS ${_css}, JS ${_js}, HTML ${_html}`)

    loadingScreen.style.opacity="1"
    loadingScreen.innerHTML=`
    <div id="loadingBarBlackBG">
        <div id="loadBars">
            <div class="loadOuter" style="left: 10%">
                <div class="loadInner"></div>
            </div>        
            <img src="../static/images/loading.gif" class="loading-circle">
            <img src="../static/images/logo_trans.webp" id="hogaLoadLogo">
            <div class="loadOuter" style="left: 60%">
                <div class="loadInner" style="left: 100%; transform-origin: left; transform: scaleX(-1);"></div>
            </div>           
        </div>
    </div>
    `
    loadBars = Array.from(document.querySelectorAll(".loadInner"))

    try{await thKillSwitch()} 
    catch {console.log("killswitch empty. First setup?")}

    const CSS = document.createElement("link") //load CSS
    CSS.rel = "stylesheet";
    CSS.type = "text/css";
    CSS.href = _css;
    document.head.appendChild(CSS);

    const HTML = document.createElement("div")
    HTML.id = "current-theme"; //⚠️TBA
    try { //attempt to fetch HTML. Cancel operation if fail
        const res = await fetch(_html)
        const htmlContent = await res.text()
        HTML.innerHTML = htmlContent
        parentGrid.insertBefore(HTML, parentGrid.firstChild); //insert as first child of grid-container
        try { //js file is technically optional. You can make a theme without script.           
            const script = document.createElement("script")
            script.src = (_js)
            script.type = "text/javascript"
            HTML.appendChild(script)
            /* script.onload = () => {parallaxStartUp({staticTitle:true, distCalc:1.5, rotaCalc:3}, paraStopButton, paraStartButton)} */
        }  catch (error) {
            console.log("Failed to load javascript file. Wrong path or file does not exist. ", error)
        }
    } catch (error) {
        console.log("Theme HTML failed to load. Early exit: ", error);
        document.body.removeChild(HTML);
        document.head.removeChild(CSS);
        if (script){document.body.removeChild(script)}
        return
    }


    


/*     const thKillSwitch = document.createElement("button") //killswitch to remove HTML/CSS/JS
    thKillSwitch.addEventListener("click", async ()=>{
        new Promise((resolve)=>{
            document.body.removeChild(script);
            document.head.removeChild(CSS)
            document.body.removeChild(HTML)
        resolve("Theme killed! ", HTML);
        })
    })//Dont forget to append your killswitch to something. */

    
    bgFXCont.innerHTML = "" //destroy the bg container's effects.

    

    thKillSwitch = async ()=>{
        new Promise((resolve)=>{
            try{
                document.body.removeChild(script);
            }catch{
                console.log("No script file found")
            }
            document.head.removeChild(CSS)
            parentGrid.removeChild(HTML)
        resolve("Theme scrap completed! ", HTML);
        })
    }//Dont forget to append your killswitch to something.

    widgetSettingsBulk.currentTheme = _themeName;
    
}

/* 
function imgLoadPromise(container) {
    return new Promise((resolve, reject) => {
      const images = container.querySelectorAll("img");
      let loadedCount = 0;
      const totalImages = images.length;
  
      if (totalImages === 0) {
        resolve();
      }
  
      images.forEach((img) => {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve(); 
          }
        };
  
        img.onerror = () => {
          reject(`Failed to load image: ${img.src}`); 
        };
      });
    });
  }
 */
function imgLoadPromise(container) {
return new Promise((resolve, reject) => {
    const images = Array.from(container.children);
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
    resolve(); 
    }

    images.forEach((img) => {
    img.onload = () => {
        loadedCount++;
        loadBars.forEach((bars)=>{
            bars.style.width = (loadedCount/totalImages*100)+"%"
        })
        if (loadedCount === totalImages) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
            resolve(); // Ensure rendering is completed
            });
        });
        }
    };

    img.onerror = () => {
        reject(`Failed to load image: ${img.src}`); // Handle image load error
    };
    });
});
}




//How to set up your dev theme:
/* 
Put your CSS, HTML and JS files in the respective folders WITHIN static. Example: /static/css/myTheme.css.

🚩ALL 3 FILES Should have the SAME NAME. Example: myTheme.css, myTheme.html, myTheme.js
That file name will be used by the initiator function 

In the index.html, located in Templates, go to the element called "nav-dev-picks" (or the element called "nav-content" if you are making a base theme/mood).
Look at the structure, and follow the practice to make your own theme button.
Example:

<div class="nav-button themeSwitch" data-themename="myTheme">
              <span>My Theme</span>
</div>

🚩Don't forget to set the class to nav-button, as well as themeSwitch (with a space), and the data-themename to the same name as your files (in this case, myTheme)

Once that is all done, no need to touch this HTML anymore.

Now in your HTML file, create the content as necessary. Same with CSS.

In your JS file, you need to do some addition to your usual script:

Create a function that contains all the logic behind your theme. 

🚩Make it an async function like so:

async function myThemeLoader(){ 
    FUNCTION CONTENT 
}

at the END of the function, add this bit of code:

🚧COPY PASTE BELOW
console.log("Content finished loading. deleting Loading Screen")
loadingScreen.style.opacity="0";
setTimeout(()=>{
    loadingScreen.innerHTML="";
}, 150)
🚧DO NOT COPY PASTE BELOW THIS LINE

🚩It does NOT matter if you do not have a script for your theme. You need this logic to make sure the loading screen executes as expected.
🚩Even if you don't need a JS file, please make one as instructed above, and you can make a random function name with the above bit of code. In fact you can just copy paste this into your empty JS:


🚧COPY PASTE BELOW
blablaDoesntMatter()

async function blablaDoesntMatter(){
    console.log("Content finished loading. deleting Loading Screen")
    loadingScreen.style.opacity="0";
    setTimeout(()=>{
        loadingScreen.innerHTML="";
    }, 150)
}
🚧DO NOT COPY PASTE BELOW THIS LINE

Once completed, let me know and I'll check!
*/