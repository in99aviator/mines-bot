  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCn553qWsVz2VF1dZ4Ji5OkQDGFvMORbJE",
    authDomain: "pg-data-ed1c2.firebaseapp.com",
    databaseURL: "https://pg-data-ed1c2-default-rtdb.firebaseio.com",
    projectId: "pg-data-ed1c2"
  };

  const app = initializeApp(firebaseConfig);
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

  function getRandomAmount() {
    return (Math.floor(Math.random() * 10900) + 100) + ".00";
  }

  function generateHorizontalLeaderboard() {
    const scrollingText = document.getElementById("scrollingText");
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
    const indices = Array.from({ length: totalCells }, (_, i) => i);
    const safeIndices = indices.sort(() => 0.5 - Math.random()).slice(0, safeCount);

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
    if (status) {
      status.innerText = "Bot Status is: Connected to Server ✅";
    }
  }


  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      const userRef = ref(db, "users/" + uid);
      get(userRef).then(snapshot => {
        if (snapshot.exists()) {
          const status = snapshot.val().status;
          if (status === "active") {
            generateStars();
            generateHorizontalLeaderboard();
            updateStatus();
          } else if (status === "blocked") {
            window.location.href = "blocked.html";
          } else {
            window.location.href = "buy.html";
          }
        } else {
          window.location.href = "splash.html";
        }
      }).catch(() => {
        window.location.href = "splash.html";
      });
    } else {
      window.location.href = "splash.html";
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
