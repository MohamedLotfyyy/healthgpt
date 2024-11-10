// DoctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchOpenConsultations, respondToConsultation } from '../services/consultationServices';
import { auth } from '../firebase';

// Import MUI components
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';

import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const DoctorDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [response, setResponse] = useState('');
  const [disease, setDisease] = useState('');
  const [medication, setMedication] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const loadConsultations = async () => {
      try {
        setLoading(true);
        const openConsultations = await fetchOpenConsultations();
        setConsultations(openConsultations);
      } catch (error) {
        console.error('Error fetching consultations:', error);
        setAlertMessage('Failed to load consultations.');
        setAlertSeverity('error');
      } finally {
        setLoading(false);
      }
    };
    loadConsultations();
  }, []);

  const handleResponseSubmit = async (consultationId) => {
    try {
      setLoading(true);
      const doctorId = auth.currentUser.uid;
      await respondToConsultation(consultationId, doctorId, response, disease, medication);
      setAlertMessage('Response sent successfully!');
      setAlertSeverity('success');
      setConsultations(consultations.filter(c => c.id !== consultationId));
      setSelectedConsultation(null);
      // Clear form fields
      setResponse('');
      setDisease('');
      setMedication('');
    } catch (error) {
      console.error('Error submitting response:', error);
      setAlertMessage('Failed to send response.');
      setAlertSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar with title */}
      <AppBar position="static">
        <Toolbar>
          {/* You can add a menu icon or other elements here */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HealthGPT - Doctor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        {alertMessage && (
          <Alert severity={alertSeverity} onClose={() => setAlertMessage('')} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        <Typography variant="h4" gutterBottom>
          Open Consultations
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : consultations.length > 0 ? (
          consultations.map((consultation) => (
            <Paper key={consultation.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">
                <strong>Symptoms:</strong> {consultation.symptoms.join(', ')}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <strong>Medical History:</strong> {consultation.medicalHistory || 'N/A'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setSelectedConsultation(consultation)}
              >
                Respond
              </Button>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No open consultations at the moment.
          </Typography>
        )}

        {/* Respond to Consultation Dialog */}
        {selectedConsultation && (
          <Dialog
            open={Boolean(selectedConsultation)}
            onClose={() => setSelectedConsultation(null)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              Respond to Consultation
              <IconButton
                aria-label="close"
                onClick={() => setSelectedConsultation(null)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Symptoms:</strong> {selectedConsultation.symptoms.join(', ')}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Medical History:</strong> {selectedConsultation.medicalHistory || 'N/A'}
              </Typography>
              <TextField
                label="Response to Patient"
                multiline
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="Diagnosis (Disease)"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="Medication"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedConsultation(null)}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={() => handleResponseSubmit(selectedConsultation.id)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Response'}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
