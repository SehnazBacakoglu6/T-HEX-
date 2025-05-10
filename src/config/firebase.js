// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ-pAL1MrTXNooYB2UFDOygvOjGhXQQHU",
    authDomain: "talenteer-leave-app.firebaseapp.com",
    projectId: "talenteer-leave-app",
    storageBucket: "talenteer-leave-app.firebasestorage.app",
    messagingSenderId: "562318351721",
    appId: "1:562318351721:web:5877020fbfd572c944f1f8",
    measurementId: "G-1F6JLPN0X5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions }; 