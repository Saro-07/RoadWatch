const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL DEFAULT 'password',
                trustScore INTEGER DEFAULT 100,
                creditPoints INTEGER DEFAULT 0,
                role TEXT DEFAULT 'citizen',
                area TEXT DEFAULT 'Downtown'
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                title TEXT,
                description TEXT,
                issueType TEXT,
                latitude REAL,
                longitude REAL,
                imageUrl TEXT,
                evidenceUrl TEXT,
                area TEXT DEFAULT 'Downtown',
                severity TEXT DEFAULT 'Pending AI',
                confidenceScore REAL DEFAULT 0.0,
                status TEXT DEFAULT 'Submitted',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(userId) REFERENCES Users(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                ticketId INTEGER,
                message TEXT NOT NULL,
                isRead INTEGER DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(userId) REFERENCES Users(id),
                FOREIGN KEY(ticketId) REFERENCES Tickets(id)
            )
        `);

        // Insert default seeded users for testing if they don't exist
        // Passwords stored as plain text for pre-seeded accounts; new registrations use bcrypt
        db.run(`
            INSERT OR IGNORE INTO Users (username, password, role, area) VALUES 
            ('admin1', 'admin123', 'admin', 'All'),
            ('citizen1', 'password123', 'citizen', 'Downtown'),
            ('contractor1', 'password123', 'contractor', 'Downtown'),
            ('contractor2', 'password123', 'contractor', 'Uptown'),
            ('official1', 'password123', 'official', 'All')
        `);
    });
}

module.exports = db;
