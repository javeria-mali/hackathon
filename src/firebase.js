// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; 


const firebaseConfig = {
  apiKey: "AIzaSyDpXGarnWbC28nsjn0OnIJNpSSlVpX3WMQ",
  authDomain: "first-class-7d9a7.firebaseapp.com",
  projectId: "first-class-7d9a7",
  storageBucket: "first-class-7d9a7.firebasestorage.app",
  messagingSenderId: "945925011345",
  appId: "1:945925011345:web:b4855cc41ee73e79a6cc30",
  measurementId: "G-4DL9ZM6ZT3"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
