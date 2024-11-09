// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors'); // Import CORS

// const app = express();

// app.use(cors()); // Enable CORS for all routes
// app.use(express.json());

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

// // Helper function to query OpenAI API
// async function queryChatGPT(prompt) {
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: 'gpt-4', // or 'gpt-3.5-turbo'
//                 messages: [{ role: 'user', content: prompt }],
//                 max_tokens: 150
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${OPENAI_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         return response.data.choices[0].message.content;
//     } catch (error) {
//         console.error('Error querying OpenAI API:', error);
//         throw new Error('Failed to fetch response from ChatGPT');
//     }
// }

// // Endpoint for symptom analysis (suggesting possible conditions)
// app.post('/predict_conditions', async (req, res) => {
//     const { symptoms } = req.body;
//     const symptomsText = symptoms.join(', ');
//     const prompt = `A patient presents with the following symptoms: ${symptomsText}. What possible conditions could this indicate?`;
//     try {
//         const conditions = await queryChatGPT(prompt);
//         res.json({ conditions });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to get conditions' });
//     }
// });

// // Endpoint for general health advice
// app.post('/get_advice', async (req, res) => {
//     const { symptoms } = req.body;
//     const symptomsText = symptoms.join(', ');
//     const prompt = `A patient has symptoms like ${symptomsText}. What general health precautions, diet, or lifestyle advice would you recommend?`;
//     try {
//         const advice = await queryChatGPT(prompt);
//         res.json({ advice });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to get advice' });
//     }
// });

// app.listen(3000, () => {
//     console.log('Node server running on http://localhost:3000');
// });
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import the CORS package
const multer = require('multer');
const axios = require('axios');
const upload = multer({ dest: 'uploads/' });

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

// Endpoint to send data to a health professional
app.post('/send_to_doctor', upload.single('file'), (req, res) => {
    const { symptoms, medicalHistory } = req.body;
    const file = req.file;

    // Parse symptoms since it's sent as JSON
    const symptomsArray = JSON.parse(symptoms);

    console.log('Symptoms:', symptomsArray);
    console.log('Medical History:', medicalHistory);
    if (file) {
        console.log('File uploaded:', file.originalname);
    }

    res.json({ message: 'Data sent to health professional successfully.' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
