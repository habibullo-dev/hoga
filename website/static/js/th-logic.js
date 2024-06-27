window.thKillSwitch;

document.addEventListener("DOMContentLoaded", function () {

    const thDevBtn = document.getElementById("dev-pick-button")
    const thDevPicks = document.getElementById("nav-dev-picks")
    const themesBtnArr = Array.from(thDevPicks.children)

    themesBtnArr.forEach((theme)=>{
        if (theme.classList.contains('themeSwitch')){
            

            const _th = theme.dataset.themename
            console.log("THEME DETECT? ", _th)
            theme.addEventListener("click", ()=>{console.log("At button click time, what is _th? ", _th)
            loadThemeSet(`../static/css/${_th}.css`, `../static/js/${_th}.js`, `../templates/${_th}.html`)})
        }
    })


})

const loadThemeSet = async function(_css, _js, _html){

    console.log(`!!Props ID - CSS ${_css}, JS ${_js}, HTML ${_html}`)

    const parent = document.getElementById("grid-container")
    
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
        parent.insertBefore(HTML, parent.firstChild); //insert as first child of grid-container

    } catch (error) {
        console.log("Theme HTML failed to load. Early exit: ", error);
        document.body.removeChild(HTML);
        document.head.removeChild(CSS);
        if (script){document.body.removeChild(script)}
        return
    }

    try { //js file is technically optional. You can make a theme without script.
        const script = document.createElement("script")
        script.src = (_js)
        script.type = "text/javascript"
        HTML.appendChild(script)
    }  catch (error) {
        console.log("Failed to load javascript file. Wrong path or file does not exist. ", error)
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

    thKillSwitch = async ()=>{
        new Promise((resolve)=>{
            try{
                document.body.removeChild(script);
            }catch{
                console.log("No script file found")
            }
            document.head.removeChild(CSS)
            document.body.removeChild(HTML)
        resolve("Theme scrap completed! ", HTML);
        })
    }//Dont forget to append your killswitch to something.
    

}

