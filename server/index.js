const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');

initDb();

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = path.join(__dirname, '..');

app.use(express.json({ limit: '2mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'property-custody-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

app.use(express.static(rootDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Property Custody System running at http://localhost:${PORT}`);
    console.log('Default admin: admin@supply.local / admin123');
});
