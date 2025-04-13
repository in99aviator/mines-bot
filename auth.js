import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getDatabase, ref, set, get
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAgjEBxPifW0W3o7CtLfRZ9mXnHoMbibao",
    authDomain: "mines-botai.firebaseapp.com",
    projectId: "mines-botai",
    storageBucket: "mines-botai.firebasestorage.app",
    messagingSenderId: "175710322906",
    appId: "1:175710322906:web:94470ebbc40336f6dfe5e3",
    measurementId: "G-EBFW4SM45S"
    };

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const toggleForm = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");
const toast = document.getElementById("toast");

let isRegister = false;

// Toggle Form
toggleForm.addEventListener("click", () => {
  isRegister = !isRegister;
  formTitle.innerText = isRegister ? "Register" : "Login";
  nameField.style.display = isRegister ? "block" : "none";
  submitBtn.innerText = isRegister ? "Register" : "Login";
  toggleForm.innerText = isRegister
    ? "Already have an account? Login"
    : "Don't have an account? Register";
});

// Submit
submitBtn.addEventListener("click", () => {
  const email = emailField.value.trim();
  const password = passwordField.value.trim();
  const name = nameField.value.trim();

  if (!email || !password || (isRegister && !name)) {
    return showToast("Please fill in all fields!");
  }

  if (isRegister) {
    // Registration
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;
        const date = new Date().toLocaleString();
        set(ref(db, "users/" + uid), {
          uid: uid,
          name: name,
          email: email,
          password: password,
          status: "no active",
          registrationDate: date
        }).then(() => showToast("User registered successfully!"));
      })
      .catch(err => showToast(err.message));
  } else {
    // Login
// Login
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const uid = userCredential.user.uid;

    // Fetch user status from database
    const userRef = ref(db, "users/" + uid);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const status = userData.status;

          if (status === "active") {
            showToast("Login successful! Redirecting...");
            setTimeout(() => {
              window.location.href = "index.html";
            }, 1000);
          } else if (status === "blocked") {
            showToast("Your account is blocked!");
            setTimeout(() => {
              window.location.href = "blocked.html";
            }, 1000);
          } else {
            showToast("Your account is not active!");
            setTimeout(() => {
              window.location.href = "buy.html";
            }, 1000);
          }
        } else {
          showToast("User data not found!");
        }
      })
      .catch((error) => {
        showToast("Failed to fetch user data: " + error.message);
      });
  })
  .catch((err) => showToast(err.message));
  }
});

// Toast
function showToast(msg) {
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}
