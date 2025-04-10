const upiID = "boim-905432060444@boi";
const amount = "300.00";

// Generate QR Code
const qrCanvas = document.getElementById("qrCode");
const qrData = `upi://pay?pa=${upiID}&pn=User&am=${amount}&cu=INR`;
QRCode.toCanvas(qrCanvas, qrData, function (error) {
  if (error) console.error(error);
});

// Timer
let timeLeft = 300;
const timerElement = document.getElementById("timer");

function updateTimer() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerElement.textContent =
    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  } else {
    timerElement.textContent = "Expired";
  }
}

updateTimer();

// Copy functions
function copyUPI() {
  navigator.clipboard.writeText(upiID);
  alert("UPI ID copied!");
}

function copyAmount() {
  navigator.clipboard.writeText(amount + " INR");
  alert("Amount copied!");
}

function confirmPayment() {
  window.location.href = "https://t.me/soft99dev"; // ← Replace with your actual redirect link
}
