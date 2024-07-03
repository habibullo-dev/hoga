
// Primary Vars 
window.user = {
    "loggedIn": false,
    "email": "empty.com",
    "name": "",
};
window.dbSettingsBulk = {};
window.widgetSettingsBulk = {};
const popupImportant = document.getElementById("popup-important")
const popupImpWindow = document.getElementById("popup-imp-window")
const popupImpText = document.getElementById("popup-imp-text")
const popupImpBtn1 = document.getElementById("popup-button1")
const popupImpBtn2 = document.getElementById("popup-button2")

function createUrgentPopUp(_innerText, _btn1, _btn2, _btn1Text, _btn2Text) {
    popupImportant.style.display = "flex";
    popupImpWindow.style.display = "flex";
    popupImpText.innerText = _innerText
    popupImpBtn1.addEventListener("click", _btn1)
    popupImpBtn2.addEventListener("click", _btn2)
    popupImpBtn1.innerText = _btn1Text
    popupImpBtn2.innerText = _btn2Text
    popupImpBtn1.addEventListener("click", () => { closeUrgentPopUp(popupImpBtn1, _btn1) })
    popupImpBtn2.addEventListener("click", () => { closeUrgentPopUp(popupImpBtn2, _btn2) })
}

function closeUrgentPopUp(_btn, _btnFunc) {
    popupImportant.style.display = "none";
    popupImpText.innerHTML = ""
    _btn.removeEventListener("click", _btnFunc)
}

