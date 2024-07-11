// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAholmqgjpCJ1aTn6xUex5n8D7NffgKOuk",
  authDomain: "tete-93fd0.firebaseapp.com",
  projectId: "tete-93fd0",
  storageBucket: "tete-93fd0.appspot.com",
  messagingSenderId: "608000462822",
  appId: "1:608000462822:web:95e1de530288a5f9025027"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);

export { db };
