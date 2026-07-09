const express = require('express');
const bcrypt = require('bcryptjs');
const { getRawUserByEmail, getRawUserById, parseUser, getStats } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const row = getRawUserByEmail(email);
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = parseUser(row);
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.allowedForms = user.allowedForms;
    req.session.name = user.name;
    req.session.email = user.email;

    if (req.body.remember === false) {
        req.session.cookie.maxAge = undefined;
    } else {
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
    }

    res.json({ user });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

router.get('/me', requireAuth, (req, res) => {
    const row = getRawUserById(req.session.userId);
    if (!row) {
        req.session.destroy(() => {});
        return res.status(401).json({ error: 'Session expired.' });
    }

    const user = parseUser(row);
    req.session.role = user.role;
    req.session.allowedForms = user.allowedForms;
    req.session.name = user.name;
    req.session.email = user.email;

    res.json({ user });
});

router.get('/stats', (req, res) => {
    const stats = getStats();
    res.json(stats);
});

module.exports = router;
