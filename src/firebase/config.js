// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ-pAL1MrTXNooYB2UFDOygvOjGhXQQHU",
  authDomain: "talenteer-leave-app.firebaseapp.com",
  projectId: "talenteer-leave-app",
  storageBucket: "talenteer-leave-app.appspot.com",
  messagingSenderId: "562318351721",
  appId: "1:562318351721:web:5877020fbfd572c944f1f8",
  measurementId: "G-1F6JLPN0X5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase authentication
const auth = getAuth(app);

export { auth };
