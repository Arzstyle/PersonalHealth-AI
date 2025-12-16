import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8zgSg8rQvFDUwu63IiOoThOoTaJWEUeo",
  authDomain: "personalhealth-ai.firebaseapp.com",
  projectId: "personalhealth-ai",
  storageBucket: "personalhealth-ai.firebasestorage.app",
  messagingSenderId: "739718156784",
  appId: "1:739718156784:web:9547b61ff2b12559108d35",
  measurementId: "G-C0F94T3MG4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};
