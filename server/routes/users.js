const express = require('express');
const bcrypt = require('bcryptjs');
const {
    FORM_TYPES,
    parseUser,
    getAllUsers,
    getRawUserByEmail,
    getRawUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', (req, res) => {
    res.json({ users: getAllUsers() });
});

router.post('/', (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = String(req.body.role || 'User').trim();
    const department = String(req.body.department || '').trim();
    const status = String(req.body.status || 'approved').trim().toLowerCase();
    let allowedForms = Array.isArray(req.body.allowedForms) ? req.body.allowedForms : [];

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    if (role === 'Admin') {
        allowedForms = FORM_TYPES;
    } else if (allowedForms.length === 0) {
        return res.status(400).json({ error: 'Select at least one form for this user.' });
    }

    const existing = getRawUserByEmail(email);
    if (existing) {
        return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const user = createUser({
        name,
        email,
        password_hash: hash,
        role,
        department,
        status: status === 'pending' || status === 'rejected' ? status : 'approved',
        allowedForms
    });

    res.status(201).json({ user });
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = getRawUserById(id);
    if (!existing) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const name = String(req.body.name || existing.name).trim();
    const email = String(req.body.email || existing.email).trim().toLowerCase();
    const role = String(req.body.role || existing.role).trim();
    const department = String(req.body.department || existing.department || '').trim();
    const status = String(req.body.status || existing.status || 'pending').trim().toLowerCase();
    let allowedForms = Array.isArray(req.body.allowedForms)
        ? req.body.allowedForms
        : normalizeAllowedForms(existing.allowedForms || []);
    const password = String(req.body.password || '');

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    if (role === 'Admin') {
        allowedForms = FORM_TYPES;
    } else if (allowedForms.length === 0) {
        return res.status(400).json({ error: 'Select at least one form for this user.' });
    }

    const duplicate = getRawUserByEmail(email);
    if (duplicate && Number(duplicate.id) !== id) {
        return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const updates = {
        name,
        email,
        role,
        department,
        status,
        allowedForms
    };

    if (password) {
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
        updates.password_hash = bcrypt.hashSync(password, 10);
    }

    const user = updateUser(id, updates);
    res.json({ user });
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (id === req.session.userId) {
        return res.status(400).json({ error: 'You cannot delete your own account while logged in.' });
    }

    const deleted = deleteUser(id);
    if (!deleted) {
        return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true });
});

function normalizeAllowedForms(value) {
    if (Array.isArray(value)) return value;
    try {
        return JSON.parse(value);
    } catch {
        return [];
    }
}

module.exports = router;
