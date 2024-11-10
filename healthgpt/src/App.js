// import React from 'react';
// import './App.css';
// import User from './components/user'; // Make sure this path is correct

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Health Diagnosis</h1>
//         <User /> {/* This will display the symptom selection component */}
//       </header>
//     </div>
//   );
// }

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register.js';
import Login from './components/login.js';
import User from './components/user';
import DoctorDashboard from './components/doctor.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} /> {/* Redirect to login by default */}
      </Routes>
    </Router>
  );
}

export default App;
