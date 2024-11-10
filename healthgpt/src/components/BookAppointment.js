// src/components/BookAppointment.jsx

import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const BookAppointment = ({ open, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        // Query the 'users' collection where role == 'doctor'
        const doctorsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'doctor')
        );
        const querySnapshot = await getDocs(doctorsQuery);
        const doctorsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Doctor', // Use 'name' field
          };
        });
        setDoctors(doctorsList);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setAlertMessage('Failed to load doctors.');
        setAlertSeverity('error');
      }
    };
    loadDoctors();
  }, []);

  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 9;
    const endHour = 17; // 5 PM
    for (let hour = startHour; hour < endHour; hour++) {
      const slotDate = new Date(date);
      slotDate.setHours(hour, 0, 0, 0);
      slots.push(slotDate.toISOString()); // Convert to ISO string
    }
    return slots;
  };

  const handleDoctorOrDateChange = async () => {
    if (!selectedDoctorId || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);

    try {
      // Generate all time slots for the selected date
      const allSlots = generateTimeSlots(selectedDate);

      // Fetch booked appointments for the doctor on the selected date
      const q = query(
        collection(db, 'appointments'),
        where('doctorId', '==', selectedDoctorId),
        where('appointmentDate', '==', selectedDate.toDateString())
      );
      const querySnapshot = await getDocs(q);
      const bookedSlots = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data.appointmentTime; // Use the stored ISO string
      });

      // Filter out booked slots
      const available = allSlots.filter(
        (slot) => !bookedSlots.includes(slot)
      );

      setAvailableSlots(available);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAlertMessage('Failed to load available time slots.');
      setAlertSeverity('error');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!auth.currentUser) {
      setAlertMessage('You need to be logged in to book an appointment.');
      setAlertSeverity('error');
      return;
    }
    try {
      setBooking(true);

      // Convert the selectedSlot (ISO string) to a Firestore Timestamp
      const appointmentTimestamp = Timestamp.fromDate(new Date(selectedSlot));

      // Save the appointment
      await addDoc(collection(db, 'appointments'), {
        userId: auth.currentUser.uid,
        doctorId: selectedDoctorId,
        appointmentTime: appointmentTimestamp, // Store as Timestamp
        appointmentDate: selectedDate.toDateString(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setAlertMessage('Appointment booked successfully!');
      setAlertSeverity('success');
      // Reset selections
      setSelectedDoctorId('');
      setSelectedDate(null);
      setAvailableSlots([]);
      setSelectedSlot('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setAlertMessage('Failed to book appointment.');
      setAlertSeverity('error');
    } finally {
      setBooking(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Book an Appointment</DialogTitle>
      <DialogContent>
        {alertMessage && (
          <Alert
            severity={alertSeverity}
            onClose={() => setAlertMessage('')}
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Doctor</InputLabel>
          <Select
            value={selectedDoctorId}
            onChange={(e) => {
              setSelectedDoctorId(e.target.value);
              setSelectedDate(null);
              setAvailableSlots([]);
              setSelectedSlot('');
            }}
            label="Select Doctor"
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedDoctorId && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setAvailableSlots([]);
                setSelectedSlot('');
              }}
              minDate={new Date()}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mt: 2 }} />
              )}
            />
          </LocalizationProvider>
        )}

        {selectedDoctorId && selectedDate && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleDoctorOrDateChange}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loadingSlots ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Load Available Time Slots'
            )}
          </Button>
        )}

        {availableSlots.length > 0 && (
          <TextField
            select
            label="Select Time Slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {availableSlots.map((slot, index) => (
              <MenuItem key={index} value={slot}>
                {new Date(slot).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleBookAppointment}
          disabled={!selectedSlot || booking}
        >
          {booking ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Book Appointment'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookAppointment;
