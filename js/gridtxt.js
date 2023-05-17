document.addEventListener("DOMContentLoaded", () => {
  const loadButton = document.getElementById("loadButton");
  loadButton.addEventListener("click", loadGridData);
});

async function loadGridData() {
  const filePath = "input.txt";
  try {
    const response = await fetch(filePath);
    const fileContent = await response.text();
    console.log("Contenuto del file:", fileContent);
    parseGridData(fileContent);
  } catch (error) {
    console.log("Errore durante il caricamento del file:", error);
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
        const [, key, numCols, numRows] = match;
        const obstacles = lines
          .filter(line => line.trim().startsWith("Obstacle"))
          .map(line => {
            const [, , obstacleX, obstacleY] = line.match(/(\w+)\s+(\d+)\s+(\d+)/);
            return { x: parseInt(obstacleX, 10), y: parseInt(obstacleY, 10) };
          });

        if (key === "Size") {
          gridData.numCols = parseInt(numCols, 10);
          gridData.numRows = parseInt(numRows, 10);
          console.log("NumCols:", gridData.numCols);
          console.log("NumRows:", gridData.numRows);
        } else if (key === "Obstacle") {
          if (obstacles.length >= (gridData.numCols * gridData.numRows) / 2) {
            console.log("Errore: Gli ostacoli non possono essere più della metà delle caselle totali.");
            continue;
          }
          gridData.obstacles = obstacles;
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
      cell.style.cssText = `width: ${cellWidth}px; height: ${cellWidth}px;`;

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
