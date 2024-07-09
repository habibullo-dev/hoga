//DOM for testing



console.log("multiParallax package loaded! Original system by True Coder. Modified by DXM")
//fixed DOMS
let paraStopButton = document.querySelector("#paraStop");
let paraStartButton = document.querySelector("#paraStart");


let parallaxNodes = document.querySelectorAll(".parallaxElem")
let parallaxImgs = document.querySelectorAll(".parallaxElem:not(.parallaxTitle)")
let parallaxConts = document.querySelectorAll(".parallaxCont")

function parallaxAssign(_stopButton, _runButton, _dCalc, _rotaCalc){


    let mouseXPos = 0;
    let mouseYPos = 0;
    let rotateDegree = 0;
    let rotaCompute = 1 * _rotaCalc?_rotaCalc:1;

    function mouseTrackPara(e){
        mouseXPos = e.clientX - window.innerWidth/2;
        mouseYPos = e.clientY - window.innerHeight/2;
        
        rotateDegree = mouseXPos / (window.innerWidth / 2)
    
        parallaxNodes.forEach((elem) => {
                let dynaX = elem.dataset.dynax;
                let dynaY = elem.dataset.dynay;
                let dynaZ = elem.dataset.dynaz;
            if (_dCalc && elem.dataset.dynadistance){ //Let the distance calculator algorithm handle how much an element should move
                dynaX = 1/elem.dataset.dynadistance*_dCalc;
                dynaY = 1/elem.dataset.dynadistance*_dCalc;
                dynaZ = 1/elem.dataset.dynadistance*_dCalc;
            }
                
            let zPos = e.clientX - parseFloat(getComputedStyle(elem).left);
            let westEast = parseFloat(getComputedStyle(elem).left) < window.innerWidth /2 ? 1 : -1
    
            elem.style.transform = `translateX(calc(-50% + ${-mouseXPos * dynaX}px)) translateY(calc(-50% + ${-mouseYPos * dynaY}px)) rotateY(${rotateDegree*rotaCompute}deg) perspective(1000px) translateZ(${-zPos * westEast * dynaZ}px)` 
        })
    }

    function addMouseTrack(){
        document.addEventListener("mousemove", mouseTrackPara) //assign mouse movement tracking for parallaxing
    }
    
    function stopMouseTrack(){
        document.removeEventListener("mousemove", mouseTrackPara) //removes the movement tracking
    }

    addMouseTrack() //automatically set up the tracking at top function start.

    try {
        _stopButton.addEventListener("click", stopMouseTrack)
    } catch (TypeError) {
        console.log(`ERROR ${TypeError} - stopButton not defined! ${_stopButton}`)
    }

    try {
        _runButton.addEventListener("click", addMouseTrack)
    } catch (TypeError) {
        console.log(`ERROR ${TypeError} - runButton not defined! ${_runButton}`)
    }
}





function parallaxStartUp(_setup, _stopButton, _runButton){ //additional function you can run at start to create a "pop-in/pop-out" effect for the elements
    console.log("Starting up parallax setup")
    let _paraAnimArr = []
    let _parallaxElems
    let _distCalc = _setup.distCalc?_setup.distCalc:false
    let _rotaCalc = _setup.rotaCalc?_setup.rotaCalc:false

    paraStopButton = document.querySelector("#paraStop");
    paraStartButton = document.querySelector("#paraStart");

    parallaxNodes = document.querySelectorAll(".parallaxElem")
    parallaxImgs = document.querySelectorAll(".parallaxElem:not(.parallaxTitle)")
    parallaxConts = document.querySelectorAll(".parallaxCont")

    if (_setup.staticTitle){
        _parallaxElems = parallaxImgs //affect only the image
    } else {
        _parallaxElems = parallaxNodes //affect everything, title/logos included
    }

    _parallaxElems.forEach((elem) =>{
        if (_setup.flyDown){
            ms = _setup.flyDown
            return new Promise((resolve) => {
                elem.style.transform = `translateY(50%) translateX(-50%)`
                parallaxConts.forEach((elem)=>{
                    Array.from(elem.children).forEach((child)=>{
                        child.style.animationPlayState = "paused"
                    })
                })
                const _paraAnim = elem.animate([
                    { transform: 'translateY(-50% ) translateX(-50%)' }
                ], {
                    duration: ms,
                    direction: 'alternate',
                    fill: 'forwards',
                    easing: 'ease-in-out'
                })
                _paraAnimArr.push(_paraAnim)
                setTimeout(() => {
                    resolve();
                }, ms+300);
              })
              .then(()=>{
                _paraAnimArr.forEach((elem)=>{
                    elem.cancel()
                    console.log("!!Cancelled _paraAnim?", ElementInternals)})
                    
                parallaxAssign(_stopButton, _runButton, _distCalc, _rotaCalc)
                elem.style.transform = `translateY(-50%) translateX(-50%)`
                
                parallaxConts.forEach((elem)=>{
                    Array.from(elem.children).forEach((child)=>{
                        child.style.animationPlayState = "running"
                    })
                })
              })
        } else {
            parallaxAssign(_stopButton, _runButton, _distCalc, _rotaCalc)
        }
    })
}

//🚩Example running: parallaxStartUp({staticTitle:false, flyDown:3000, distCalc:1, rotaCalc:5}, paraStopButton, paraStartButton)

/*🚩Example of HTML setup:
<main class="parallaxCont"> 
    [<img src="gallery/FX/fujiSky.png" class="parallaxBG">
    <img src="gallery/FX/fujiDusk.png" class="parallaxElem parallaxOverflow" alt="fujiDusk" id="fujiDusk" data-dynaX="0.025" data-dynaY="0.09" data-dynaZ="0.01" data-dynaDistance="150">
    <p id="titleJP" class="parallaxElem parallaxTitle fontKanitMain" data-dynaX="0.025" data-dynaY="0.12" data-dynaZ="0.11" data-dynaDistance="250">Japan</p>]
<main>
*/
