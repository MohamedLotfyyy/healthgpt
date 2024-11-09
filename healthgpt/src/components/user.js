// import React, { useState } from 'react';
// import axios from 'axios';

// const symptoms = [
//     'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
//     'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
//     'vomiting', 'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain', 'anxiety',
//     'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 
//     'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 
//     'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 
//     'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 
//     'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 
//     'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 
//     'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 
//     'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 
//     'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 
//     'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 
//     'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 
//     'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 
//     'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 
//     'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 
//     'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 
//     'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 
//     'foul_smell_of_urine', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 
//     'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 
//     'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic_patches', 
//     'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 
//     'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 
//     'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 
//     'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum', 
//     'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 
//     'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 
//     'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
// ];

// const User = () => {
//     const [selectedSymptoms, setSelectedSymptoms] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredSymptoms, setFilteredSymptoms] = useState([]);
//     const [conditions, setConditions] = useState([]); // For storing possible conditions
//     const [advice, setAdvice] = useState('');         // For storing health advice
  
//     // Update search term and filter symptoms
//     const handleSearchChange = (event) => {
//       const term = event.target.value;
//       setSearchTerm(term);
  
//       if (term) {
//         setFilteredSymptoms(symptoms.filter(symptom =>
//           symptom.toLowerCase().includes(term.toLowerCase())
//         ));
//       } else {
//         setFilteredSymptoms([]);
//       }
//     };
  
//     // Add symptom to selectedSymptoms and clear the search
//     const addSymptom = (symptom) => {
//       if (!selectedSymptoms.includes(symptom)) {
//         setSelectedSymptoms([...selectedSymptoms, symptom]);
//       }
//       setSearchTerm(''); // Clear search term after adding
//       setFilteredSymptoms([]); // Clear filtered symptoms
//     };
  
//     // Handle form submission to get conditions and advice
//     const handleSubmit = async (event) => {
//       event.preventDefault();
  
//       try {
//         // Fetch possible conditions from Node server
//         const conditionResponse = await axios.post('http://localhost:3000/predict_conditions', {
//           symptoms: selectedSymptoms, // Send symptoms array
//         });
//         setConditions(conditionResponse.data.conditions.split("\n")); // Split response into list if needed
  
//         // Fetch general health advice from Node server
//         const adviceResponse = await axios.post('http://localhost:3000/get_advice', {
//           symptoms: selectedSymptoms, // Send symptoms array
//         });
//         setAdvice(adviceResponse.data.advice || 'No advice available');
        
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setConditions(["Error fetching conditions"]);
//         setAdvice("Error fetching advice");
//       }
//     };
  
//     return (
//       <div>
//         <h2>Select Your Symptoms</h2>
  
//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search symptoms..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//           style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
//         />
  
//         {/* Display Matching Symptoms based on Search */}
//         {filteredSymptoms.length > 0 && (
//           <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//             <h4>Click to Select Symptoms</h4>
//             {filteredSymptoms.map(symptom => (
//               <div
//                 key={symptom}
//                 onClick={() => addSymptom(symptom)}
//                 style={{ cursor: 'pointer', padding: '5px 0' }}
//               >
//                 {symptom.replace(/_/g, ' ')}
//               </div>
//             ))}
//           </div>
//         )}
  
//         {/* Selected Symptoms */}
//         {selectedSymptoms.length > 0 && (
//           <div>
//             <h3>Selected Symptoms:</h3>
//             <ul>
//               {selectedSymptoms.map(symptom => (
//                 <li key={symptom}>{symptom.replace(/_/g, ' ')}</li>
//               ))}
//             </ul>
//           </div>
//         )}
  
//         <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Get Prediction</button>
  
//         {/* Display the Prediction Result (Conditions) */}
//         {conditions.length > 0 && (
//           <div>
//             <h3>Possible Conditions:</h3>
//             <ul>
//               {conditions.map((condition, index) => (
//                 <li key={index}>{condition}</li>
//               ))}
//             </ul>
//           </div>
//         )}
  
//         {/* Display the General Health Advice */}
//         {advice && (
//           <div>
//             <h3>General Health Advice:</h3>
//             <p>{advice}</p>
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   export default User;

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
