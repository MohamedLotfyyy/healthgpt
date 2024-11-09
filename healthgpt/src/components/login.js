// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../services/authServices.js';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (userData.username.startsWith('Dr')) {
        window.location.href = '/doctor-dashboard';
      } else {
        window.location.href = '/user';
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>

        <div style={styles.registerLink}>
          Don't have an account? <a href="/register" style={styles.link}>Register</a>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f6f8',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333333',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    backgroundColor: '#4a90e2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  registerLink: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;
