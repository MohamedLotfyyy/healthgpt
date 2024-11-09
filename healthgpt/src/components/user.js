import React, { useState } from 'react';

const symptoms = [
  'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
  'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
  'vomiting', 'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain', 'anxiety',
  'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 
  'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 
  'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 
  'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 
  'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 
  'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 
  'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 
  'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 
  'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 
  'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 
  'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 
  'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 
  'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 
  'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 
  'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 
  'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 
  'foul_smell_of_urine', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 
  'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 
  'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic_patches', 
  'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 
  'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 
  'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 
  'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum', 
  'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 
  'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 
  'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
];

const User = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);

  // Update search term and filter symptoms
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter symptoms based on the search term
    if (term) {
      setFilteredSymptoms(symptoms.filter(symptom =>
        symptom.toLowerCase().includes(term.toLowerCase())
      ));
    } else {
      setFilteredSymptoms([]);
    }
  };

  // Add symptom to selectedSymptoms and clear the search
  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSearchTerm(''); // Clear search term after adding
    setFilteredSymptoms([]); // Clear filtered symptoms
  };

  // Convert selected symptoms to binary vector
  const getBinaryVector = () => {
    return symptoms.map(symptom => (selectedSymptoms.includes(symptom) ? 1 : 0));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const binaryVector = getBinaryVector();
    console.log('Binary vector:', binaryVector);

    // Example: Send binaryVector to backend for prediction
    // axios.post('/predict', { symptoms: binaryVector })
    //   .then(response => console.log(response.data))
    //   .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Select Your Symptoms</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search symptoms..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />

      {/* Display Matching Symptoms based on Search */}
      {filteredSymptoms.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h4>Click to Select Symptoms</h4>
          {filteredSymptoms.map(symptom => (
            <div
              key={symptom}
              onClick={() => addSymptom(symptom)}
              style={{ cursor: 'pointer', padding: '5px 0' }}
            >
              {symptom.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      )}

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div>
          <h3>Selected Symptoms:</h3>
          <ul>
            {selectedSymptoms.map(symptom => (
              <li key={symptom}>{symptom.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Get Prediction</button>
    </div>
  );
};

export default User;
