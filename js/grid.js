document.addEventListener("DOMContentLoaded", function() {
  loadGridData(); // Carica il file e crea la griglia al caricamento della pagina
});

function loadGridData() {
  const filePath = "input.txt";
  fetch(filePath)
    .then(response => response.text())
    .then(fileContent => {
      console.log("Contenuto del file:", fileContent);
      parseGridData(fileContent);
      resetRoverData(); // Aggiungi questa linea
      placeRover(document.getElementById('grid-container'));
    })
    .catch(error => console.log("Errore durante il caricamento del file:", error));
}

function resetRoverData() {
  currentDirection = 'N';
  currentPosition = null;
  positionList = [];
  commandStrings = [];
  finalPositions = [];
  obstacleEncountered = false;
  obstacleCommands = [];
  resetPositionOutput();

  const rover = document.querySelector('.rover');
  if (rover) {
    rover.remove();
  }
}

function resetPositionOutput() {
  const positionOutput = document.getElementById('position-output');
  if (positionOutput) {
    positionOutput.innerHTML = "";
  }
}

function parseGridData(fileContent) {
  const lines = fileContent.split("\n");
  let gridData = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.length > 0) {
      const match = line.match(/(\w+)\s+(\d+)\s+(\d+)/);

      if (match) {
        const key = match[1];
        const numCols = parseInt(match[2], 10);
        const numRows = parseInt(match[3], 10);

        if (key === "Size") {
          gridData.numCols = numCols;
          gridData.numRows = numRows;
          console.log("NumCols:", gridData.numCols);
          console.log("NumRows:", gridData.numRows);
        } else if (key === "Obstacle") {
          gridData.obstacles = gridData.obstacles || [];
          const obstacleX = parseInt(match[2], 10);
          const obstacleY = parseInt(match[3], 10);

          if (obstacleX === 0 && obstacleY === 0) {
            console.log("Errore: L'ostacolo non può essere posizionato nella casella in basso a sinistra perché è la casella di partenza del rover.");
            continue;
          }

          if (
            obstacleX >= 0 && obstacleX < gridData.numCols &&
            obstacleY >= 0 && obstacleY < gridData.numRows
          ) {
             if (gridData.obstacles.length >= (gridData.numCols * gridData.numRows) / 2) {
              console.log("Errore: Gli ostacoli non possono essere più della metà delle caselle totali.");
              continue;
            }
            
            gridData.obstacles.push({ x: obstacleX, y: obstacleY });
          } else {
            console.log("Errore: Le coordinate dell'ostacolo sono al di fuori dei limiti della griglia.");
          }
        }
      }
    }
  }

  createGrid(gridData);
}

function createGrid(gridData) {
  const gridContainer = document.getElementById('grid-container');
  const numCols = gridData.numCols;
  const numRows = gridData.numRows;

  const containerWidth = gridContainer.offsetWidth;
  const cellWidth = containerWidth / numCols;

  gridContainer.innerHTML = "";
  gridContainer.style.setProperty('--numCols', numCols);

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement('div');
    row.classList.add('jt-row');

    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('jt-cell');
      cell.style.width = `${cellWidth}px`;
      cell.style.height = `${cellWidth}px`;

      const isObstacle = gridData.obstacles.some(obstacle => obstacle.x === j && obstacle.y === i);
      if (isObstacle) {
        cell.classList.add('obstacle');
      }

      row.appendChild(cell);
    }

    gridContainer.prepend(row);
  }
  placeRover(gridContainer);
}
