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
const database = firebase.database();

// DOM Elements
const loaderOverlay = document.getElementById('loaderOverlay');
const grid = document.getElementById('grid');
const signalBtn = document.getElementById('signalBtn');
const openBtn = document.querySelector('.open-btn');
const statusBtn = document.getElementById('statusBtn');
const joinBtn = document.getElementById('join-btn');
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

// Check user authentication state
function checkAuthState() {
  auth.onAuthStateChanged((user) => {
    if (user && user.uid) {
      console.log("User UID:", user.uid);
      checkUserStatus(user.uid);
    } else {
      console.warn("No user signed in.");
      window.location.href = "auth.html";
    }
  });
}

// Check user status in database
function checkUserStatus(uid) {
  database.ref('users/' + uid).once('value')
    .then((snapshot) => {
      const userData = snapshot.val();
      console.log("User data:", userData);

      if (!userData || !userData.status) {
        showDialog("Error", "User data not found.");
        auth.signOut();
        return;
      }

      const status = userData.status;
      console.log("User status:", status);

      if (status === "blocked") {
        window.location.href = "blocked.html";
      } else if (status !== "active") {
        window.location.href = "plans.html";
      }

      // Continue as user is active
    })
    .catch((error) => {
      console.error("Error reading user status:", error);
      showDialog("Error", "Could not verify account. Please retry.");
    })
    .finally(() => {
      loaderOverlay.classList.add('hidden');
    });
}

// Generate signal
function generateSignal() {
  const user = auth.currentUser;
  
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  // Show loading state
  const originalText = signalBtn.innerHTML;
  signalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  signalBtn.disabled = true;

  database.ref('users/' + user.uid + '/status').once('value')
    .then((snapshot) => {
      const status = snapshot.val();
      
      if (status === "active") {
        runSignalLogic();
      } else if (status === "blocked") {
        window.location.href = "blocked.html";
      } else {
        window.location.href = "plans.html";
      }
    })
    .catch((error) => {
      console.error("Error checking status:", error);
      showDialog("Error", "Failed to verify account status");
    })
    .finally(() => {
      signalBtn.innerHTML = originalText;
      signalBtn.disabled = false;
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
  checkAuthState();
  
  setTimeout(() => {
    loaderOverlay.classList.add('hidden');
  }, 1000);
});
