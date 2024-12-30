// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzUS4_jtjkCRTmX0aIoZHYWSr6JGR7Zig",
  authDomain: "nyauke-portfolio.firebaseapp.com",
  projectId: "nyauke-portfolio",
  storageBucket: "nyauke-portfolio.firebasestorage.app",
  messagingSenderId: "659202765536",
  appId: "1:659202765536:web:42443b67c3e2c27ad61685",
  measurementId: "G-GY91P3Y0Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export {db, auth}