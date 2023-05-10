function placeRover(gridContainer) {
  const rover = document.createElement('i');
  rover.classList.add('fa-regular', 'fa-square-caret-up', 'rover')

  function checkGridReady() {
    const startPosition = gridContainer.querySelector('.jt-row:last-child .jt-cell:first-child');
    if (startPosition) {
      startPosition.appendChild(rover);
    } else {
      setTimeout(checkGridReady, 100);
    }
  }
  checkGridReady();
};


function moveRover(direction) {
  const rover = document.querySelector('.rover');
  if (!rover) {
    return;
  }

  const currentPosition = rover.parentElement;
  const nextPosition = getNextPosition(currentPosition, direction);

  if (nextPosition) {
    currentPosition.removeChild(rover);
    nextPosition.appendChild(rover);
  }
}

function getNextPosition(currentPosition, direction) {
  const row = currentPosition.parentElement;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const colIndex = Array.from(row.children).indexOf(currentPosition);

  let nextRowIndex = rowIndex;
  let nextColIndex = colIndex;

  if (direction === 'F') {
    nextRowIndex--;
  } else if (direction === 'B') {
    nextRowIndex++;
  }

  const nextRow = row.parentElement.children[nextRowIndex];
  if (nextRow) {
    return nextRow.children[nextColIndex];
  }

  return null;
}

document.addEventListener("keydown", function(event) {
  event.preventDefault();
  const key = event.key.toUpperCase();
  if (key === 'F' || key === 'B') {
    moveRover(key);
  }
});



