let menuButton = document.getElementById("pageSelectMenuButton");
let pageSelectMenuNav = document.querySelector("#pageSelectMenuNav");
let profileButton = document.getElementById("profileTabButton");
let leaderboardsButton = document.getElementById("leaderboardsTabButton");
let settingsButton = document.getElementById("settingsTabButton");
let profileTabContainer = document.getElementById("profileTabContainer");
let leaderboardsTabContainer = document.getElementById(
  "leaderboardsTabContainer"
);
let settingsTabContainer = document.getElementById("settingsTabContainer");
let dragLockCtrlBtn = document.getElementById("dragLockCtrl");

menuButton.addEventListener("click", toggleNav);

function toggleNav() {
  if (pageSelectMenuNav.style.display === "flex") {
    pageSelectMenuNav.style.display = "none";
    profileTabContainer.style.display = "none";
    settingsTabContainer.style.display = "none";
    leaderboardsTabContainer.style.display = "none";
    dragLockCtrlBtn.style.display = "none";
  } else {
    pageSelectMenuNav.style.display = "flex";
  }
}

profileButton.addEventListener("click", toggleProfile);

function toggleProfile() {
  if (profileTabContainer.style.display === "flex") {
    profileTabContainer.style.display = "none";
  } else {
    profileTabContainer.style.display = "flex";
    dragLockCtrlBtn.style.display = "flex";
    leaderboardsTabContainer.style.display = "none";
    settingsTabContainer.style.display = "none";
  }
}

leaderboardsButton.addEventListener("click", toggleLeaderboards);

function toggleLeaderboards() {
  if (leaderboardsTabContainer.style.display === "flex") {
    leaderboardsTabContainer.style.display = "none";
  } else {
    leaderboardsTabContainer.style.display = "flex";
    dragLockCtrlBtn.style.display = "flex";
    settingsTabContainer.style.display = "none";
    profileTabContainer.style.display = "none";
  }
}

settingsButton.addEventListener("click", toggleSettings);
function toggleSettings() {
  if (settingsTabContainer.style.display === "flex") {
    settingsTabContainer.style.display = "none";
  } else {
    settingsTabContainer.style.display = "flex";
    dragLockCtrlBtn.style.display = "flex";
    leaderboardsTabContainer.style.display = "none";
    profileTabContainer.style.display = "none";
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
// dragLockCtrl.dataset.mode = "activate";

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
