const express = require('express');
const bcrypt = require('bcryptjs');
const { getRawUserByEmail, getRawUserById, parseUser, getStats, createUser } = require('../db');
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
    if (user.status !== 'approved') {
        return res.status(403).json({ error: user.status === 'rejected' ? 'Account request denied.' : 'Account pending approval.' });
    }

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

router.post('/register', (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    if (getRawUserByEmail(email)) {
        return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const user = createUser({
        name,
        email,
        password_hash,
        role: 'User',
        department: '',
        status: 'pending',
        allowedForms: []
    });

    res.status(201).json({ user });
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
