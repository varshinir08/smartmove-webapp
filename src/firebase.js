
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCqTl_-j9_Hx6ksmmLxnjpo-8V9cC4Ek5w",
  authDomain: "smartmoveweb-fdcc0.firebaseapp.com",
  projectId: "smartmoveweb-fdcc0",
  storageBucket: "smartmoveweb-fdcc0.firebasestorage.app",
  messagingSenderId: "313707537235",
  appId: "1:313707537235:web:d7bde1a50b4c79c90537a6",
  measurementId: "G-9FFMFYDKQM"
};
 
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);