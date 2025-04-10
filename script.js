function generateStars() {
  const grid = document.getElementById("grid");
  const mineCountSelect = document.getElementById("mineCount");
  const mineCount = mineCountSelect ? parseInt(mineCountSelect.value || "1") : 1;

  grid.innerHTML = "";

  const totalCells = 25;
  const safeCells = mineCount;
  const starCells = totalCells - safeCells;

  const cellIndices = Array.from({ length: totalCells }, (_, i) => i);
  const safeIndices = cellIndices.sort(() => 0.5 - Math.random()).slice(0, safeCells);

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (!safeIndices.includes(i)) {
      cell.classList.add("star");
    }

    grid.appendChild(cell);
  }
}

function updateStatus() {
  const status = document.getElementById("status");
  status.innerText = "Bot Status is: Connected to Server ✅";
}

function showSignal() {
  alert("Signal Bot is Active!");
}

window.onload = generateStars;
