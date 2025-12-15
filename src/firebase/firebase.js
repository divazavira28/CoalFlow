// ===============================
// Firebase Front-End Initialization
// ===============================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ===============================
// Firebase Config (from Firebase Console)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyCeDxr59O8gXOoqcXcV3lGwmzO7ECI0zgA",
  authDomain: "coalflow-3e3fc.firebaseapp.com",
  projectId: "coalflow-3e3fc",
  storageBucket: "coalflow-3e3fc.firebasestorage.app",
  messagingSenderId: "888781945080",
  appId: "1:888781945080:web:ff0ef04fcc3b227bcb230d",
  measurementId: "G-LLQ3GY6CWZ"
};

// ===============================
// Initialize Firebase App
// ===============================
const app = initializeApp(firebaseConfig);

// ===============================
// Export Firebase Services
// ===============================
export const auth = getAuth(app);         // Authentication
export const db = getFirestore(app);      // Firestore Database
export const storage = getStorage(app);   // Storage (optional)

export default app;
