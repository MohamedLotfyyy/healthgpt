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
    <div>
      <h2>Open Consultations</h2>
      {consultations.length > 0 ? (
        consultations.map((consultation) => (
          <div key={consultation.id}>
            <p><strong>Symptoms:</strong> {consultation.symptoms.join(', ')}</p>
            <button onClick={() => setSelectedConsultation(consultation)}>Respond</button>
          </div>
        ))
      ) : (
        <p>No open consultations at the moment.</p>
      )}

      {selectedConsultation && (
        <div>
          <h3>Respond to Consultation</h3>
          <p><strong>Symptoms:</strong> {selectedConsultation.symptoms.join(', ')}</p>
          <textarea
            placeholder="Enter your response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <input
            type="text"
            placeholder="Disease"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />
          <input
            type="text"
            placeholder="Medication"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
          />
          <button onClick={() => handleResponseSubmit(selectedConsultation.id)}>Submit Response</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
