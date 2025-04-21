const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Store transcripts in memory (for demo purposes)
let transcripts = [];

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Endpoint to receive transcripts
app.post('/receive-transcript', (req, res) => {
    console.log('Received POST request to /receive-transcript');
    console.log('Request body:', req.body);
    
    const { transcript, session_id, timestamp } = req.body;
    
    // Store the transcript
    transcripts.push({
        transcript,
        session_id,
        timestamp: timestamp || new Date().toISOString()
    });

    // Keep only the last 10 transcripts
    if (transcripts.length > 10) {
        transcripts = transcripts.slice(-10);
    }

    console.log('Current transcript count:', transcripts.length);
    
    res.status(200).json({ 
        status: 'success',
        message: 'Transcript received',
        transcriptCount: transcripts.length
    });
});

// Endpoint to get all transcripts
app.get('/transcripts', (req, res) => {
    res.json(transcripts);
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Server also accessible at http://127.0.0.1:${port}`);
}); 