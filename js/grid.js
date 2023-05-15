const form = document.querySelector("form");
const gridContainer = document.getElementById('grid-container');

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const numCols = parseInt(document.getElementById("numCols").value);
  const numRows = parseInt(document.getElementById("numRows").value);
  const numObstacles = parseInt(document.getElementById("numObstacles").value);

  if (numObstacles > numCols * numRows) {
    alert("You cannot add more obstacles than grid cells.");
    return;
  }

  const obstacles = [];

  for (let i = 0; i < numObstacles; i++) {
    const obstacleX = parseInt(prompt("Chose position X for the obstacle " + (i + 1)));
    const obstacleY = parseInt(prompt("Chose position Y for the obstacle " + (i + 1)));

    if (obstacleX === 0 && obstacleY === 0) {
      alert("Invalid position. The obstacle cannot be add here because it's the rover starting cell.");
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
  placeRover(gridContainer);

});
