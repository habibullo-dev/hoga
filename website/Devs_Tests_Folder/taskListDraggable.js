const draggables = document.querySelectorAll('.draggable') //draggable elements
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

