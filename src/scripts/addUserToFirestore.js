import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyBJ-pAL1MrTXNooYB2UFDOygvOjGhXQQHU",
    authDomain: "talenteer-leave-app.firebaseapp.com",
    projectId: "talenteer-leave-app",
    storageBucket: "talenteer-leave-app.firebasestorage.app",
    messagingSenderId: "562318351721",
    appId: "1:562318351721:web:5877020fbfd572c944f1f8",
    measurementId: "G-1F6JLPN0X5"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firebase Authentication'dan alınan kullanıcı ID'si
const USER_ID = "7RPAghPzSfcSpeHXuEA7m2zxqxB2";

const addUserToFirestore = async () => {
    try {
        await setDoc(doc(db, 'users', USER_ID), {
            email: "demirbaha628@gmail.com",
            name: "Bahar Demir",
            role: "hr", // veya "employee" olarak değiştirebilirsiniz
            department: "İK",
            position: "İK Uzmanı",
            hire_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
        });

        console.log('Kullanıcı Firestore\'a başarıyla eklendi!');
    } catch (error) {
        console.error('Hata:', error);
    }
};

addUserToFirestore(); 