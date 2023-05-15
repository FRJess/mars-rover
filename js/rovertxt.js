let currentDirection = 'N';

function placeRover(gridContainer) {
  const rover = document.createElement('i');
  rover.classList.add('fa-regular', 'fa-square-caret-up', 'rover');

  function checkGridReady() {
    const startPosition = gridContainer.querySelector('.jt-row:last-child .jt-cell:first-child');
    if (startPosition) {
      startPosition.appendChild(rover);
      executeCommands();
    } else {
      setTimeout(checkGridReady, 100);
    }
  }

  checkGridReady();
}

function executeCommandSequence(commands) {
  const delay = 2000; // Delay between commands in milliseconds

  commands.forEach((command, index) => {
    setTimeout(() => {
      console.log('Command executed:', command);
      executeCommand(command);
    }, index * delay);
  });
}

function executeCommands() {
  const filePath = "input.txt"; // Aggiungere caricamento file
  const lineDelay = 3000; // Delay tra righe comandi

  fetch(filePath)
    .then(response => response.text())
    .then(fileContent => {
      const lines = fileContent.split("\n");
      let commandSection = false;

      lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine === "Commands") {
          commandSection = true;
          return;
        }

        if (commandSection) {
          const commands = mapCommands(trimmedLine);
          setTimeout(() => {
            executeCommandSequence(commands);
          }, index * lineDelay);
        }
      });
    })
    .catch(error => console.log("Error loading file:", error));
}

function mapCommands(commandString) {
  const commandMap = {
    'F': 'F',
    'B': 'B',
    'L': 'L',
    'R': 'R'
  };

  return commandString.split('').map(command => commandMap[command]).filter(Boolean);
}

function executeCommand(command) {
  switch (command) {
    case 'F':
    case 'B':
      moveRover(command);
      break;
    case 'L':
    case 'R':
      rotateRover(command);
      break;
  }
}


function moveRover(direction) {
  console.log('Moving rover:', direction);
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
  console.log('Rotating rover:', rotation);
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
  console.log('Getting next position:', direction);
  const row = currentPosition.parentElement;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const colIndex = Array.from(row.children).indexOf(currentPosition);
  const gridRows = Array.from(row.parentElement.children);
  const gridCols = Array.from(row.children);

  let nextRowIndex = rowIndex;
  let nextColIndex = colIndex;

  if (direction === 'F') {
    if (currentDirection === 'N') {
      nextRowIndex--;
      if (nextRowIndex < 0) {
        nextRowIndex = gridRows.length - 1;
      }
    } else if (currentDirection === 'E') {
      nextColIndex++;
      if (nextColIndex >= gridCols.length) {
        nextColIndex = 0;
      }
    } else if (currentDirection === 'S') {
      nextRowIndex++;
      if (nextRowIndex >= gridRows.length) {
        nextRowIndex = 0;
      }
    } else if (currentDirection === 'W') {
      nextColIndex--;
      if (nextColIndex < 0) {
        nextColIndex = gridCols.length - 1;
      }
    }
  } else if (direction === 'B') {
    if (currentDirection === 'N') {
      nextRowIndex++;
      if (nextRowIndex >= gridRows.length) {
        nextRowIndex = 0;
      }
    } else if (currentDirection === 'E') {
      nextColIndex--;
      if (nextColIndex < 0) {
        nextColIndex = gridCols.length - 1;
      }
    } else if (currentDirection === 'S') {
      nextRowIndex--;
      if (nextRowIndex < 0) {
        nextRowIndex = gridRows.length - 1;
      }
    } else if (currentDirection === 'W') {
      nextColIndex++;
      if (nextColIndex >= gridCols.length) {
        nextColIndex = 0;
      }
    }
  }

  const nextRow = gridRows[nextRowIndex];
  if (nextRow) {
    const nextCell = nextRow.children[nextColIndex];
    if (!nextCell.classList.contains('obstacle')) {
      return nextCell;
    }
  }

  return null;
}
