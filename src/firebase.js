// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWQu-H3fXG4C3djbd0YwmgIExnaxU8d3g",
    authDomain: "kombat-c1f13.firebaseapp.com",
    projectId: "kombat-c1f13",
    storageBucket: "kombat-c1f13.appspot.com",
    messagingSenderId: "819689626667",
    appId: "1:819689626667:web:cd3e697d4b765805cf5e6e",
    measurementId: "G-RSBHKS27GT"
};

let app;
let db;

try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized:", app);

    // Initialize Firestore
    db = getFirestore(app);
    console.log("Firestore initialized:", db);
} catch (error) {
    console.error("Error initializing Firebase or Firestore:", error);
}

export { db };
