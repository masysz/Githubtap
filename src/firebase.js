// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCssFBeOEa2JHUbxM3IAaZv9K3c3bktXfA",
  authDomain: "apecomtest.firebaseapp.com",
  projectId: "apecomtest",
  storageBucket: "apecomtest.appspot.com",
  messagingSenderId: "613346686609",
  appId: "1:613346686609:web:c8e9e8bbd56edf0c403130"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);

export { db };
