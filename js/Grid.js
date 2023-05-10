const form = document.querySelector("form");
const gridContainer = document.querySelector('.grid-container');

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const numCols = parseInt(document.getElementById("numCols").value);
  const numRows = parseInt(document.getElementById("numRows").value);
  const containerWidth = gridContainer.offsetWidth; 
  const cellWidth = containerWidth / numCols;

  // const cellWidth = 100 / numCols;

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
      row.appendChild(cell);
    }

    gridContainer.appendChild(row);
  }
});