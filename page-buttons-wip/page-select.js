let menuButton = document.querySelector(".menu");
let nav = document.querySelector("nav");
let navButton = document.querySelector(".navButton");
let profileButton = document.getElementById("profile");
let leaderboardsButton = document.getElementById("leaderboards");
let settingsButton = document.getElementById("settings");
let profileContainer = document.getElementById("dragContainer1");
let leaderboardsContainer = document.getElementById("dragContainer2");
let settingsContainer = document.getElementById("dragContainer3");
let dragLockCtrlBtn = document.getElementById("dragLockCtrl");

menuButton.addEventListener("click", toggleNav);

function toggleNav() {
  if (nav.style.display === "flex") {
    nav.style.display = "none";
    profileContainer.style.display = "none";
    settingsContainer.style.display = "none";
    leaderboardsContainer.style.display = "none";
    dragLockCtrlBtn.style.display = "none";
  } else {
    nav.style.display = "flex";
  }
}

profileButton.addEventListener("click", toggleProfile);

function toggleProfile() {
  if (profileContainer.style.display === "flex") {
    profileContainer.style.display = "none";
  } else {
    profileContainer.style.display = "flex";
    dragLockCtrlBtn.style.display = "flex";
    leaderboardsContainer.style.display = "none";
    settingsContainer.style.display = "none";
  }
}

leaderboardsButton.addEventListener("click", toggleLeaderboards);

function toggleLeaderboards() {
  if (leaderboardsContainer.style.display === "flex") {
    leaderboardsContainer.style.display = "none";
  } else {
    leaderboardsContainer.style.display = "flex";
    dragLockCtrlBtn.style.display = "flex";
    settingsContainer.style.display = "none";
    profileContainer.style.display = "none";
  }
}

settingsButton.addEventListener("click", toggleSettings);
function toggleSettings() {
  if (settingsContainer.style.display === "flex") {
    settingsContainer.style.display = "none";
  } else {
    settingsContainer.style.display = "flex";
    dragLockCtrlBtn.style.display = "flex";
    leaderboardsContainer.style.display = "none";
    profileContainer.style.display = "none";
  }
}

console.log(
  "DXM: dragLock function ready! call initDragLock() to enable it on .dragLockPoint elements. call cancelDragLock() to clear the event listeners."
);

let dragPointHold = false;
let dragLockObj = { x: "", y: "", mouseDown: false };

function initDragLock() {
  console.log("dragLock function initialized.");
  const _dragPoint = Array.from(
    document.getElementsByClassName("dragLockPoint")
  ); //Select the draggable point (child) of an element.
  console.log("_dragPoints created: ", _dragPoint);
  _dragPoint.forEach((child) => {
    child.style.display = "flex";
    _parent = child.parentElement;
    const topValue = window.getComputedStyle(_parent).getPropertyValue("top");
    const leftValue = window.getComputedStyle(_parent).getPropertyValue("left");
    _parent.style.position = "absolute";
    _parent.style.top = topValue;
    _parent.style.left = leftValue;

    function dragLockMoveHandler(event) {
      if (dragLockObj.mouseDown) {
        child.parentElement.style.left = event.clientX - dragLockObj.x + "px";
        child.parentElement.style.top = event.clientY - dragLockObj.y + "px";
      }
    }
    child.addEventListener("mousedown", (event) => {
      event.preventDefault();
      dragLockObj.mouseDown = true;
      dragLockObj.x = event.clientX - child.getBoundingClientRect().left;
      dragLockObj.y = event.clientY - child.getBoundingClientRect().top;

      document.addEventListener("mousemove", dragLockMoveHandler);
      document.addEventListener("mouseup", (event) => {
        dragLockObj.mouseDown = false;
        document.removeEventListener("mousemove", dragLockMoveHandler);
      });
    });
  });
}

function cancelDragLock() {
  console.log("dragLock function removed.");
  const _dragPoint = Array.from(
    document.getElementsByClassName("dragLockPoint")
  );
  _dragPoint.forEach((_elem) => {
    const _clone = _elem.cloneNode(true);
    _clone.style.display = "none";
    _elem.parentNode.replaceChild(_clone, _elem);
  });
}
/*
Instructions: 
1. Add an element with a class "dragLockPoint" as a child to the element you wish to make draggable. These are your dragging anchors.
2. Call initDragLock() function to make the dragging anchors functional. 
3. Press and hold right click over the dragging anchors, then move the element around.
4. Release hold to stop the dragging effect.
5. Call cancelDragLock() function to hide the dragging anchors.
You can use the preset button example below. Note that this is not the most readable way of doing this. 
*/

//Test area:
const dragLockCtrl = document.getElementById("dragLockCtrl");
dragLockCtrl.addEventListener("click", () => {
  if (dragLockCtrl.dataset.mode == "activate") {
    initDragLock();
    dragLockCtrl.dataset.mode = "cancel";
    dragLockCtrl.innerText = "Cancel dragLock";
  } else {
    cancelDragLock();
    dragLockCtrl.dataset.mode = "activate";
    dragLockCtrl.innerText = "Activate dragLock";
  }
});
