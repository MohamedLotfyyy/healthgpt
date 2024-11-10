// src/components/DoctorDashboard.js
import React, { useEffect, useState } from 'react';
import { fetchOpenConsultations, respondToConsultation } from '../services/consultationServices';
import { auth } from '../firebase';

const DoctorDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [response, setResponse] = useState('');
  const [disease, setDisease] = useState('');
  const [medication, setMedication] = useState('');

  useEffect(() => {
    const loadConsultations = async () => {
      const openConsultations = await fetchOpenConsultations();
      setConsultations(openConsultations);
    };
    loadConsultations();
  }, []);

  const handleResponseSubmit = async (consultationId) => {
    const doctorId = auth.currentUser.uid;
    await respondToConsultation(consultationId, doctorId, response, disease, medication);
    alert('Response sent!');
    setConsultations(consultations.filter(c => c.id !== consultationId));
    setSelectedConsultation(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Open Consultations</h2>
      {consultations.length > 0 ? (
        consultations.map((consultation) => (
          <div key={consultation.id} style={styles.consultationCard}>
            <p style={styles.consultationText}>
              <strong>Symptoms:</strong> {consultation.symptoms.join(', ')}
            </p>
            <button style={styles.respondButton} onClick={() => setSelectedConsultation(consultation)}>
              Respond
            </button>
          </div>
        ))
      ) : (
        <p style={styles.noConsultations}>No open consultations at the moment.</p>
      )}

      {selectedConsultation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <h3 style={styles.modalTitle}>Respond to Consultation</h3>
            {/* Close Button */}
            <button onClick={() => setSelectedConsultation(null)} style={styles.closeButton}>×</button>
            <p style={styles.consultationDetails}><strong>Symptoms:</strong> {selectedConsultation.symptoms.join(', ')}</p>
            <textarea
              placeholder="Please Type your Response to Patient"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              style={styles.textarea}
            />
            <input
              type="text"
              placeholder="Disease"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Medication"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              style={styles.input}
            />
            <button style={styles.submitButton} onClick={() => handleResponseSubmit(selectedConsultation.id)}>
              Submit Response
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
container: {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
},
title: {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '20px',
  color: '#333',
},
consultationCard: {
  padding: '15px',
  backgroundColor: '#f9f9fb',
  borderRadius: '10px',
  border: '1px solid #ddd',
  marginBottom: '15px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
},
consultationText: {
  fontSize: '16px',
  color: '#333',
},
respondButton: {
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid #007bff',
  backgroundColor: '#007bff',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
},
noConsultations: {
  textAlign: 'center',
  fontSize: '18px',
  color: '#666',
},
modalOverlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
modalContainer: {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  width: '500px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
},
closeButton: {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#999',
},
modalTitle: {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#333',
},
consultationDetails: {
  fontSize: '16px',
  color: '#333',
  marginBottom: '15px',
  width: '100%',
},
textarea: {
  width: '100%',
  height: '100px',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '16px',
},
input: {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '16px',
},
submitButton: {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
},
};

export default DoctorDashboard;
