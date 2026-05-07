const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 5000;
const SALT_ROUNDS = 10;

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : '*',
    credentials: true
}));
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

// Helper: push a notification to a user
function createNotification(userId, ticketId, message) {
    db.run(
        `INSERT INTO Notifications (userId, ticketId, message) VALUES (?, ?, ?)`,
        [userId, ticketId, message],
        (err) => {
            if (err) console.error('Notification insert error:', err.message);
        }
    );
}

// ─────────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────────

// Login — supports plain-text (legacy seeded users) and bcrypt hashes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get(
        `SELECT id, username, role, trustScore, creditPoints, area, password as storedPassword FROM Users WHERE username = ?`,
        [username],
        async (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(401).json({ error: 'Invalid credentials' });

            // Try bcrypt first, fall back to plain-text comparison for legacy seeded users
            let passwordMatch = false;
            if (row.storedPassword.startsWith('$2')) {
                // bcrypt hash
                passwordMatch = await bcrypt.compare(password, row.storedPassword);
            } else {
                // plain text (legacy seeded accounts)
                passwordMatch = (password === row.storedPassword);
            }

            if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

            const { storedPassword, ...user } = row;
            res.json({ message: 'Login successful', user });
        }
    );
});

// Register — citizen only; passwords hashed with bcrypt
app.post('/api/auth/register', async (req, res) => {
    const { username, password, area } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    if (username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userArea = area || 'Downtown';

        db.run(
            `INSERT INTO Users (username, password, role, area) VALUES (?, ?, 'citizen', ?)`,
            [username, hashedPassword, userArea],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ error: 'Username already taken. Please choose another.' });
                    }
                    return res.status(500).json({ error: err.message });
                }
                // Return the new user (same shape as login)
                db.get(
                    `SELECT id, username, role, trustScore, creditPoints, area FROM Users WHERE id = ?`,
                    [this.lastID],
                    (err2, newUser) => {
                        if (err2) return res.status(500).json({ error: err2.message });
                        res.status(201).json({ message: 'Registration successful', user: newUser });
                    }
                );
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// TICKET ENDPOINTS
// ─────────────────────────────────────────────

// Helper: run Gemini AI analysis
async function runGeminiAnalysis(ai, imageFile, textContext) {
    if (imageFile) {
        // Vision-based analysis
        const filePath = path.join(__dirname, imageFile.path);
        const fileBytes = fs.readFileSync(filePath);
        const base64Data = fileBytes.toString('base64');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                `You are an AI assistant for a road quality monitoring system. Analyze this image and determine the severity of the road damage.
Respond with ONLY a valid JSON object containing:
- "severity": one of "Safe", "Medium", or "Urgent"
- "confidenceScore": a number between 0 and 1
- "reason": a brief one-sentence explanation

Example: {"severity": "Urgent", "confidenceScore": 0.95, "reason": "Large pothole visible with exposed base layer."}`,
                { inlineData: { data: base64Data, mimeType: imageFile.mimetype } }
            ]
        });

        const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } else {
        // Text-based analysis (no image provided)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                `You are an AI assistant for a road quality monitoring system.
A citizen has reported a road issue with the following details:
- Issue Type: ${textContext.issueType}
- Title: ${textContext.title}
- Description: ${textContext.description}

Based solely on this text description, estimate the severity of the road hazard.
Respond with ONLY a valid JSON object containing:
- "severity": one of "Safe", "Medium", or "Urgent"
- "confidenceScore": a number between 0 and 1 (lower since no image is available)
- "reason": a brief one-sentence explanation

Example: {"severity": "Medium", "confidenceScore": 0.65, "reason": "Pothole described without image; moderate confidence based on description."}`
            ]
        });

        const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    }
}

// 1. Submit a new ticket
app.post('/api/tickets', upload.single('image'), async (req, res) => {
    const { title, description, issueType, latitude, longitude, area, userId } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        return res.status(503).json({ error: 'AI analysis service is not configured. Please set a valid GEMINI_API_KEY in the server .env file.' });
    }

    const ticketArea = area || 'Downtown';
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const reportingUserId = userId || 1;

    let severity = 'Pending';
    let confidenceScore = 0.0;
    let aiReason = '';

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const aiResult = await runGeminiAnalysis(ai, req.file || null, { issueType, title, description });
        severity = aiResult.severity;
        confidenceScore = aiResult.confidenceScore;
        aiReason = aiResult.reason || '';
    } catch (aiError) {
        console.error('Gemini AI Analysis failed:', aiError.message);
        return res.status(502).json({ error: `AI analysis failed: ${aiError.message}. Please try again.` });
    }

    db.run(
        `INSERT INTO Tickets (userId, title, description, issueType, latitude, longitude, imageUrl, area, severity, confidenceScore)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [reportingUserId, title, description, issueType, latitude, longitude, imageUrl, ticketArea, severity, confidenceScore],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            const newTicketId = this.lastID;

            // Notify the reporting citizen that their ticket was received
            createNotification(
                reportingUserId,
                newTicketId,
                `Your report "${title}" (#${newTicketId}) has been submitted and analyzed. Severity: ${severity}.`
            );

            res.status(201).json({
                id: newTicketId,
                message: 'Ticket created successfully',
                severity,
                confidenceScore,
                aiReason
            });
        }
    );
});

// 2. Get all tickets
app.get('/api/tickets', (req, res) => {
    db.all(`SELECT * FROM Tickets ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 3. Update ticket status (contractor workflow) — also triggers notification
app.patch('/api/tickets/:id/status', upload.single('evidence'), (req, res) => {
    const { status } = req.body;
    const evidenceUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const ticketId = req.params.id;

    let query = `UPDATE Tickets SET status = ? WHERE id = ?`;
    let params = [status, ticketId];

    if (evidenceUrl) {
        query = `UPDATE Tickets SET status = ?, evidenceUrl = ? WHERE id = ?`;
        params = [status, evidenceUrl, ticketId];
    }

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Look up the ticket owner to send a notification
        db.get(`SELECT userId, title FROM Tickets WHERE id = ?`, [ticketId], (err2, ticket) => {
            if (!err2 && ticket) {
                const statusMessages = {
                    'In Progress': `Your report "${ticket.title}" (#${ticketId}) is now In Progress — a contractor is working on it.`,
                    'Completed': `Great news! Your report "${ticket.title}" (#${ticketId}) has been marked as Completed.`,
                };
                const message = statusMessages[status] || `Your report "#${ticketId}" status was updated to: ${status}.`;
                createNotification(ticket.userId, parseInt(ticketId), message);
            }
        });

        res.json({ message: 'Status updated successfully', evidenceUrl });
    });
});

// ─────────────────────────────────────────────
// NOTIFICATION ENDPOINTS
// ─────────────────────────────────────────────

// Get all notifications for a user (newest first)
app.get('/api/notifications/:userId', (req, res) => {
    db.all(
        `SELECT * FROM Notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 50`,
        [req.params.userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Mark a single notification as read
app.patch('/api/notifications/:id/read', (req, res) => {
    db.run(`UPDATE Notifications SET isRead = 1 WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Notification marked as read' });
    });
});

// Mark ALL notifications as read for a user
app.patch('/api/notifications/read-all/:userId', (req, res) => {
    db.run(`UPDATE Notifications SET isRead = 1 WHERE userId = ?`, [req.params.userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'All notifications marked as read' });
    });
});

// ─────────────────────────────────────────────
app.listen(port, () => {
    console.log(`RoadWatch server running on port ${port}`);
});
