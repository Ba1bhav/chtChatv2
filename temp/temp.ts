// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9Du2K1GUtGhD-MnODhxNxiDgZVP_OxjI",
  authDomain: "chitchatv2-f816e.firebaseapp.com",
  databaseURL: "https://chitchatv2-f816e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chitchatv2-f816e",
  storageBucket: "chitchatv2-f816e.appspot.com",
  messagingSenderId: "1093034790456",
  appId: "1:1093034790456:web:331d0a3060bc9bfef320cd",
  measurementId: "G-FTQV32SJFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
