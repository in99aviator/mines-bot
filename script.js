  import { app } from './firebase-config.js';
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

  const auth = getAuth(app);
  const db = getDatabase(app);

  const winnerNames = [
    "Ravi", "Anjali", "Pooja", "Amit", "Ramesh", "Kiran", "Neha", "Manoj", "Swati", "Sunil",
    "Priya", "Vikas", "Suman", "Deepak", "Shweta", "Vivek", "Sneha", "Rahul", "Asha", "Alok",
    "Gaurav", "Meena", "Harsh", "Divya", "Nikhil", "Rekha", "Kapil", "Kavita", "Aman", "Simran",
    "Nitin", "Bhavna", "Abhishek", "Naina", "Varun", "Komal", "Saurabh", "Ruchi", "Yogesh", "Namrata",
    "Tanmay", "Pallavi", "Rajesh", "Sapna", "Mohit", "Payal", "Vinod", "Khushi", "Tushar", "Nisha",
    "Ankit", "Kirti", "Hemant", "Isha", "Jatin", "Preeti", "Sachin", "Kajal", "Lokesh", "Tina",
    "Sharad", "Monika", "Dev", "Aarti", "Sandeep", "Neelam", "Rohan", "Ritika", "Anshul", "Lavanya",
    "Mayank", "Jyoti", "Aditya", "Poonam", "Ujjwal", "Megha", "Karan", "Anu", "Parth", "Geeta",
    "Akash", "Tanu", "Rajat", "Lata", "Prateek", "Muskan", "Ashish", "Vidya", "Lakshay", "Ira",
    "Tarun", "Kriti", "Deepanshu", "Juhi", "Naresh", "Surbhi", "Sagar", "Chitra", "Rajiv", "Disha",
    "Ayush", "Shilpa", "Vishal", "Radhika", "Sujit", "Anika", "Hemlata", "Ravina", "Devansh", "Snehal",
    "Arvind", "Neetu", "Darshan", "Karishma", "Bhavesh", "Asmita", "Farhan", "Sana", "Imran", "Zaara",
    "Irfan", "Afreen", "Faizan", "Ayesha", "Sameer", "Saniya", "Rehan", "Zoya", "Wasim", "Nazma",
    "Owais", "Lubna", "Aftab", "Shaista", "Arman", "Alina", "Saif", "Nusrat", "Firoz", "Shabana",
    "Junaid", "Tabassum", "Aslam", "Sobia", "Kabir", "Rubeena", "Tariq", "Yasmin", "Adil", "Heena",
    "Aadil", "Sadia", "Arbaz", "Madiha", "Nabeel", "Rida", "Azhar", "Humaira", "Salman", "Sakina",
    "Shahrukh", "Iqra", "Amjad", "Aqsa", "Reyaz", "Zainab", "Majid", "Mehr", "Zubair", "Sahar",
    "Tanveer", "Anabia", "Sohail", "Amira", "Hasan", "Bushra", "Bilal", "Shiza", "Noman", "Noor",
    "Shadab", "Aleena", "Rauf", "Fatima", "Qasim", "Hafsa", "Yasir", "Laiba", "Talib", "Hina",
    "Wasim", "Mehar", "Mubin", "Ifra", "Abrar", "Misbah", "Zeeshan", "Areeba", "Nasir", "Hoorain"
  ];

  const scrollingText = document.getElementById("scrollingText");

function getRandomAmount() {
  return (Math.floor(Math.random() * 10900) + 100) + ".00";
}

function generateHorizontalLeaderboard() {
  let winnersText = "";
  for (let i = 0; i < 30; i++) {
    const name = winnerNames[Math.floor(Math.random() * winnerNames.length)];
    const amount = getRandomAmount();
    winnersText += `${name} won ₹${amount} &nbsp;&nbsp;&nbsp; `;
  }
  scrollingText.innerHTML = winnersText;
}

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
    if (status) {
      status.innerText = "Bot Status is: Connected to Server ✅";
    }
  }


  onAuthStateChanged(auth, (user) => {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (user) {
    loadingOverlay.style.display = "flex"; // Show loader

    const uid = user.uid;
    const userRef = ref(db, "users/" + uid);
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const status = snapshot.val().status;
        if (status === "active") {
          generateStars();
          updateStatus();
          loadingOverlay.style.display = "none"; // Hide after load
        } else if (status === "blocked") {
          loadingOverlay.innerText = "Redirecting to blocked page...";
          setTimeout(() => window.location.href = "blocked.html", 1000);
        } else {
          loadingOverlay.innerText = "Redirecting to payment page...";
          setTimeout(() => window.location.href = "buy.html", 1000);
        }
      } else {
        loadingOverlay.innerText = "Redirecting to login...";
        setTimeout(() => window.location.href = "splash.html", 1000);
      }
    }).catch(() => {
      loadingOverlay.innerText = "Something went wrong. Redirecting...";
      setTimeout(() => window.location.href = "splash.html", 1000);
    });

  } else {
    loadingOverlay.innerText = "Checking session...";
    setTimeout(() => window.location.href = "splash.html", 1000);
  }
});

  function openDialog() {
    document.getElementById("dialogOverlay").style.display = "flex";
  }

  function closeDialog() {
    document.getElementById("dialogOverlay").style.display = "none";
  }

  function showSignal() {
    alert("Signal Bot is Active!");
  }

  function redirectToJoin() {
    window.open("https://t.me/soft99dev", "_blank");
  }
generateHorizontalLeaderboard();
