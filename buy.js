import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCn553qWsVz2VF1dZ4Ji5OkQDGFvMORbJE",
    authDomain: "pg-data-ed1c2.firebaseapp.com",
    databaseURL: "https://pg-data-ed1c2-default-rtdb.firebaseio.com",
    projectId: "pg-data-ed1c2",
    storageBucket: "pg-data-ed1c2.firebasestorage.app",
    messagingSenderId: "884858492190",
    appId: "1:884858492190:web:67b7606ff790064ef3250f",
    measurementId: "G-J73RD8EH7W"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  const amountElem = document.getElementById("amount");
  const qrImage = document.getElementById("qrImage");
  const timerElement = document.getElementById("timer");
  const payButton = document.getElementById("payButton");
  const utrInput = document.getElementById("utrInput");
  const payBtn = document.getElementById("confirmPaymentBtn");
  const utrMessage = document.getElementById("utrMessage");
  const toast = document.getElementById("toast");

  let upiId = '', amount = '';
  let timerId;

  function showTopToast(message, bg = "#323232") {
    const toast = document.getElementById("topToast");
    toast.innerText = message;
    toast.style.background = bg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function showToast(msg) {
    if (toast.style.display === "block") return;
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 3000);
  }

  utrInput.addEventListener("input", () => {
    const utr = utrInput.value.trim();
    if (/^\d{12}$/.test(utr)) {
      utrMessage.textContent = "Valid UTR";
      utrMessage.style.color = "green";
      payBtn.disabled = false;
    } else {
      utrMessage.textContent = "Invalid UTR. Must be 12 digits.";
      utrMessage.style.color = "red";
      payBtn.disabled = true;
    }
  });

  let timeInSeconds = 900;

  function updateTimer() {
    const m = Math.floor(timeInSeconds / 60);
    const s = timeInSeconds % 60;
    timerElement.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (timeInSeconds > 0) {
      timeInSeconds--;
      timerId = setTimeout(updateTimer, 1000);
    }
  }

  updateTimer();

  function fallback(user) {
    upiId = "in99softdev78@upi";
    amount = "299";
    amountElem.innerText = `₹${amount}`;
    const fallbackUpi = encodeURIComponent(`upi://pay?pa=${upiId}&pn=MODX TEAM&am=${amount}&cu=INR`);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${fallbackUpi}`;
    payButton.innerText = `PAY ₹${amount}`;

    push(ref(db, "fallbackLogs"), {
      date: new Date().toLocaleString(),
      reason: "Missing settings data for QR",
      userAgent: navigator.userAgent,
      uid: user?.uid || "unknown"
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }

    get(ref(db, `users/${user.uid}`)).then(snap => {
      const data = snap.val();
      if (!data || data.status !== "active") {
        alert("Your account is inactive or blocked.");
        window.location.href = "/login.html";
        return;
      }

      // User is active — proceed
      get(ref(db, "settings")).then((snapshot) => {
        if (snapshot.exists()) {
          const s = snapshot.val();
          upiId = s.upi;
          amount = s.amount;

          const upiData = encodeURIComponent(`upi://pay?pa=${upiId}&pn=MODX TEAM&am=${amount}&cu=INR`);
          qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${upiData}`;
          payButton.innerText = `PAY ₹${amount}`;
          amountElem.innerText = `₹${amount}`;
        } else {
          fallback(user);
        }
      }).catch((error) => {
        console.error("Error fetching settings:", error);
        fallback(user);
      });

      payBtn.addEventListener("click", () => {
        const utr = utrInput.value.trim();
        if (!/^\d{12}$/.test(utr)) {
          showTopToast("Invalid UTR. Must be 12 digits.", "#ff9800");
          return;
        }

        const txn = {
          uid: user.uid,
          utr,
          app: "UPI",
          amount,
          upi: upiId,
          status: "Pending",
          date: new Date().toLocaleString()
        };

        get(ref(db, "transactions")).then(snapshot => {
          const data = snapshot.val();
          const exists = data && Object.values(data).some(t => t.utr === utr);
          if (exists) {
            showTopToast("UTR already submitted.", "#f44336");
            return;
          }

          payBtn.disabled = true;
          payBtn.innerText = "Submitting...";

          push(ref(db, "transactions"), txn)
            .then(() => {
              showTopToast("Transaction submitted for confirmation", "#4CAF50");
              utrInput.value = "";
              utrMessage.textContent = "";
              payBtn.innerText = "Confirm Payment";
            })
            .catch((error) => {
              console.error("Error saving transaction:", error);
              showTopToast("Transaction confirmation error!", "#f44336");
              payBtn.disabled = false;
              payBtn.innerText = "Confirm Payment";
            });
        });
      });

      payButton.addEventListener("click", () => {
        const appRadio = document.querySelector('input[name="upiApp"]:checked');
        if (!appRadio) {
          showTopToast("Select a UPI app before proceeding!", "#ff9800");
          return;
        }

        const app = appRadio.value;
        let pkg = "";
        switch (app) {
          case "phonepe": pkg = "com.phonepe.app"; break;
          case "gpay": pkg = "com.google.android.apps.nbu.paisa.user"; break;
          case "paytm": pkg = "net.one97.paytm"; break;
        }

        const upiLink = `upi://pay?pa=${upiId}&pn=MODX TEAM&am=${amount}&cu=INR`;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
          const intent = `intent://${upiLink.replace("upi://", "")}#Intent;scheme=upi;package=${pkg};end`;
          window.location.href = intent;
          showTopToast("If app didn’t open, try scanning the QR.", "#2196F3");
        } else {
          showTopToast("Please use a mobile device to make payment.", "#ff9800");
        }
      });

    });
  });
