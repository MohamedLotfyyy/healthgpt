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

const symptoms = [
    'itching', 'skin_rash', 'joint_pain', 'stomach_pain', 'fatigue', 'headache', 
    'cough', 'fever', 'nausea', 'vomiting', 'diarrhea'
];

const User = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSymptoms, setFilteredSymptoms] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [conversation, setConversation] = useState([]); // Stores conversation sequentially
    const [advice, setAdvice] = useState(''); // For displaying current advice
    const [showSendToDoctor, setShowSendToDoctor] = useState(false); // Show medical history pop-up
    const [medicalHistory, setMedicalHistory] = useState(''); // Medical history input

    // Update search term and filter symptoms
    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        if (term) {
            setFilteredSymptoms(symptoms.filter(symptom =>
                symptom.toLowerCase().includes(term.toLowerCase())
            ));
        } else {
            setFilteredSymptoms([]);
        }
    };

    // Add symptom to the selected list
    const addSymptom = (symptom) => {
        if (!selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
        setSearchTerm(''); // Clear search term after adding
        setFilteredSymptoms([]); // Clear filtered symptoms
    };

    // Handle conversation submission
    const handleGetPrediction = async () => {
        try {
            const response = await axios.post('http://localhost:3000/get_advice', {
                symptoms: selectedSymptoms,
            });
            const adviceText = response.data.advice || "No advice available";

            // Add the advice to the conversation
            setConversation([...conversation, { role: 'ChatGPT', content: adviceText }]);
            setAdvice(adviceText);
        } catch (error) {
            console.error("Error getting advice:", error);
        }
    };

    // Show send to doctor modal
    const handleSendToDoctor = () => {
        if (selectedSymptoms.length >= 5) {
            setShowSendToDoctor(true);
        } else {
            alert("Please add at least 5 symptoms to send to a doctor.");
        }
    };

    // Handle sending the data to the doctor
    const handleDoctorSubmission = async () => {
        try {
            const response = await axios.post('http://localhost:3000/send_to_doctor', {
                symptoms: selectedSymptoms,
                medicalHistory: medicalHistory,
            });

            setConversation([
                ...conversation,
                { role: 'User', content: "Sent data to doctor." },
                { role: 'System', content: response.data.message }
            ]);
            setShowSendToDoctor(false); // Close modal
        } catch (error) {
            console.error("Error sending to doctor:", error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Symptom Checker</h2>

            {/* Search Bar for Symptoms */}
            <input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
            />

            {/* Filtered Symptoms List */}
            {filteredSymptoms.length > 0 && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    {filteredSymptoms.map(symptom => (
                        <div key={symptom} onClick={() => addSymptom(symptom)} style={{ cursor: 'pointer', padding: '5px 0' }}>
                            {symptom.replace(/_/g, ' ')}
                        </div>
                    ))}
                </div>
            )}

            {/* Display Selected Symptoms */}
            <div style={{ marginBottom: '10px' }}>
                <strong>Selected Symptoms:</strong>
                {selectedSymptoms.map((symptom, index) => (
                    <span key={index} style={{ display: 'inline-block', margin: '5px', padding: '5px', backgroundColor: '#f1f1f1', borderRadius: '5px' }}>
                        {symptom.replace(/_/g, ' ')}
                    </span>
                ))}
            </div>

            <button onClick={handleGetPrediction} style={{ marginBottom: '10px' }}>Get General Health Advice</button>
            <button onClick={handleSendToDoctor} style={{ marginBottom: '10px', marginLeft: '10px' }}>Send to Doctor</button>

            {/* Conversation Display */}
            <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                <strong>Conversation:</strong>
                {conversation.map((entry, index) => (
                    <div key={index} style={{ margin: '10px 0' }}>
                        <strong>{entry.role}:</strong> {entry.content}
                    </div>
                ))}
            </div>

            {/* Send to Doctor Modal */}
            {showSendToDoctor && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    padding: '20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '5px'
                }}>
                    <h3>Send to Health Professional</h3>
                    <textarea
                        placeholder="Add any relevant medical history"
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                        style={{ width: '100%', height: '80px', marginBottom: '10px' }}
                    />
                    <button onClick={handleDoctorSubmission} style={{ marginRight: '10px' }}>Submit</button>
                    <button onClick={() => setShowSendToDoctor(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default User;
