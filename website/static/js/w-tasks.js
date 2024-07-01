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

// event listener for adding new list item with enter key
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const taskText = taskInput.value.trim();

    // create list element
    if (taskText !== "") {
      const li = document.createElement("li");
      li.classList.add("draggable");
      li.setAttribute("draggable", "true");

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
        }, 300); // Matches the CSS animation duration
      });

      // event listener to move task to completed list when checked off
      checkedOff.addEventListener("click", function (e) {
        const taskItem = e.currentTarget.parentNode;
        taskItem.querySelector(".checked-off").style.color = "black";
        taskItem.querySelector(".checked-off").style.backgroundColor =
          "transparent";
        taskItem.classList.add("hide");
        setTimeout(() => {
          taskItem.classList.remove("hide");
          completedList.appendChild(taskItem);
          customTaskLists.completedListSetup = completedList.innerHTML;
          deleteBtn.style.display = "none";
          editBtn.style.display = "none";
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
      li.dataset.ref = `${taskList.childElementCount + 1}`;
      taskList.appendChild(li);
      customTaskLists.taskListSetup = taskList.innerHTML;
      taskInput.value = "";
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
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }

    clearTimeout(taskOrderFetch);
    taskOrderFetch = setTimeout(() => {
      saveTaskListSetup();
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
  taskItems.forEach((taskItem) => {
    const taskText = taskItem.querySelector("span").textContent;
    tasks.push({
      text: taskText,
      completed: false,
    });
  });
  console.log("TASKS", tasks)

  // Extract tasks from completedList
  completedItems.forEach((completedItem) => {
    const taskText = completedItem.querySelector("span").textContent;
    completedTasks.push({
      text: taskText,
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
