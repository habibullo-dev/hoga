//DOM for testing



console.log("DXM: multiParallax package loaded! Original system by True Coder. Modified by DXM")
console.log("Find the original tutorial here: https://www.youtube.com/watch?v=Yo3j_Dx4u7c&t=38s&ab_channel=TrueCoder")
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

//coolTip
console.log("DXM: coolTip activated!")

//cooltipCraft(button1, "Hello, World!", {color: "grey", fontSize: "1.5rem"})
function cooltipCraft(_target, _cooltipText, _obj){
    let cooltipShell = document.createElement("div")
    cooltipShell.className = 'cooltipShell'
    cooltipShell.style.opacity = '0'
    cooltipShell.style.pointerEvents = 'none'
    
    let cooltipCont = document.createElement("div")
    cooltipCont.innerHTML = `${_cooltipText}`
    cooltipCont.className = 'cooltipCont'
    cooltipShell.appendChild(cooltipCont)

    //additional styling:
    cooltipCont.style.color = _obj.fontColor?_obj.fontColor:'white'
    cooltipCont.style.fontSize = _obj.fontSize?_obj.fontSize:'1.15rem'
    cooltipCont.style.fontStyle = _obj.fontStyle?_obj.fontStyle:''
    cooltipCont.style.backgroundColor = _obj.contColor?_obj.contColor:'rgba(50,50,50,0.5)'
    //cooltipCont.style.filter = "drop-shadow(" + _obj.shadow?_obj.shadow:'0 0 0.5rem rgba(40,40,40,0.3)' + ")"
    cooltipShell.style.transition = _obj.transit?_obj.transit:'opacity 0.4s ease-in-out'

    document.querySelector("body").appendChild(cooltipShell)


    _target.addEventListener("mousemove", (e)=>{
        cooltipShell.style.opacity = '1'
        cooltipShell.style.top = e.clientY + (e.clientY > window.innerHeight ? _obj.yBuffer : -_obj.yBuffer) + 'px'
        cooltipShell.style.left = (e.clientX + _obj.xBuffer) + 'px'
    })

    _target.addEventListener("mouseout", ()=>{
        cooltipShell.style.opacity = '0'

    })
}

//example:
//cooltipCraft(DOM Element, Text, Options)
//cooltipCraft(clockStartBtn, "Click to start the pomodoro clock", {color: "grey", fontSize: "1.1rem", yBuffer:35, xBuffer:15})


//dragLock

console.log("DXM: dragLock function ready! call initDragLock() to enable it on .dragLockPoint elements. call cancelDragLock() to clear the event listeners.")

let dragPointHold = false;
let dragLockObj = {x:"", y:"", mouseDown:false}


function initDragLock(_keepPosition){
    console.log("dragLock function initialized.")
    const _dragPoint = Array.from(document.getElementsByClassName("dragLockPoint")) //Select the draggable point (child) of an element.
    console.log("_dragPoint, ", _dragPoint)
    _dragPoint.forEach((child)=>{
        child.style.display="flex"
        if (!_keepPosition){
            _parent=child.parentElement
            const topValue = window.getComputedStyle(_parent).getPropertyValue('top');
            const leftValue = window.getComputedStyle(_parent).getPropertyValue('left');
            _parent.style.position = "absolute"
            _parent.style.top = topValue;
            _parent.style.left = leftValue;
        }

        function dragLockMoveHandler(event){
            if (dragLockObj.mouseDown) {
                child.parentElement.style.left = event.clientX - dragLockObj.x + 'px';
                child.parentElement.style.top = event.clientY - dragLockObj.y + 'px';
            }
        }
        child.addEventListener("mousedown", (event)=>{
            event.preventDefault()
            dragLockObj.mouseDown = true
            dragLockObj.x = event.clientX - child.getBoundingClientRect().left;
            dragLockObj.y = event.clientY - child.getBoundingClientRect().top;

            document.addEventListener('mousemove', dragLockMoveHandler);      
            document.addEventListener("mouseup", (event)=>{
                dragLockObj.mouseDown = false
                document.removeEventListener('mousemove', dragLockMoveHandler);
            })
        })
    })
}

function cancelDragLock(){
    console.log("dragLock function removed.")
    const _dragPoint = Array.from(document.getElementsByClassName("dragLockPoint")) 
    _dragPoint.forEach((_elem)=>{
        const _clone = _elem.cloneNode(true);
        _clone.style.display="none"
        _elem.parentNode.replaceChild(_clone, _elem);
    })
}


//test area:
