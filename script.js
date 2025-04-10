function generateStars() {
  const grid = document.getElementById("grid");
  const mineCountElement = document.getElementById("mineCount");
  const safeCount = mineCountElement ? parseInt(mineCountElement.value) : 1;

  grid.innerHTML = "";

  const totalCells = 25;

  // Generate 25 cell indices: 0 to 24
  const indices = Array.from({ length: totalCells }, (_, i) => i);

  // Shuffle and pick `safeCount` indices to be empty
  const safeIndices = indices
    .sort(() => 0.5 - Math.random())
    .slice(0, safeCount);

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    // Add star only if not in safe indices
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

function redirectToJoin() {
  window.open("https://t.me/soft99dev", "_blank"); // ← Yahan apna real link daalo
}

window.onload = generateStars;
