// src/services/consultationServices.js
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy } from 'firebase/firestore';

// Create a new consultation
export const createConsultation = async (userId, symptoms, lastConversation, medicalHistory) => {
    await addDoc(collection(db, 'consultations'), {
      userId,
      symptoms,
      lastConversation,
      medicalHistory,
      status: 'open',
      createdAt: new Date(),
    });
  };


export const fetchUserClosedConsultations = async (userId) => {
  const q = query(
    collection(db, 'consultations'),
    where('userId', '==', userId),
    where('status', '==', 'closed'),  // Only fetch closed consultations
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// Fetch open consultations for doctors
// Fetch consultations with status 'pending'
export const fetchOpenConsultations = async () => {
    const consultationsRef = collection(db, 'consultations');
    const q = query(consultationsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
  
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

// Respond to a consultation
export const respondToConsultation = async (consultationId, doctorId, response, disease, medication) => {
    const consultationRef = doc(db, 'consultations', consultationId);
    await updateDoc(consultationRef, {
      doctorId,
      response,
      disease,
      medication,
      status: 'closed',  // Mark consultation as completed
      responseTimestamp: new Date(),
    });
};
