let currentDirection = 'N';

function placeRover(gridContainer) {
  const rover = document.createElement('i');
  rover.classList.add('fa-regular', 'fa-square-caret-up', 'rover');

  function checkGridReady() {
    const startPosition = gridContainer.querySelector('.jt-row:last-child .jt-cell:first-child');
    if (startPosition) {
      startPosition.appendChild(rover);
    } else {
      setTimeout(checkGridReady, 100);
    }
  }

  checkGridReady();
}

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

function rotateRover(rotation) {
  const rover = document.querySelector('.rover');
  if (!rover) {
    return;
  }

  const directions = ['N', 'E', 'S', 'W'];
  const currentIndex = directions.indexOf(currentDirection);
  let newIndex;

  if (rotation === 'L') {
    newIndex = (currentIndex - 1 + directions.length) % directions.length;
  } else if (rotation === 'R') {
    newIndex = (currentIndex + 1) % directions.length;
  }

  currentDirection = directions[newIndex];
  const iconClass = getIconClassForDirection(currentDirection);
  rover.className = `fa-regular ${iconClass} rover`;
}

function getIconClassForDirection(direction) {
  const directionMap = {
    'N': 'fa-square-caret-up',
    'E': 'fa-square-caret-right',
    'S': 'fa-square-caret-down',
    'W': 'fa-square-caret-left'
  };

  return directionMap[direction];
}

function getNextPosition(currentPosition, direction) {
  const row = currentPosition.parentElement;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const colIndex = Array.from(row.children).indexOf(currentPosition);

  let nextRowIndex = rowIndex;
  let nextColIndex = colIndex;

  if (direction === 'ARROWUP' || direction === 'F') {
    if (currentDirection === 'N') {
      nextRowIndex--;
    } else if (currentDirection === 'E') {
      nextColIndex++;
    } else if (currentDirection === 'S') {
      nextRowIndex++;
    } else if (currentDirection === 'W') {
      nextColIndex--;
    }
  } else if (direction === 'ARROWDOWN' || direction === 'B') {
    if (currentDirection === 'N') {
      nextRowIndex++;
    } else if (currentDirection === 'E') {
      nextColIndex--;
    } else if (currentDirection === 'S') {
      nextRowIndex--;
    } else if (currentDirection === 'W') {
      nextColIndex++;
    }
  }

  const nextRow = row.parentElement.children[nextRowIndex];
  if (nextRow) {
    const nextCell = nextRow.children[nextColIndex];
    if (!nextCell.classList.contains('obstacle')) {
      return nextCell;
    }
  }

  return null;
}
document.addEventListener("keydown", function(event) {
  event.preventDefault();
  const key = event.key.toUpperCase();

  if (key === 'ARROWUP' || key === 'F') {
    moveRover(key);
  } else if (key === 'ARROWDOWN' || key === 'B') {
    moveRover(key);
  } else if (key === 'L') {
    rotateRover('L');
  } else if (key === 'R') {
    rotateRover('R');
  }
});
