let currentDirection = 'N';
let currentPosition;
let positionList = [];
let commandStrings = [];
let finalPositions = [];

function placeRover(gridContainer) {
  const rover = document.createElement('i');
  rover.classList.add('fa-regular', 'fa-square-caret-up', 'rover');

  function checkGridReady() {
    const startPosition = gridContainer.querySelector('.jt-row:last-child .jt-cell:first-child');
    if (startPosition) {
      startPosition.appendChild(rover);

      // Inizializza la posizione corrente e aggiungila alla positionList
      currentPosition = startPosition;
      const positionString = getPositionString(currentPosition);
      positionList.push(positionString);

      // Aggiorna l'output della posizione
      updatePositionOutput();

      executeCommands();
    } else {
      setTimeout(checkGridReady, 100);
    }
  }

  checkGridReady();
}

function executeCommandSequence(commands, currentPosition) {
  return new Promise(resolve => {
    let currentIndex = 0;
    const executeNextCommand = () => {
      if (currentIndex < commands.length) {
        const command = commands[currentIndex];
        console.log('Command executed:', command);
        executeCommand(command, currentIndex === commands.length - 1);
        currentIndex++;
        setTimeout(executeNextCommand, 2000);
      } else {
        resolve();
      }
    };
    executeNextCommand();
  });
}

async function executeCommands() {
  const filePath = "input.txt"; // Aggiungi il percorso del file
  const lineDelay = 3000;

  try {
    const response = await fetch(filePath);
    const fileContent = await response.text();
    const lines = fileContent.split("\n");
    let commandSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "Commands") {
        commandSection = true;
        continue;
      }

      if (commandSection) {
        const commands = mapCommands(line);
        commandStrings.push(line);
        // Aggiungi un ritardo prima dell'esecuzione della sequenza di comandi
        await delay(lineDelay);

        await executeCommandSequence(commands, currentPosition);

        finalPositions.push(getPositionString(currentPosition));

        updatePositionOutput();
      }
    }
  } catch (error) {
    console.log("Error loading file:", error);
  }
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

function executeCommand(command, isLastCommand) {
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
  if (isLastCommand) {
    updatePositionOutput();
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

    const positionString = nextPosition ? getPositionString(nextPosition) : null;
    // const positionString = getPositionString(nextPosition);

    if (positionString) {
      positionList.push(positionString);
    }
  }
}

function getPositionString(position) {
  const row = position.parentElement;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const colIndex = Array.from(row.children).indexOf(position);
  return `${colIndex}:${rowIndex}:${currentDirection}`;
}

function updatePositionOutput() {
  const positionOutput = document.getElementById('position-output');
  if (positionOutput) {
    positionOutput.innerHTML = "";

    finalPositions.forEach((position) => {
      const listItem = document.createElement('li');
      listItem.textContent = position;
      positionOutput.appendChild(listItem);
    });
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
      }    } else if (currentDirection === 'S') {
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
  return nextRow ? gridRows[nextRowIndex].children[nextColIndex] : null;
}

function getIconClassForDirection(direction) {
  switch (direction) {
    case 'N':
      return 'fa-square-caret-up';
    case 'E':
      return 'fa-square-caret-right';
    case 'S':
      return 'fa-square-caret-down';
    case 'W':
      return 'fa-square-caret-left';
    default:
      return '';
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

placeRover(document.getElementById('grid-container'));
// placeRover(document.querySelector('.grid-container'));
