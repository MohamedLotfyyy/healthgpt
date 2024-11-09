// src/components/Register.js
import React, { useState } from 'react';
import { register } from '../services/authServices.js';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = username.startsWith('Dr') ? 'doctor' : 'user';
      const user = await register(email, password, username, role);
      console.log('Registered:', user);
      
      if (role === 'doctor') {
        window.location.href = '/doctor-dashboard';
      } else {
        window.location.href = '/user';
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Create an Account</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input
          type="text"
          placeholder="Username (use 'Dr' prefix if registering as a doctor)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        
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
        
        <button type="submit" style={styles.button}>Register</button>
        
        <p style={styles.loginLink}>
          Already have an account? <a href="/login" style={styles.link}>Log in</a>
        </p>
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
  loginLink: {
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

export default Register;
