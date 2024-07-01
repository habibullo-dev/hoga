const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");

let customTaskLists = {
  taskListSetup: "",
  completedListSetup: "",
}; //object full of K/V pairs that would hold onto current and custom task tabs.

let taskOrderFetch; //Timed out and cancellable fetch order

if (completedList) {
  taskList.style.display = "block";
  completedList.style.display = "none";
}

const showCompletedButton = document.getElementById("showCompletedButton");
const showIncompleteButton = document.getElementById("showIncompleteButton");
showCompletedButton.style.backgroundColor = "lightgray"

function generateNewTask(_setup, _completed){
    const taskText = _setup?_setup:taskInput.value.trim(); //🚧 if _setup mode is on, fetch from existing text. else take from input value as usual.
  
    if (taskText !== "") {
      const li = document.createElement("li");
      li.classList.add("draggable");
      li.setAttribute("draggable", "true");

      if (_completed){ //🚧if task was from _completed, instantly move it back to completed list and remove the other buttons.  
        console.log("detected a COMPLETED item.", taskText)
        // create check-off button element
        const checkedOff = document.createElement("button");
        checkedOff.innerHTML = "&#10003;";
        checkedOff.classList.add("checked-off");
        li.appendChild(checkedOff);
        li.querySelector(".checked-off").style.color = "black";
        li.querySelector(".checked-off").style.backgroundColor = "transparent";
        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;
        li.appendChild(taskSpan);
        completedList.appendChild(li);
        li.dataset.ref = `${taskList.childElementCount}`;
        customTaskLists.completedListSetup = completedList.innerHTML;

      } else {

      // create check-off button element
      const checkedOff = document.createElement("button");
      checkedOff.innerHTML = "&#10003;";
      checkedOff.classList.add("checked-off");
      li.appendChild(checkedOff);

      // add text content as a span
      const taskSpan = document.createElement("span");
      taskSpan.textContent = taskText;
      li.appendChild(taskSpan);

      // create delete button element
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "&#9003;";
      deleteBtn.classList.add("delete-btn");
      li.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "&#9998;";
      editBtn.classList.add("edit-btn");
      li.appendChild(editBtn);

      // event listener to remove list item when delete button is clicked
      deleteBtn.addEventListener("click", function (e) {
        const taskItem = e.currentTarget.parentNode;
        taskItem.classList.add("pop");
        setTimeout(() => {
          taskItem.remove();
          saveTaskListSetup();
        }, 300); // Matches the CSS animation duration
      });

      // event listener to move task to completed list when checked off
      checkedOff.addEventListener("click", function (e) {
        const taskItem = e.currentTarget.parentNode;
        taskItem.querySelector(".checked-off").style.color = "black";
        taskItem.querySelector(".checked-off").style.backgroundColor = "transparent";
        taskItem.classList.add("hide");
        setTimeout(() => {
          taskItem.classList.remove("hide");
          completedList.appendChild(taskItem);
          customTaskLists.completedListSetup = completedList.innerHTML;
          deleteBtn.style.display = "none";
          editBtn.style.display = "none";
          saveTaskListSetup();
        }, 300);
      });

      editBtn.addEventListener("click", function (e) {
        const taskItem = e.currentTarget.parentNode;
        const taskText = taskItem.querySelector("span").textContent;
        taskItem.innerHTML = `<input type="text" value="${taskText}" /><button class="edit-confirm-btn">&#10003;</button><button class="edit-cancel-btn">&#10007;</button>`;

        const editInput = taskItem.querySelector("input");
        const confirmBtn = taskItem.querySelector(".edit-confirm-btn");
        const cancelBtn = taskItem.querySelector(".edit-cancel-btn");

        confirmBtn.addEventListener("click", function () {
          const newText = editInput.value.trim();
          if (newText) {
            taskItem.innerHTML = "";
            taskItem.classList.remove("editing");
            taskItem.appendChild(checkedOff);
            taskSpan.textContent = newText;
            taskItem.appendChild(taskSpan);
            taskItem.appendChild(deleteBtn);
            taskItem.appendChild(editBtn);
            saveTaskListSetup();
          }
        });

        cancelBtn.addEventListener("click", function () {
          taskItem.innerHTML = "";
          taskItem.classList.remove("editing");
          taskItem.appendChild(checkedOff);
          taskSpan.textContent = taskText;
          taskItem.appendChild(taskSpan);
          taskItem.appendChild(deleteBtn);
          taskItem.appendChild(editBtn);
        });

        taskItem.classList.add("editing");
      });

      //send data for fetch:
      //⚠️Important: later as we add more "features" to this widget, this format needs to be changed by adding more of the individual task customizations.
      li.dataset.ref = `${taskList.childElementCount}`;
      taskList.appendChild(li);
      customTaskLists.taskListSetup = taskList.innerHTML;
      taskInput.value = "";
      saveTaskListSetup();
      }
    }

    draggables = document.querySelectorAll(".draggable"); //re-selects all draggable elements
    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        //fired when user starts dragging an element.
        draggable.classList.add("dragging"); //adds a class to indicated the element is being dragged
      });

      draggable.addEventListener("dragend", () => {
        //fired when user stops dragging the element.
        draggable.classList.remove("dragging"); //removes the dragging class
      });
    });
}

