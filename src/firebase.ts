import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase setup =======================================
const config = {
    apiKey: "AIzaSyAnlTaJufGESWh80ttA3C5s9ouyIw1J-1E",
    authDomain: "wholecup-72a6b.firebaseapp.com",
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
    projectId: "wholecup-72a6b",
    storageBucket: "wholecup-72a6b.appspot.com",
    messagingSenderId: "51118699872",
};
export const app = initializeApp(config);

// Firestore setup ======================================
export const db = getFirestore();

// Authentication setup =================================
export const googleAUthProvider = new GoogleAuthProvider();
