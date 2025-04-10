function generateStars() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (Math.random() < 0.25) {
      cell.classList.add("star");
    }

    grid.appendChild(cell);
  }
}

window.onload = generateStars;
