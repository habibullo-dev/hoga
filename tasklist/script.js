const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const completedList = document.getElementById('completedList');
if (completedList) {
    taskList.style.display = 'block';
    completedList.style.display = 'none';
}

const showCompletedButton = document.getElementById('showCompletedButton');
const showIncompleteButton = document.getElementById('showIncompleteButton');

// event listener for adding new list item with enter key
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const taskText = taskInput.value.trim();

        // create list element
        if (taskText !== '') {
            const li = document.createElement('li');
            li.classList.add("draggable")
            li.setAttribute('draggable', 'true');

            // create check-off button element
            const checkedOff = document.createElement('button');
            checkedOff.innerHTML = '<i class="fa-solid fa-square-check"></i>';
            checkedOff.classList.add('checked-off');
            li.appendChild(checkedOff);

            // add text content as a span
            const taskSpan = document.createElement('span');
            taskSpan.textContent = taskText;
            li.appendChild(taskSpan);

            // create delete button element
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.classList.add('delete-btn');
            li.appendChild(deleteBtn);

            // event listener to remove list item when delete button is clicked
            deleteBtn.addEventListener('click', function(e) {
                e.currentTarget.parentNode.remove();
            });

            // event listener to move task to completed list when checked off
            checkedOff.addEventListener('click', function(e) {
                const taskItem = e.currentTarget.parentNode;
                taskItem.querySelector('.checked-off').remove();
                
                completedList.appendChild(taskItem);
            })

            taskList.appendChild(li);
            taskInput.value = '';
        }

        draggables = document.querySelectorAll('.draggable') //re-selects all draggable elements
        draggables.forEach(draggable => { 
          draggable.addEventListener('dragstart', () => { //fired when user starts dragging an element.
            draggable.classList.add('dragging') //adds a class to indicated the element is being dragged
          })
        
          draggable.addEventListener('dragend', () => { //fired when user stops dragging the element.
            draggable.classList.remove('dragging') //removes the dragging class
          })
        })
    } 
});

showCompletedButton.addEventListener('click', function() {
    if (completedList) {
        taskList.style.display = 'none';
        completedList.style.display = 'block';
    }
});

showIncompleteButton.addEventListener('click', function(e) {
    if (completedList) {
        taskList.style.display = 'block';
        completedList.style.display = 'none';
    }
});

//onLaunch setup
let draggables = document.querySelectorAll('.draggable') //draggable elements
const dragContainers = document.querySelectorAll('.dragContainer') //containers that can handle the draggables

draggables.forEach(draggable => { 
  draggable.addEventListener('dragstart', () => { //fired when user starts dragging an element.
    draggable.classList.add('dragging') //adds a class to indicated the element is being dragged
  })

  draggable.addEventListener('dragend', () => { //fired when user stops dragging the element.
    draggable.classList.remove('dragging') //removes the dragging class
  })
})

dragContainers.forEach(container => { 
  container.addEventListener('dragover', e => { //The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientY) 
    const draggable = document.querySelector('.dragging') //name the item currently being dragged
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {  
      container.insertBefore(draggable, afterElement)
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')] 
  //^ selects all moveable elements except the one currently being dragged.
  return draggableElements.reduce((closest, child) => { //closest is acc, child is current value.
    const box = child.getBoundingClientRect() //Retrieves the bounding rectangle of the current child element. Stuff like top, bottom, left, right, width, and height.
    const offset = y - box.top - box.height / 2
    //y = current cursor pos, box.top = current val top value, box.height current val "length"/height by 2 to find its y axis middle.
    if (offset < 0 && offset > closest.offset) { //after all this calc, if offset is "higher" in y than closest, return below obj
      return { offset: offset, element: child }
    } else { 
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element //initial value of the acc. it will be -infinity to guarantee all other elements are considered as closer and thus, influencable by the reduce.
}