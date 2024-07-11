const inputSlider = document.querySelector("[data-LengthSlider]");
const lengthDisplay = document.querySelector("[dataLengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[dataCopyMsg]");
const copyBtn = document.querySelector("[copyBtn]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const Indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//  set color Indicator
setIndicator("#ccc");

// set password Length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  Indicator.style.backgroundColor = color;
  Indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRanNumber() {
  return getRandInteger(0, 9);
}

function generateRandLowercase() {
  return String.fromCharCode(getRandInteger(97, 122));
}
function generateRandUppercase() {
  return String.fromCharCode(getRandInteger(65, 91));
}

function generateSymbol() {
  const symbols = "!@#$%^&*()_+~`|}{[]:";
  const randNum = getRandInteger(0, symbols.length);

  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
    console.log(e);
  }
  // Copy msg vala Span ke Liye
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 950);
}

function shufflePassword(array) {
  // Fisher Yate Method
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  //Special Case
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  // none of the checkbox are selected
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //Lets Start to find New Password

  //remove old password
  password = "";
  // let's put the checkbox mentioned
  // if (uppercaseCheck.checked) {
  //   password += generateRandUppercase();
  // }
  // if (lowercaseCheck.checked) {
  //   password += generateRandLowercase();
  // }
  // if (numbersCheck.checked) {
  //   password += generateRanNumber();
  // }
  // if (symbolsCheck.checked) {
  //   password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck && uppercaseCheck.checked) {
    funcArr.push(generateRandUppercase);
  }
  if (lowercaseCheck && lowercaseCheck.checked) {
    funcArr.push(generateRandLowercase);
  }
  if (numbersCheck && numbersCheck.checked) {
    funcArr.push(generateRanNumber);
  }
  if (symbolsCheck && symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }
  // Compulsory Addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Remaining Addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle The Password
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;
  //calculate Strength Function call for Strength
  calcStrength();
});
