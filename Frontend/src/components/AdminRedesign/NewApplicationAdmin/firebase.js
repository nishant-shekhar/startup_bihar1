// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm73JDZ6rwaVbR-cldecyZB39UpewgYh8",
  authDomain: "startupbihar2.firebaseapp.com",
  databaseURL: "https://startupbihar2-default-rtdb.firebaseio.com",
  projectId: "startupbihar2",
  storageBucket: "startupbihar2.firebasestorage.app",
  messagingSenderId: "974234451361",
  appId: "1:974234451361:web:8e84862c2a9bae15b51fe0",
  measurementId: "G-M0QK5ZVYPS"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const rtdb = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;