// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-f50f4.firebaseapp.com",
  projectId: "cortexai-f50f4",
  storageBucket: "cortexai-f50f4.firebasestorage.app",
  messagingSenderId: "27816593592",
  appId: "1:27816593592:web:6f7e4475e7ed865766cc4d",
  measurementId: "G-0VWH7LFC81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()