// User.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { db, auth } from '../firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { fetchUserClosedConsultations } from '../services/consultationServices';

// Import MUI components
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Autocomplete,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  LocalHospital as LocalHospitalIcon,
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const symptomsList = [
  'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
  'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
  'vomiting', 'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain',
  // add more symptoms here
];

const User = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [closedConsultations, setClosedConsultations] = useState([]);
  const [conversationCount, setConversationCount] = useState(1);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Function to load closed consultations
  const loadClosedConsultations = async () => {
    if (auth.currentUser) {
      try {
        const consultations = await fetchUserClosedConsultations(auth.currentUser.uid);
        setClosedConsultations(consultations);
      } catch (error) {
        console.error("Error fetching closed consultations:", error);
        setAlertMessage('Failed to load closed consultations.');
        setAlertSeverity('error');
      }
    } else {
      alert("You need to be logged in to load closed consultations.");
    }
  };

  const handleGetPrediction = async () => {
    setLoading(true);
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
      setAlertMessage('Prediction received successfully.');
      setAlertSeverity('success');
    } catch (error) {
      console.error("Error getting prediction:", error);
      setAlertMessage('Failed to get prediction.');
      setAlertSeverity('error');
    } finally {
      setLoading(false);
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
        orderedMedicine: false,
      });

      setShowDoctorForm(false);
      setMedicalHistory('');
      setAlertMessage('Data sent to the health professional successfully.');
      setAlertSeverity('success');
    } catch (error) {
      console.error("Error sending to doctor:", error);
      setAlertMessage('Failed to send data to the health professional.');
      setAlertSeverity('error');
    }
  };

  // Function to handle ordering medicine
  const handleOrderMedicine = async () => {
    if (!auth.currentUser) {
      alert("You need to be logged in to order medicine.");
      return;
    }

    try {
      // Generate a random number of days between 2 and 5
      const numberOfDays = Math.floor(Math.random() * 4) + 2;

      // Update the consultation to indicate medicine has been ordered and include deliveryDays
      const consultationRef = doc(db, 'consultations', selectedConsultationId);
      await updateDoc(consultationRef, {
        orderedMedicine: true,
        deliveryDays: numberOfDays,
      });

      // Save the user's address in their profile
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { street, city, postcode }, { merge: true });

      // Create an order document
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        consultationId: selectedConsultationId,
        medicine: closedConsultations.find(c => c.id === selectedConsultationId)?.medication || 'N/A',
        numberOfDays: numberOfDays,
        address: { street, city, postcode },
        orderedAt: serverTimestamp(),
      });

      setShowOrderForm(false);
      setStreet('');
      setCity('');
      setPostcode('');
      // Refresh the consultations to update the UI
      loadClosedConsultations();
      setAlertMessage(`Medicine ordered successfully! It will arrive in ${numberOfDays} days.`);
      setAlertSeverity('success');
    } catch (error) {
      console.error("Error ordering medicine:", error);
      setAlertMessage('Failed to order medicine.');
      setAlertSeverity('error');
    }
  };

  // Function to handle clicking "Yes" to order medicine
  const handleOrderClick = async (consultation) => {
    setSelectedConsultationId(consultation.id);
    setShowOrderForm(true);

    // Clear previous address fields
    setStreet('');
    setCity('');
    setPostcode('');

    // Pre-fill address if available
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData.street) setStreet(userData.street);
          if (userData.city) setCity(userData.city);
          if (userData.postcode) setPostcode(userData.postcode);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar with title */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HealthGPT
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        {alertMessage && (
          <Alert severity={alertSeverity} onClose={() => setAlertMessage('')} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        {/* Symptom Selection */}
        <Autocomplete
          multiple
          options={symptomsList}
          getOptionLabel={(option) => option.replace(/_/g, ' ')}
          value={selectedSymptoms}
          onChange={(event, newValue) => {
            setSelectedSymptoms(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select Symptoms"
              placeholder="Type to search..."
            />
          )}
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleGetPrediction}
          disabled={selectedSymptoms.length === 0 || loading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>

        {/* Conversations */}
        {conversations.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Conversations
            </Typography>
            {conversations.map((conv) => (
              <Paper key={conv.id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Symptoms:</strong> {conv.userSymptoms}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Advice:</strong> {conv.gptResponse}
                </Typography>
                {selectedSymptoms.length >= 3 && conv.id === conversationCount - 1 && (
                  <Button
                    variant="outlined"
                    startIcon={<LocalHospitalIcon />}
                    onClick={handleSendToDoctor}
                    sx={{ mt: 1 }}
                  >
                    Send to Doctor
                  </Button>
                )}
              </Paper>
            ))}
          </Box>
        )}

        {/* Load Closed Consultations Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={loadClosedConsultations}
          fullWidth
          sx={{ mb: 2 }}
        >
          Load Closed Consultations
        </Button>

        {/* Closed Consultations */}
        {closedConsultations.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Closed Consultations
            </Typography>
            {closedConsultations.map((consultation) => (
              <Paper key={consultation.id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  <strong>Symptoms:</strong> {consultation.symptoms.join(', ')}
                </Typography>
                <Typography variant="body1">
                  <strong>Diagnosis:</strong> {consultation.disease || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Medication:</strong> {consultation.medication || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Doctor’s Notes:</strong> {consultation.response || 'N/A'}
                </Typography>

                {!consultation.orderedMedicine && consultation.medication && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleOrderClick(consultation)}
                    sx={{ mt: 1 }}
                  >
                    Order Medicine
                  </Button>
                )}
                {consultation.orderedMedicine && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Medicine will arrive in {consultation.deliveryDays} days.
                  </Alert>
                )}
              </Paper>
            ))}
          </Box>
        )}

        {/* Doctor Form Dialog */}
        <Dialog open={showDoctorForm} onClose={() => setShowDoctorForm(false)}>
          <DialogTitle>Send to Doctor</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Symptoms:</strong> {conversations[0]?.userSymptoms}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Advice:</strong> {conversations[0]?.gptResponse}
            </Typography>
            <TextField
              label="Medical History"
              multiline
              rows={4}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDoctorForm(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitToDoctor}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Order Medicine Dialog */}
        <Dialog open={showOrderForm} onClose={() => setShowOrderForm(false)}>
          <DialogTitle>Order Medicine</DialogTitle>
          <DialogContent>
            <TextField
              label="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowOrderForm(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleOrderMedicine}>
              Submit Order
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default User;