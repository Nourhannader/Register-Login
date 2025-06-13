// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBrvUtGT5f1zJc9cuXlo-jwMNDrDQ8Q_Kc",
//   authDomain: "login-test-7e335.firebaseapp.com",
//   projectId: "login-test-7e335",
//   storageBucket: "login-test-7e335.firebasestorage.app",
//   messagingSenderId: "942885424114",
//   appId: "1:942885424114:web:8a8a160ce515ca411eb96b"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


const firebaseConfig = {
  apiKey: "AIzaSyBrvUtGT5f1zJc9cuXlo-jwMNDrDQ8Q_Kc",
  authDomain: "login-test-7e335.firebaseapp.com",
  projectId: "login-test-7e335",
  appId: "1:942885424114:web:8a8a160ce515ca411eb96b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google login
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      alert("Google: " + user.displayName);
    })
    .catch(console.error);
}
//github login
function loginWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      alert("Welcome, " + user.displayName);
      console.log("GitHub user:", user);
    })
    .catch(error => {
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("This email is already linked with a different login provider. Try logging in with Google instead.");
      } else {
        console.error("GitHub login error:", error);
      }
    });
}

const wrapper = document.querySelector(".wrapper");
const signUpLink = document.querySelector(".signUp-link");
const signInLink = document.querySelector(".signIn-link");
let registerField = document.querySelectorAll(".sign-up input");
let passwordCheckList = document.querySelector(".password-checklist");
let userNameInpReg = registerField[0];
let emailInpReg = registerField[1];
let passwordInpReg = registerField[2];
let listItem = document.querySelectorAll(".list-item");
let regBtn = document.querySelector(".sign-up button");
let errorMsgReg = document.querySelectorAll(".sign-up .error-msg");
let users = [];
users = JSON.parse(localStorage.getItem("userlist")) || [];
console.log(errorMsgReg);

signUpLink.addEventListener("click", () => {
  wrapper.classList.add("animate-signIn");
  wrapper.classList.remove("animate-signUp");
});
signInLink.addEventListener("click", () => {
  wrapper.classList.add("animate-signUp");
  wrapper.classList.remove("animate-signIn");
});

// validation  in register
regBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Log validation result for debugging
  const isValid = validatedRegData();
  console.log("Form Validated:", isValid);

  if (isValid) {
    storeData();

    Swal.fire({
      title: "Saved!",
      icon: "success",
      draggable: true,
      text: "Your registration has been successfully saved.",
      showClass: {
        popup: "animate__animated animate__fadeIn animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut animate__faster",
      },
    }).then(() => {
      redirect();
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong! Please check your inputs.",
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    });
  }
});

function redirect() {
  wrapper.classList.add("animate-signIn");
  wrapper.classList.remove("animate-signUp");
}
//store data in localstorage
function storeData() {
  let user = {
    name: userNameInpReg.value,
    email: emailInpReg.value,
    password: passwordInpReg.value,
  };
  users.push(user);
  localStorage.setItem("userlist", JSON.stringify(users));
}

function validatedRegData() {
  const usernameResult = validationUserName();
  const isUserNameValid = usernameResult.valid;
  const emailResult = validationEmail();
  const isEmailValid = emailResult.valid;

  // Clear all previous error messages first
  errorMsgReg[0].textContent = "";
  errorMsgReg[1].textContent = "";
  errorMsgReg[2].textContent = "";

  if (isUserNameValid && isEmailValid && validPassword) {
    return true;
  }

  if (!isUserNameValid) {
    errorMsgReg[0].textContent = usernameResult.message;
  }
  if (!isEmailValid) {
    errorMsgReg[1].textContent = emailResult.message;
  }
  if (!validPassword) {
    errorMsgReg[2].textContent = "Invalid password";
  }

  return false;
}

//valid username
function validationUserName() {
  let username = userNameInpReg.value.trim();
  const pattern = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;

  if (!username) {
    return { valid: false, message: "Username is required." };
  }

  if (!pattern.test(username)) {
    return {
      valid: false,
      message:
        "Username must start with a letter and be 3-16 characters long. Only letters, numbers, and underscores are allowed.",
    };
  }

  return { valid: true };
}

//validation Email
function validationEmail() {
  let email = emailInpReg.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    return { valid: false, message: "Invalid email format." };
  }

  const isExist = users.some((user) => user.email === email);
  if (isExist) {
    return { valid: false, message: "Email already exists." };
  }

  return { valid: true };
}

//valid password
let validPassword = false;
const validationRegxPass = [
  { regex: /.{8,}/ },
  { regex: /[0-9]/ },
  { regex: /[a-z]/ },
  { regex: /[A-Z]/ },
  { regex: /[^A-Za-z0-9]/ },
];

passwordInpReg.addEventListener("keyup", () => {
  const passwordValue = passwordInpReg.value;
  validPassword = true;

  validationRegxPass.forEach((item, i) => {
    const isValid = item.regex.test(passwordValue);
    if (isValid) {
      listItem[i].classList.add("checked");
    } else {
      listItem[i].classList.remove("checked");
      validPassword = false;
    }
  });
});

//when login

let logInField = document.querySelectorAll(".sign-in input");
let errorMsgLog = document.querySelectorAll(".sign-in .error-msg");
let userNameLogIn = logInField[0];
let passwordLogIn = logInField[1];
let logInBtn = document.querySelector(".sign-in button");

logInBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const isValid = isExistData();
  if (isValid) {
    Swal.fire({
      title: `Welcome ${userNameLogIn.value}`,
      icon: "success",
      draggable: true,
      text: "Your login has been successfully ",
      showClass: {
        popup: "animate__animated animate__fadeIn animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut animate__faster",
      },
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong! Please check your inputs or you don't have account",
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    });
  }
});

function isExistData() {
  // Clear all previous error messages first
  errorMsgLog[0].textContent = "";
  errorMsgLog[1].textContent = "";

  if (isExistUserName() && isExistPassword()) {
    return true;
  }
  if (!isExistUserName()) {
    errorMsgLog[0].textContent = "you don't have account";
  }
  if (!isExistPassword()) {
    errorMsgLog[1].textContent = "password wrong";
  }

  return false;
}

function isExistUserName() {
  let userName = userNameLogIn.value;
  let isExist = users.some((user) => user.name === userName);
  return isExist;
}
function isExistPassword() {
  let password = passwordLogIn.value;
  let isExist = users.some((user) => user.password === password);
  return isExist;
}
