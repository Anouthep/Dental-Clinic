// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBFOXp0r39ZnX4kPlUTKPTxn-JiOpA-dk",
  authDomain: "tableonline-a80a0.firebaseapp.com",
  projectId: "tableonline-a80a0",
  storageBucket: "tableonline-a80a0.appspot.com",
  messagingSenderId: "747010849075",
  appId: "1:747010849075:web:60ae1f1f8c701b8811e646",
  measurementId: "G-20XRM3NXR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export const storage = getStorage(app);

export const auth = getAuth(app);
export default app;
export { db };