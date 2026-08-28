import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCK6BM77Ts_yo4lOHBQhkluAPQhdEsYaOI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shree-58fb6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shree-58fb6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shree-58fb6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "785300135962",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:785300135962:web:1d9ebf6332375986e2b1a3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-L06ZXY7185"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Analytics support check
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional in non-supported environments
  });
}

export { app, db, auth, analytics, firebaseConfig };
