let currentDirection = "N";
let currentPosition;
let finalPositions = [];
let obstacleEncountered = false;

function placeRover(gridContainer) {
  const rover = document.createElement("i");
  rover.classList.add("fa-regular", "fa-square-caret-up", "rover");

  const startPosition = gridContainer.querySelector(
    ".jt-row:last-child .jt-cell:first-child"
  );
  if (!startPosition)
    throw new Error(
      "Errore: Impossibile trovare l'elemento di partenza del rover."
    );
  startPosition.appendChild(rover);

  currentPosition = startPosition;

  updatePositionOutput();

  executeCommands();
}

async function executeCommandSequence(commands, currentPosition) {
  await commands.reduce(async (promise, command, currentIndex) => {
    await promise;
    executeCommand(command, currentIndex === commands.length - 1);
    await delay(2000);
  }, Promise.resolve());
}

async function executeCommands() {
  const filePath = "input.txt";
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
        await delay(lineDelay);

        const initialPosition = currentPosition;
        await executeCommandSequence(commands, currentPosition);

        const positionString = getPositionString(currentPosition);
        finalPositions.push(positionString);

        updatePositionOutput();

        if (initialPosition === currentPosition) {
          obstacleEncountered = true;
        } else if (obstacleEncountered) {
          obstacleEncountered = false;
        }
      }
    }
  } catch (error) {
    console.log("Error loading file:", error);
  }
}

function mapCommands(commandString) {
  const commandMap = {
    F: "F",
    B: "B",
    L: "L",
    R: "R",
  };

  return commandString.split("").map((command) => commandMap[command]);
}

function executeCommand(command, isLastCommand) {
  switch (command) {
    case "F":
    case "B":
      moveRover(command);
      break;
    case "L":
    case "R":
      rotateRover(command);
      break;
  }
  if (isLastCommand) {
    updatePositionOutput();
  }
}

function moveRover(direction) {
  const rover = document.querySelector(".rover");
  if (!rover) {
    return;
  }

  const nextPosition = getNextPosition(currentPosition, direction);

  if (nextPosition) {
    obstacleEncountered = nextPosition.classList.contains("obstacle");
    if (!obstacleEncountered) {
      currentPosition.removeChild(rover);
      nextPosition.appendChild(rover);

      currentPosition = nextPosition;
    }
  }
}

function getPositionString(position) {
  const gridRows = Array.from(position.parentElement.parentElement.children);
  const rowIndex = gridRows.indexOf(position.parentElement);
  const colIndex = Array.from(position.parentElement.children).indexOf(
    position
  );

  const numCols = gridRows[0].children.length;
  const numRows = gridRows.length;

  const adjustedColIndex = colIndex;
  const adjustedRowIndex = numRows - rowIndex - 1;

  let positionString = `${adjustedColIndex}:${adjustedRowIndex}:${currentDirection}`;

  if (obstacleEncountered) {
    positionString = "O:" + positionString;
  }

  return positionString;
}

function updatePositionOutput() {
  const positionOutput = document.getElementById("position-output");
  if (positionOutput) {
    positionOutput.innerHTML = "";

    finalPositions.forEach((position, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "list-group-item-secondary");
      listItem.textContent = `Posizione ${index + 1}: ${position}`;
      positionOutput.appendChild(listItem);
    });
  }
}

function rotateRover(rotation) {
  const rover = document.querySelector(".rover");
  if (!rover) {
    throw new Error("Rover non disponibile.");
  }

  const directions = ["N", "E", "S", "W"];
  const currentIndex = directions.indexOf(currentDirection);
  let newIndex;

  if (rotation === "L") {
    newIndex = (currentIndex - 1 + directions.length) % directions.length;
  } else if (rotation === "R") {
    newIndex = (currentIndex + 1) % directions.length;
  }

  currentDirection = directions[newIndex];
  const iconClass = getIconClassForDirection(currentDirection);
  rover.className = `fa-regular ${iconClass} rover`;
}

function moveUp(rowIndex, gridRows) {
  let nextRowIndex = rowIndex--;
  if (nextRowIndex < 0) {
    nextRowIndex = gridRows.length - 1;
  }
  return nextRowIndex;
}

function moveDown(rowIndex, gridRows) {
  let nextRowIndex = rowIndex++;
  if (nextRowIndex >= gridRows.length) {
    nextRowIndex = 0;
  }
  return nextRowIndex;
}

function moveRight(colIndex, gridCols) {
  let nextColIndex = colIndex++;
  if (nextColIndex >= gridCols.length) {
    nextColIndex = 0;
  }
  return nextColIndex;
}

function moveLeft(colIndex, gridCols) {
  let nextColIndex = colIndex--;
  if (nextColIndex < 0) {
    nextColIndex = gridCols.length - 1;
  }
  return nextColIndex;
}

function getNextPosition(currentPosition, direction) {
  const row = currentPosition.parentElement;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const colIndex = Array.from(row.children).indexOf(currentPosition);
  const gridRows = Array.from(row.parentElement.children);
  const gridCols = Array.from(row.children);

  let nextRowIndex = rowIndex;
  let nextColIndex = colIndex;

  if (direction === "F") {
    if (currentDirection === "N") {
      nextRowIndex = moveUp(rowIndex, gridRows);
    } else if (currentDirection === "E") {
      nextColIndex = moveRight(colIndex, gridCols);
    } else if (currentDirection === "S") {
      nextRowIndex = moveDown(rowIndex, gridRows);
    } else if (currentDirection === "W") {
      nextColIndex = moveLeft(colIndex, gridCols);
    }
  } else if (direction === "B") {
    if (currentDirection === "N") {
      nextRowIndex = moveDown(rowIndex, gridRows);
    } else if (currentDirection === "E") {
      nextColIndex = moveLeft(colIndex, gridCols);
    } else if (currentDirection === "S") {
      nextRowIndex = moveUp(rowIndex, gridRows);
    } else if (currentDirection === "W") {
      nextColIndex = moveRight(colIndex, gridCols);
    }
  }

  const nextRow = gridRows[nextRowIndex];
  const nextPosition = nextRow
    ? gridRows[nextRowIndex].children[nextColIndex]
    : null;

  return nextPosition;
}

function getIconClassForDirection(direction) {
  switch (direction) {
    case "N":
      return "fa-square-caret-up";
    case "E":
      return "fa-square-caret-right";
    case "S":
      return "fa-square-caret-down";
    case "W":
      return "fa-square-caret-left";
    default:
      return "";
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
