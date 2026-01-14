import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
<<<<<<< HEAD
  apiKey: "AIzaSyA8zgSg8rQvFDUwu63IiOoThOoTaJWEUeo",
  authDomain: "personalhealth-ai.firebaseapp.com",
  projectId: "personalhealth-ai",
  storageBucket: "personalhealth-ai.firebasestorage.app",
  messagingSenderId: "739718156784",
  appId: "1:739718156784:web:9547b61ff2b12559108d35",
  measurementId: "G-C0F94T3MG4",
=======
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
>>>>>>> 8aaccfdcafabe2d66f1b9f88d0e3b21248ebc6f9
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
