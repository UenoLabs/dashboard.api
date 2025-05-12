// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8Hef49puUGJWDYSxZtLT229QmTcn5IdE",
  authDomain: "myfred-2b59a.firebaseapp.com",
  projectId: "myfred-2b59a",
  storageBucket: "myfred-2b59a.appspot.com",
  messagingSenderId: "1047382909939",
  appId: "1:1047382909939:web:15dad7fa243dda7918e886",
  measurementId: "G-51WR35EQ2Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);