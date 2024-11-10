// src/firebase.js
import { initializeApp } from 'firebase/app';
// const { initializeApp } = require('firebase/app');
// const { getFirestore } = require('firebase/firestore');
// const { getAuth } = require('firebase/auth');
// const { getAnalytics } = require('firebase/analytics');
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9DReeFB9oTmPdT6JRVxyny9OEw9Pyboc",
  authDomain: "healthgpt-3a5a9.firebaseapp.com",
  projectId: "healthgpt-3a5a9",
  storageBucket: "healthgpt-3a5a9.appspot.com",
  messagingSenderId: "927840824384",
  appId: "1:927840824384:web:49efc16ca1dda98f9183a5",
  measurementId: "G-YKPT5WNXFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
// module.exports = { app, auth, db, analytics };

export { app, auth, db, analytics };
