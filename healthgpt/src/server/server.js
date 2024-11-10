require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import the CORS package
const multer = require('multer');
const axios = require('axios');
// const { db } = require('../firebase');
// const { addDoc, collection } = require('firebase/firestore');


const app = express();

// Enable CORS for all requests
app.use(cors()); // Use CORS

app.use(express.json());

// Endpoint to get general health advice from ChatGPT
app.post('/get_advice', async (req, res) => {
    const { symptoms } = req.body;
    const symptomText = symptoms.join(', ');

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                { role: 'user', content: `A patient has symptoms like ${symptomText}. What general health precautions, diet, or lifestyle advice would you recommend?` }
            ],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const advice = response.data.choices[0].message.content;
        res.json({ advice });
    } catch (error) {
        console.error("Error querying OpenAI API:", error);
        res.status(500).json({ error: "Failed to get advice" });
    }
});


// Endpoint to get detailed health advice, diagnosis, and medication from ChatGPT
app.post('/get_advice_doctor', async (req, res) => {
    const { symptoms } = req.body;
    const symptomText = symptoms.join(', ');

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                { role: 'user', content: `A patient has symptoms like ${symptomText}. Please provide the following:
                  1. Diagnosis: What could be the possible condition based on these symptoms?
                  2. Medication: What medication might help alleviate the symptoms or treat the condition?
                  3. General Health Advice: What general health precautions, diet, or lifestyle advice would you recommend for this condition?` }
            ],
            max_tokens: 300
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Parsing the response from OpenAI
        const adviceText = response.data.choices[0].message.content;
        console.log("Full advice text:", adviceText);

        // Using regular expressions to extract each part of the advice
        const diagnosisMatch = adviceText.match(/Diagnosis:\s*([\s\S]*?)(?:\nMedication:|\n|$)/);
        const medicationMatch = adviceText.match(/Medication:\s*([\s\S]*?)(?:\nGeneral Health Advice:|\n|$)/);
        const adviceMatch = adviceText.match(/General Health Advice:\s*([\s\S]*)/);

        const diagnosis = diagnosisMatch ? diagnosisMatch[1].trim() : 'Diagnosis not provided.';
        const medication = medicationMatch ? medicationMatch[1].trim() : 'Medication advice not provided.';
        const advice = adviceMatch ? adviceMatch[1].trim() : 'General health advice not provided.';

        // Sending the structured response back to the frontend
        res.json({ diagnosis, medication, advice });
    } catch (error) {
        console.error("Error querying OpenAI API:", error);
        res.status(500).json({ error: "Failed to get full advice" });
    }
});


// Endpoint to send data to a health professional
// app.post('/send_to_doctor', async (req, res) => {
//     const { symptoms, medicalHistory, lastConversation } = req.body;

//     try {
//         // Parse symptoms if needed and save consultation data to Firestore
//         const symptomsArray = Array.isArray(symptoms) ? symptoms : JSON.parse(symptoms);

//         await addDoc(collection(db, "consultations"), {
//             symptoms: symptomsArray,
//             lastConversation: lastConversation,
//             medicalHistory: medicalHistory,
//             timestamp: new Date(),
//             status: "pending" // Mark as pending for doctor's review
//         });

//         res.json({ message: 'Data sent to health professional successfully and saved to database.' });
//     } catch (error) {
//         console.error("Error saving consultation to Firestore:", error);
//         res.status(500).json({ error: "Failed to save consultation data" });
//     }
// });


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
