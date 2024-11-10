import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db, auth } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { fetchUserClosedConsultations } from '../services/consultationServices';

const symptomsList = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
    'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
    'vomiting', 'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain', 
];

const User = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSymptoms, setFilteredSymptoms] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [closedConsultations, setClosedConsultations] = useState([]);  // Holds closed consultations
    const [conversationCount, setConversationCount] = useState(1);
    const [showDoctorOption, setShowDoctorOption] = useState(false);
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [medicalHistory, setMedicalHistory] = useState('');

    useEffect(() => {
        const loadClosedConsultations = async () => {
            if (auth.currentUser) {
                const consultations = await fetchUserClosedConsultations(auth.currentUser.uid);
                setClosedConsultations(consultations);
            }
        };

        loadClosedConsultations();
    }, []);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term) {
            setFilteredSymptoms(symptomsList.filter(symptom =>
                symptom.toLowerCase().includes(term.toLowerCase()) &&
                !selectedSymptoms.includes(symptom)
            ));
        } else {
            setFilteredSymptoms([]);
        }
    };

    const addSymptom = (symptom) => {
        if (!selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
            if (selectedSymptoms.length + 1 >= 3) {
                setShowDoctorOption(true);
            }
        }
        setSearchTerm('');
        setFilteredSymptoms([]);
    };

    const removeSymptom = (symptom) => {
        const updatedSymptoms = selectedSymptoms.filter(s => s !== symptom);
        setSelectedSymptoms(updatedSymptoms);
        if (updatedSymptoms.length < 3) {
            setShowDoctorOption(false);
        }
    };

    const handleGetPrediction = async () => {
        try {
            const response = await axios.post('http://localhost:3000/get_advice', {
                symptoms: selectedSymptoms,
            });
            const advice = response.data.advice;

            setConversations([
                {
                    id: conversationCount,
                    userSymptoms: selectedSymptoms.join(', '),
                    gptResponse: advice,
                },
                ...conversations,
            ]);
            setConversationCount(conversationCount + 1);

        } catch (error) {
            console.error("Error getting prediction:", error);
        }
    };

    const handleSendToDoctor = () => {
        setShowDoctorForm(true);
    };

    const handleSubmitToDoctor = async () => {
        if (!auth.currentUser) {
            alert("You need to be logged in to submit a consultation.");
            return;
        }
    
        try {
            await addDoc(collection(db, 'consultations'), {
                userId: auth.currentUser.uid,
                symptoms: selectedSymptoms,
                medicalHistory: medicalHistory,
                lastConversation: conversations[0]?.gptResponse || "",
                status: 'pending',
                createdAt: serverTimestamp(),
            });
    
            alert('Data sent to the health professional successfully.');
            setShowDoctorForm(false);
            setMedicalHistory('');
        } catch (error) {
            console.error("Error sending to doctor:", error);
            alert("Failed to send data to the health professional.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Symptom Checker</h2>

            {/* Search and Submit Section */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search symptoms..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={styles.searchInput}
                />
                <button onClick={handleGetPrediction} style={styles.submitButton}>Submit</button>
            </div>

            {/* Display Filtered Symptoms for Selection */}
            {filteredSymptoms.length > 0 && (
                <div style={styles.filteredSymptomsContainer}>
                    {filteredSymptoms.map((symptom, index) => (
                        <div
                            key={index}
                            onClick={() => addSymptom(symptom)}
                            style={styles.filteredSymptom}
                        >
                            {symptom.replace(/_/g, ' ')}
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Symptoms Display */}
            <div style={styles.chipContainer}>
                {selectedSymptoms.map((symptom, index) => (
                    <div key={index} style={styles.chip}>
                        <span style={styles.chipText}>{symptom.replace(/_/g, ' ')}</span>
                        <button onClick={() => removeSymptom(symptom)} style={styles.chipCloseButton}>×</button>
                    </div>
                ))}
            </div>

            {/* Display Closed Consultations */}
            {closedConsultations.length > 0 && (
                <div style={styles.consultationResponseContainer}>
                    <h3 style={styles.consultationTitle}>Your Closed Consultations</h3>
                    {closedConsultations.map((consultation) => (
                        <div key={consultation.id} style={styles.consultationItem}>
                            <p><strong>Symptoms:</strong> {consultation.symptoms.join(', ')}</p>
                            <p><strong>Diagnosis:</strong> {consultation.disease}</p>
                            <p><strong>Medication:</strong> {consultation.medication}</p>
                            <p><strong>Doctor’s Notes:</strong> {consultation.response}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9fb',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    searchInput: {
        flex: 1,
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ddd',
        outline: 'none',
        fontSize: '16px',
    },
    submitButton: {
        marginLeft: '10px',
        padding: '10px 20px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: '#4a90e2',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    filteredSymptomsContainer: {
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: '#fff',
    },
    filteredSymptom: {
        padding: '5px 0',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#333',
        borderBottom: '1px solid #ddd',
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
    },
    chip: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#e0e7ff',
        borderRadius: '16px',
        padding: '5px 10px',
        border: '1px solid #c4c9f0',
    },
    chipText: {
        marginRight: '5px',
        color: '#4a4a9a',
    },
    chipCloseButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#4a4a9a',
        fontSize: '16px',
        cursor: 'pointer',
    },
    consultationResponseContainer: {
        padding: '20px',
        backgroundColor: '#e9f7ef',
        borderRadius: '10px',
        border: '1px solid #c3e6cb',
        marginTop: '20px',
        color: '#2a623d',
    },
    consultationTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#155724',
    },
    consultationItem: {
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: '1px solid #ddd',
        color: '#333',  
        marginTop: '10px',
    },
};

export default User;
