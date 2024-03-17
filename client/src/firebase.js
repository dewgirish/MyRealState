// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realstate-merm.firebaseapp.com",
  projectId: "realstate-merm",
  storageBucket: "realstate-merm.appspot.com",
  messagingSenderId: "284763535649",
  appId: "1:284763535649:web:361af4dbe56f691c756660"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);