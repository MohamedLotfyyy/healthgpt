import React, { useState } from 'react';
import axios from 'axios';

const symptomsList = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
    'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
    'vomiting', 'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain', 
    // add more symptoms here
];

const User = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSymptoms, setFilteredSymptoms] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [conversationCount, setConversationCount] = useState(1);
    const [showDoctorOption, setShowDoctorOption] = useState(false);
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [medicalHistory, setMedicalHistory] = useState('');
    const [file, setFile] = useState(null);

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
        const formData = new FormData();
        formData.append('symptoms', JSON.stringify(selectedSymptoms));
        formData.append('medicalHistory', medicalHistory);
        if (file) {
            formData.append('file', file);
        }

        try {
            await axios.post('http://localhost:3000/send_to_doctor', formData);
            alert('Data sent to the health professional successfully.');
            setShowDoctorForm(false);
            setMedicalHistory('');
            setFile(null);
        } catch (error) {
            console.error("Error sending to doctor:", error);
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

            {/* Display Conversations in Reverse Order */}
            <div>
                <h3 style={styles.conversationTitle}>Conversation:</h3>
                {conversations.map((conv) => (
                    <div key={conv.id} style={styles.conversationContainer}>
                        <p style={styles.conversationEntry}>
                            <strong>Conversation {conv.id} - User:</strong> Symptoms: {conv.userSymptoms}
                        </p>
                        <p style={styles.conversationEntry}>
                            <strong>Conversation {conv.id} - ChatGPT:</strong> {conv.gptResponse}
                        </p>
                        {showDoctorOption && conv.id === conversationCount - 1 && (
                            <p style={styles.conversationEntry}>
                                Would you like us to send our conversation and your symptoms to a doctor?&nbsp;
                                <button onClick={handleSendToDoctor} style={styles.sendButton}>Yes</button>
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Doctor Form Modal */}
            {showDoctorForm && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContainer}>
                        <button onClick={() => setShowDoctorForm(false)} style={styles.closeButton}>×</button>
                        <h3 style={styles.modalHeader}>Send to Doctor</h3>
                        <div style={styles.modalContent}>
                            <p><strong>Symptoms:</strong> {conversations[0]?.userSymptoms}</p>
                            <p><strong>Advice:</strong> {conversations[0]?.gptResponse}</p>
                        </div>
                        <textarea
                            value={medicalHistory}
                            onChange={(e) => setMedicalHistory(e.target.value)}
                            placeholder="Enter any relevant medical history..."
                            style={styles.textArea}
                        />
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={styles.fileInput}
                        />
                        <button onClick={handleSubmitToDoctor} style={styles.submitButton}>Submit to Doctor</button>
                    </div>
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
    conversationContainer: {
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: '1px solid #ddd',
        color: '#333',  
        marginTop: '10px',
    },
    conversationTitle: {
        color: '#4a90e2',
        fontSize: '18px',
        marginBottom: '10px',
    },
    conversationEntry: {
        marginBottom: '10px',
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#333',
    },
    sendButton: {
        padding: '8px 16px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#4caf50',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
    },
    modalHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
    },
    modalContent: {
        marginBottom: '10px',
        color: '#333',
        overflowY: 'auto',
        maxHeight: '150px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
    },
    textArea: {
        width: '100%',
        height: '100px',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    fileInput: {
        marginBottom: '10px',
    },
};

export default User;
