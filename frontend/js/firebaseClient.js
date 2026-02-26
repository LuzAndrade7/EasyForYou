// Firebase Client Configuration - EAS for you
// Configuración para Firebase Auth y Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0xnnT54KjEKvxNmkIga7KJlARHUjhrb4",
  authDomain: "easforyou-1047b.firebaseapp.com",
  projectId: "easforyou-1047b",
  storageBucket: "easforyou-1047b.firebasestorage.app",
  messagingSenderId: "951188603429",
  appId: "1:951188603429:web:752ed3ca362341401275cc",
  measurementId: "G-HQ3PFY01PG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services and make them globally available
window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();

// Optional: Initialize Analytics (only in production)
if (typeof firebase.analytics === 'function') {
  try {
    window.firebaseAnalytics = firebase.analytics();
  } catch (e) {
    console.log("Analytics not available in this environment");
  }
}

console.log("Firebase initialized:", window.firebaseAuth ? "Auth OK" : "Auth FAILED", window.firebaseDb ? "Firestore OK" : "Firestore FAILED");