// event listener for adding new list item with enter key
taskInput.addEventListener("keypress", function (e) {
  console.log("!!TASK CREATED?????")
  if (e.key === "Enter") {
    generateNewTask() //🚧stored all of it into function declaration instead, for reusability purpose.
  }
});

showCompletedButton.addEventListener("click", function () {
  if (completedList) {
    taskInput.style.display = "none";
    taskList.style.display = "none";
    completedList.style.display = "block";
    showCompletedButton.style.backgroundColor = "";
    showIncompleteButton.style.backgroundColor = "lightgray";
  }
});

showIncompleteButton.addEventListener("click", function (e) {
  if (completedList) {
    taskList.style.display = "block";
    taskInput.style.display = "block";
    completedList.style.display = "none";
    showCompletedButton.style.backgroundColor = "lightgray";
    showIncompleteButton.style.backgroundColor = "";
  }
});

//onLaunch setup
let draggables = document.querySelectorAll(".draggable"); //draggable elements
const dragContainers = document.querySelectorAll(".dragContainer"); //containers that can handle the draggables

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    //fired when user starts dragging an element.
    draggable.classList.add("dragging"); //adds a class to indicated the element is being dragged
  });

  draggable.addEventListener("dragend", () => {
    //fired when user stops dragging the element.
    draggable.classList.remove("dragging"); //removes the dragging class
  });
});

dragContainers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    //The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging"); //name the item currently being dragged
    if (afterElement == null) {
      container.appendChild(draggable); //slap after last element
    } else {
      container.insertBefore(draggable, afterElement); 
    }

    clearTimeout(taskOrderFetch);
    taskOrderFetch = setTimeout(() => {
      extractTaskData();
      console.log("fetch complete.");
    }, 5000);
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];
  //^ selects all moveable elements except the one currently being dragged.
  return draggableElements.reduce(
    (closest, child) => {
      //closest is acc, child is current value.
      const box = child.getBoundingClientRect(); //Retrieves the bounding rectangle of the current child element. Stuff like top, bottom, left, right, width, and height.
      const offset = y - box.top - box.height / 2;
      //y = current cursor pos, box.top = current val top value, box.height current val "length"/height by 2 to find its y axis middle.
      if (offset < 0 && offset > closest.offset) {
        //after all this calc, if offset is "higher" in y than closest, return below obj
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element; //initial value of the acc. it will be -infinity to guarantee all other elements are considered as closer and thus, influencable by the reduce.
}

// Function to extract task data
function extractTaskData() {
  const taskItems = document.querySelectorAll("#taskList li");
  const completedItems = document.querySelectorAll("#completedList li");

  const tasks = [];
  const completedTasks = [];

  // Extract tasks from taskList
  taskItems.forEach((taskItem, i) => {
    taskItem.dataset.ref = i
    const taskText = taskItem.querySelector("span").textContent;
    console.log("!! taskItem is at number", i, "for item: ", taskItems[i])
    tasks.push({
      text: taskText,
      order: i,
      completed: false,
    });
  });
  console.log("TASKS", tasks)

  // Extract tasks from completedList
  completedItems.forEach((completedItem, i) => {
    completedItem.dataset.ref = i
    const taskText = completedItem.querySelector("span").textContent;
    console.log("!! completedItem is at number", i, "for item: ", completedItems[i])
    completedTasks.push({
      text: taskText,
      order: i,
      completed: true,
    });
  });
  console.log("COMPLETED TASKS", completedTasks)

  return {
    incompleteTasks: tasks,
    completedTasks: completedTasks,
  };
}

// Function to save task list setup
function saveTaskListSetup() {
  console.log("!!SAVETASKLISTSETUP CALLED!!!! FETCHING!!")
  const { incompleteTasks, completedTasks } = extractTaskData();

  fetch("/taskDataGrab", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "tasks": incompleteTasks,
      "completedTasks": completedTasks,
      "email": user.email
    })
  })
    .then(res => res.json())
    .then(res => console.log("SAVETASKLISTSETUP", res));
  console.log("TASKDATAGRAB FETCH", incompleteTasks, completedTasks)
}
`[[{text: "do groceries", order: 1, completed: false}],[{text: "eat lunch", order: 1, completed: true}]]`

let tasklistAutoSave = setInterval(saveTaskListSetup, 5000) //AUTOSAVES THE LIST SETUP EVERY 5 SECONDS!

async function restoreTasks() {
  console.log("!!attempting to RESTORE tasklist content!")
  
  const res = widgetSettingsBulk["w-tasks"]["taskList"]
  console.log("!!Restoring tasklist content! what is in the res?", res)
  console.log("!!res['incompleteTasks']", res["incompleteTasks"])
  console.log("!!res['incompleteTasks'][0]", res["incompleteTasks"][0])

  res["incompleteTasks"].forEach((task)=>{
    generateNewTask(task.text)
  })
  res["completedTasks"].forEach((task)=>{
    generateNewTask(task.text, true)
  })

/*   fetch("/taskDataPull", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "email": user.email
    })
  }).then(res=> res.json())
  .then(res=>{
    if (!res.error){
      res[0].forEach((task)=>{
        generateNewTask(task.text)
      })
      res[1].forEach((task)=>{
        generateNewTask(task.text, true)
      })
    }
  }) */
  
}

restoreTasks()