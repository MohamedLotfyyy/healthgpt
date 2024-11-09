import React from 'react';
import './App.css';
import User from './components/user'; // Make sure this path is correct

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Health Diagnosis</h1>
        <User /> {/* This will display the symptom selection component */}
      </header>
    </div>
  );
}

export default App;
