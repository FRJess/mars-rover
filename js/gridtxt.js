document.addEventListener("DOMContentLoaded", function() {
  const loadButton = document.getElementById("loadButton");
  loadButton.addEventListener("click", loadGridData);
});

function loadGridData() {
  const filePath = "input.txt"; // File nel progetto, da sostituire con file utente
  fetch(filePath)
    .then(response => response.text())
    .then(fileContent => {
      console.log("Contenuto del file:", fileContent);
      parseGridData(fileContent);
    })
    .catch(error => console.log("Errore durante il caricamento del file:", error));
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
            console.log("Errore: L'ostacolo non può essere posizionato nella casella in basso a sinistra.");
            continue;
          }

          if (gridData.obstacles.length >= (gridData.numCols * gridData.numRows) / 2) {
            console.log("Errore: Gli ostacoli non possono essere più della metà delle caselle totali.");
            continue;
          }

          gridData.obstacles.push({ x: obstacleX, y: obstacleY });
        }
      }
    }
  }

  createGrid(gridData);
}


function createGrid(gridData) {
  const gridContainer = document.querySelector('.grid-container');
  const numCols = gridData.numCols;
  const numRows = gridData.numRows;
  const cellWidth = 50; 

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
}
