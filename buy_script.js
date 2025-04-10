let timeInSeconds = 900;

const timerElement = document.getElementById('timer');

function updateTimer() {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  if (timeInSeconds > 0) {
    timeInSeconds--;
    setTimeout(updateTimer, 1000);
  }
}

updateTimer();

document.getElementById('payButton').addEventListener('click', () => {
  const selectedApp = document.querySelector('input[name="upiApp"]:checked').value;

  const upiLink = "upi://pay?pa=in99softdev78@upi&pn=ModXCrazy&am=1&cu=INR";
  let packageName = "";

  switch (selectedApp) {
    case "phonepe":
      packageName = "com.phonepe.app";
      break;
    case "gpay":
      packageName = "com.google.android.apps.nbu.paisa.user";
      break;
    case "paytm":
      packageName = "net.one97.paytm";
      break;
  }

  window.location.href = `intent://${upiLink}#Intent;scheme=upi;package=${packageName};end`;
});
