// src/services/authService.js
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../firebase.js';


const db = getFirestore(app);
export const register = async (email, password, username, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Set displayName as username
    await updateProfile(user, { displayName: username });
  
    // Store user info in Firestore with role
    await setDoc(doc(db, 'users', user.uid), {
      email,
      username,
      role,
    });
  
    return user;
  };
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
