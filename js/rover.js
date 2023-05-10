function placeRover(gridContainer) {
  const rover = document.createElement('i');
  rover.classList.add('fa-regular', 'fa-square-caret-up', 'rover')

  // Funzione per verificare se la griglia è pronta
  function checkGridReady() {
    const startPosition = gridContainer.querySelector('.jt-row:last-child .jt-cell:first-child');
    if (startPosition) {
      startPosition.appendChild(rover);
    } else {
      setTimeout(checkGridReady, 100); // Riprova dopo 100ms
    }
  }

  checkGridReady();
}