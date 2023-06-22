document.addEventListener("DOMContentLoaded", function () {
  loadGridData();
});

function loadGridData() {
  const filePath = "input.txt";
  fetch(filePath)
    .then((response) => response.text())
    .then((fileContent) => {
      parseGridData(fileContent);
    })
    .catch((error) =>
      console.log("Errore durante il caricamento del file:", error)
    );
}

function parseGridData(fileContent) {
  const lines = fileContent.split("\n");
  let gridData = {
    numCols: 4,
    numRows: 4,
    obstacles: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.length <= 0) continue;

    const match = line.match(/(\w+)\s+(\d+)\s+(\d+)/);

    if (!match) continue;
    const key = match[1];

    if (key === "Size") {
      gridData.numCols = parseInt(match[2], 10);
      gridData.numRows = parseInt(match[3], 10);
    } else if (key === "Obstacle") {
      const obstacleX = parseInt(match[2], 10);
      const obstacleY = parseInt(match[3], 10);

      if (obstacleX === 0 && obstacleY === 0) {
        throw new Error(
          "Errore: L'ostacolo non può essere posizionato nella casella in basso a sinistra."
        );
      }

      if (
        gridData.obstacles.length >=
        (gridData.numCols * gridData.numRows) / 2
      ) {
        throw new Error(
          "Errore: Gli ostacoli non possono essere più della metà delle caselle totali."
        );
      }

      gridData.obstacles.push({ x: obstacleX, y: obstacleY });
    }
  }

  createGrid(gridData);
}

function createGrid(gridData) {
  const gridContainer = document.getElementById("grid-container");
  const numCols = gridData.numCols;
  const numRows = gridData.numRows;

  const containerWidth = gridContainer.offsetWidth;
  const cellWidth = containerWidth / numCols;

  gridContainer.innerHTML = "";
  gridContainer.style.setProperty("--numCols", numCols);

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement("div");
    row.classList.add("jt-row");

    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("jt-cell");
      cell.style.width = `${cellWidth}px`;
      cell.style.height = `${cellWidth}px`;

      const isObstacle = gridData.obstacles.some(
        (obstacle) => obstacle.x === j && obstacle.y === i
      );
      if (isObstacle) {
        cell.classList.add("obstacle");
      }

      row.appendChild(cell);
    }

    gridContainer.prepend(row);
  }
  placeRover(gridContainer);
}
