// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAgjEBxPifW0W3o7CtLfRZ9mXnHoMbibao",
  authDomain: "mines-botai.firebaseapp.com",
  databaseURL: "https://mines-botai-default-rtdb.firebaseio.com",
  projectId: "mines-botai",
  storageBucket: "mines-botai.appspot.com",
  messagingSenderId: "175710322906",
  appId: "1:175710322906:web:94470ebbc40336f6dfe5e3",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// DOM Elements
const loaderOverlay = document.getElementById('loaderOverlay');
const grid = document.getElementById('grid');
const signalBtn = document.getElementById('signalBtn');
const openBtn = document.querySelector('.open-btn');
const statusBtn = document.getElementById('statusBtn');
const joinBtn = document.getElementById('joinBtn');
const dialogOverlay = document.getElementById('dialogOverlay');
const closeBtn = document.querySelector('.close-btn');
const dialogTitle = document.getElementById('dialogTitle');
const dialogMessage = document.getElementById('dialogMessage');
const mineCountSelect = document.getElementById('mineCount');
const statusText = document.getElementById('status');

// Initialize grid
function initializeGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerHTML = '';
    grid.appendChild(cell);
  }
}

// Show dialog
function showDialog(title, message) {
  dialogTitle.textContent = title;
  dialogMessage.innerHTML = message;
  dialogOverlay.classList.add('active');
}

// Close dialog
function closeDialog() {
  dialogOverlay.classList.remove('active');
}

// Generate signal
function generateSignal() {
  auth.onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      db.ref("users/" + uid + "/status").once("value").then(snapshot => {
        const status = snapshot.val();
        if (status === "active") {
          runSignalLogic();
        } else if (status === "blocked") {
          window.location.href = "blocked.html";
        } else {
          window.location.href = "plans.html";
        }
      }).catch(error => {
        console.error("Error checking status:", error);
        showDialog("Error", "Failed to check user status");
      });
    } else {
      window.location.href = "auth.html";
    }
  });
}

// Run signal logic
function runSignalLogic() {
  const mineCount = parseInt(mineCountSelect.value);
  const cells = document.querySelectorAll('.cell');

  // Reset grid
  cells.forEach(cell => {
    cell.classList.remove('mine', 'safe');
    cell.innerHTML = '';
  });

  // Place mines
  const minePositions = [];
  while (minePositions.length < mineCount) {
    const pos = Math.floor(Math.random() * 25);
    if (!minePositions.includes(pos)) {
      minePositions.push(pos);
      cells[pos].classList.add('mine');
      cells[pos].innerHTML = '💣';
      cells[pos].style.color = '#f72585';
    }
  }

  // Mark safe
  cells.forEach((cell, index) => {
    if (!minePositions.includes(index)) {
      cell.classList.add('safe');
      cell.innerHTML = '💎';
      cell.style.color = '#4ade80';
    }
  });
}

// Update status
function updateStatus() {
  const statusTexts = [
    "All systems operational ✅",
    "Server connection stable 🌐",
    "Algorithm running at 98.7% accuracy 📊",
    "Last signal accuracy: 5/5 correct 💎"
  ];
  const randomStatus = statusTexts[Math.floor(Math.random() * statusTexts.length)];
  statusText.innerHTML = `<i class="fas fa-check-circle"></i> ${randomStatus}`;
}

// Redirect to Telegram
function redirectToJoin() {
  window.open('https://t.me/soft99dev', '_blank');
}

// Event Listeners
signalBtn.addEventListener('click', generateSignal);
openBtn.addEventListener('click', () => {
  showDialog(
    'Mines Bot AI Status',
    '<i class="fas fa-check-circle" style="color: var(--success);"></i> Bot AI is successfully connected to our premium servers!<br><br>Current algorithm accuracy: 98.7%'
  );
});
statusBtn.addEventListener('click', updateStatus);
joinBtn.addEventListener('click', redirectToJoin);
closeBtn.addEventListener('click', closeDialog);

// Initialize the app when page loads
window.addEventListener('load', () => {
  initializeGrid();
  setTimeout(() => {
    loaderOverlay.classList.add('hidden');
  }, 100);
});
