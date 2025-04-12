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
          status: "active",
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
