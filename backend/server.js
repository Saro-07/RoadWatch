const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Fake AI simulation function (used if no API key is provided)
const simulateAIAnalysis = () => {
    const severities = ['Safe', 'Medium', 'Urgent'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const confidenceScore = (Math.random() * (0.99 - 0.75) + 0.75).toFixed(2);
    return { severity, confidenceScore };
};

// API Endpoints

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT id, username, role, trustScore, creditPoints FROM Users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ message: "Login successful", user: row });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// 1. Submit a new ticket
app.post('/api/tickets', upload.single('image'), async (req, res) => {
    try {
        const { title, description, issueType, latitude, longitude, area } = req.body;
        const ticketArea = area || 'Downtown';
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        let severity = 'Pending AI';
        let confidenceScore = 0.0;

        // Determine if we use Real AI or Simulated
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
            try {
                // Initialize the Gen AI SDK
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                
                // Read the file buffer if available
                if (req.file) {
                    const filePath = path.join(__dirname, req.file.path);
                    const fileBytes = fs.readFileSync(filePath);
                    const base64Data = fileBytes.toString('base64');
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: [
                            "You are an AI assistant for a road quality monitoring system. Analyze this image and determine the severity of the road damage. Respond with ONLY a JSON object containing 'severity' (one of: Safe, Medium, Urgent) and 'confidenceScore' (a number between 0 and 1). Example: {\"severity\": \"Urgent\", \"confidenceScore\": 0.95}",
                            { inlineData: { data: base64Data, mimeType: req.file.mimetype } }
                        ]
                    });
                    
                    const aiResult = JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, ''));
                    severity = aiResult.severity;
                    confidenceScore = aiResult.confidenceScore;
                }
            } catch (aiError) {
                console.error("AI Analysis failed, falling back to simulation:", aiError);
                const sim = simulateAIAnalysis();
                severity = sim.severity;
                confidenceScore = sim.confidenceScore;
            }
        } else {
            // Simulated AI
            const sim = simulateAIAnalysis();
            severity = sim.severity;
            confidenceScore = sim.confidenceScore;
        }

        // Insert into database
        const userId = req.body.userId || 1; 
        
        db.run(
            `INSERT INTO Tickets (userId, title, description, issueType, latitude, longitude, imageUrl, area, severity, confidenceScore) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, description, issueType, latitude, longitude, imageUrl, ticketArea, severity, confidenceScore],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({
                    id: this.lastID,
                    message: "Ticket created successfully",
                    severity,
                    confidenceScore
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get all tickets
app.get('/api/tickets', (req, res) => {
    db.all(`SELECT * FROM Tickets ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 3. Update ticket status (Authority workflow)
app.patch('/api/tickets/:id/status', upload.single('evidence'), (req, res) => {
    const { status } = req.body;
    const evidenceUrl = req.file ? `/uploads/${req.file.filename}` : null;

    let query = `UPDATE Tickets SET status = ? WHERE id = ?`;
    let params = [status, req.params.id];

    if (evidenceUrl) {
        query = `UPDATE Tickets SET status = ?, evidenceUrl = ? WHERE id = ?`;
        params = [status, evidenceUrl, req.params.id];
    }

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Status updated successfully", evidenceUrl });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
