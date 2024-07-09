

//gFloat
console.log("DXM: gFloat activated. Have fun! Original work by Hyperplexed and Camille")

let mouseDownChk = false;
function gFloatHandleOnDown(e) {
    const _container = this;
    _container.dataset.mouseDownAt = e.clientX;
    mouseDownChk = true;
}

function gFloatHandleOnUp(e) {
    const _container = this;
    mouseDownChk = false;
    _container.dataset.mouseDownAt = "0";  
    _container.dataset.prevPercentage = _container.dataset.percentage;
}

function gFloatHandleOnMove(e) {
    if(!mouseDownChk) return;
    
    const _container = this;

    const mouseDelta = parseFloat(_container.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100;
    const nextPercentageUnconstrained = parseFloat(_container.dataset.prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -50);

    _container.dataset.percentage = nextPercentage;
    _container.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    for(const _img of _container.getElementsByClassName("sliderImg")) {
        _img.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
    }
}

function gFloatAssign(_container){
    _container.onmousedown = gFloatHandleOnDown;
    _container.onmousemove = gFloatHandleOnMove;
    _container.onmouseup = gFloatHandleOnUp;
    _container.draggable = false;
    _container.dataset.prevPercentage = 0;
}



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



//test, remove after:
//cooltipCraft(DOM Element, Text, Options)
cooltipCraft(clockStartBtn, "Click to start the pomodoro clock", {color: "grey", fontSize: "1.1rem", yBuffer:35, xBuffer:15})