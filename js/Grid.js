const form = document.querySelector("form");
const gridContainer = document.querySelector('.grid-container');

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const numCols = parseInt(document.getElementById("numCols").value);
  const numRows = parseInt(document.getElementById("numRows").value);
  const numObstacles = parseInt(document.getElementById("numObstacles").value);

  if (numObstacles > numCols * numRows) {
    alert("Il numero di ostacoli non può essere superiore al numero di celle nella griglia.");
    return;
  }

  const obstacles = [];

  for (let i = 0; i < numObstacles; i++) {
    const obstacleX = parseInt(prompt("Inserisci la posizione X dell'ostacolo " + (i + 1)));
    const obstacleY = parseInt(prompt("Inserisci la posizione Y dell'ostacolo " + (i + 1)));

    if (obstacleX === 0 && obstacleY === 0) {
      alert("Posizione non valida. L'ostacolo non può essere posizionato qui perché è la posizione di partenza del rover.");
      return;
    }

    obstacles.push({ x: obstacleX, y: obstacleY });
  }

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

      const isObstacle = obstacles.some(obstacle => obstacle.x === j && obstacle.y === i);
      if (isObstacle) {
        cell.classList.add('obstacle');
      }

      row.appendChild(cell);
    }

    gridContainer.prepend(row);
  }

  const roverCell = gridContainer.querySelector('.jt-row:last-child .jt-cell:first-child');
  roverCell.classList.add('rover');
});