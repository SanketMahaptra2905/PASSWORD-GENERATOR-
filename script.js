let passwordLength = 8;
let isUpperCase = false;
let isNumbers = false;
let isSymbols = false;
const history = [];

// Elements
const passwordRangeInputEl = document.getElementById("passRangeInput");
const passRangeValueEl = document.getElementById("passRangeValue");
const genBtn = document.getElementById("genBtn");
const passwordEl = document.getElementById("generatedPassword");
const visibilityToggle = document.getElementById("visibilityToggle");
const copyNotification = document.getElementById("copyNotification");
const strengthBar = document.getElementById("strengthBar");
const strengthTooltip = document.getElementById("strengthTooltip");
const historyList = document.getElementById("historyList");

// Generate Password
function generatePassword(length) {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = isUpperCase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
  const numbers = isNumbers ? "0123456789" : "";
  const symbols = isSymbols ? "!@#$%^&*()_+" : "";
  const charSet = lowerCase + upperCase + numbers + symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return password;
}

// Update Password Strength
function updateStrengthMeter() {
  let strength = 0;
  if (passwordLength >= 8) strength++;
  if (isUpperCase) strength++;
  if (isNumbers) strength++;
  if (isSymbols) strength++;

  if (strength === 1) {
    strengthBar.style.width = "25%";
    strengthBar.style.backgroundColor = "var(--weak)";
    strengthTooltip.textContent = "Weak";
  } else if (strength === 2 || strength === 3) {
    strengthBar.style.width = "50%";
    strengthBar.style.backgroundColor = "var(--medium)";
    strengthTooltip.textContent = "Medium";
  } else if (strength === 4) {
    strengthBar.style.width = "100%";
    strengthBar.style.backgroundColor = "var(--strong)";
    strengthTooltip.textContent = "Strong";
  }
}

// Save to History
function saveToHistory(password) {
  if (history.length >= 5) history.shift(); // Remove oldest password
  history.push(password);

  // Update UI
  const historyItems = history.map(
    (pass) => `<li>${pass}</li>`
  );
  historyList.innerHTML = historyItems.join("");
}

// Handle Password Generation
genBtn.addEventListener("click", () => {
  const newPassword = generatePassword(passwordLength);
  passwordEl.value = newPassword;
  saveToHistory(newPassword);
  updateStrengthMeter();
});

// Handle Visibility Toggle
visibilityToggle.addEventListener("click", () => {
  const isHidden = passwordEl.getAttribute("type") === "password";
  passwordEl.setAttribute("type", isHidden ? "text" : "password");
  visibilityToggle.className = isHidden ? "fa fa-eye" : "fa fa-eye-slash";
});

// Handle Copy to Clipboard
passwordEl.addEventListener("click", () => {
  passwordEl.select();
  document.execCommand("copy");

  // Show Copy Notification
  copyNotification.style.display = "block";
  setTimeout(() => {
    copyNotification.style.display = "none";
  }, 2000);
});

// Range Input Handling
passwordRangeInputEl.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  passRangeValueEl.textContent = passwordLength;
});

// Checkbox Handling
document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    const id = e.target.id;
    if (id === "uppercase") isUpperCase = e.target.checked;
    if (id === "numbers") isNumbers = e.target.checked;
    if (id === "symbols") isSymbols = e.target.checked;

    updateStrengthMeter();
    genBtn.disabled = !(
      isUpperCase || isNumbers || isSymbols
    );
  });
});
