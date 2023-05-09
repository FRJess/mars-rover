const form = document.querySelector("form");
const gridContainer = document.querySelector('.grid-container');

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const numCols = parseInt(document.getElementById("numCols").value);
  const numRows = parseInt(document.getElementById("numRows").value);
  const root = document.documentElement;
  root.style.setProperty('--numCols', numCols);

  const cellWidth = 100 / numCols;

  gridContainer.innerHTML = "";

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement('div');
    row.classList.add('jt-row');

    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('jt-cell');
      cell.style.width = `${cellWidth}%`;
      cell.style.paddingBottom = `${cellWidth}%`;
      row.appendChild(cell);
    }

    gridContainer.appendChild(row);
  }
});