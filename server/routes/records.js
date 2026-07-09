const express = require('express');
const {
    FORM_TYPES,
    parseRecord,
    getCounts,
    getRecordsByForm,
    getRawRecord,
    createRecord,
    updateRecord,
    deleteRecord
} = require('../db');
const { requireAuth, canAccessForm } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

function validateFormType(formType) {
    return FORM_TYPES.includes(formType);
}

router.get('/counts', (req, res) => {
    const counts = {};
    const formCounts = getCounts();

    FORM_TYPES.forEach(formType => {
        if (!canAccessForm(req.session, formType)) {
            counts[formType] = 0;
            return;
        }

        counts[formType] = formCounts[formType] || 0;
    });

    res.json({ counts });
});

router.get('/:formType', (req, res) => {
    const { formType } = req.params;
    if (!validateFormType(formType)) {
        return res.status(400).json({ error: 'Invalid form type.' });
    }
    if (!canAccessForm(req.session, formType)) {
        return res.status(403).json({ error: 'You do not have access to this form.' });
    }

    const rows = getRecordsByForm(formType);
    res.json({ records: rows });
});

router.post('/:formType', (req, res) => {
    const { formType } = req.params;
    if (!validateFormType(formType)) {
        return res.status(400).json({ error: 'Invalid form type.' });
    }
    if (!canAccessForm(req.session, formType)) {
        return res.status(403).json({ error: 'You do not have access to this form.' });
    }

    const payload = req.body || {};
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
        return res.status(400).json({ error: 'At least one line item is required.' });
    }

    const data = {
        ...payload,
        createdAt: payload.createdAt || new Date().toISOString()
    };

    const record = createRecord(formType, data);
    res.status(201).json({ record });
});

router.put('/:formType/:id', (req, res) => {
    const { formType, id } = req.params;
    const recordId = Number(id);

    if (!validateFormType(formType)) {
        return res.status(400).json({ error: 'Invalid form type.' });
    }
    if (!canAccessForm(req.session, formType)) {
        return res.status(403).json({ error: 'You do not have access to this form.' });
    }

    const existing = getRawRecord(formType, recordId);
    if (!existing) {
        return res.status(404).json({ error: 'Record not found.' });
    }

    const payload = req.body || {};
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
        return res.status(400).json({ error: 'At least one line item is required.' });
    }

    const previous = existing.data || {};
    const data = {
        ...payload,
        createdAt: previous.createdAt || existing.createdAt
    };

    const record = updateRecord(formType, recordId, data);
    res.json({ record });
});

router.delete('/:formType/:id', (req, res) => {
    const { formType, id } = req.params;
    const recordId = Number(id);

    if (!validateFormType(formType)) {
        return res.status(400).json({ error: 'Invalid form type.' });
    }
    if (!canAccessForm(req.session, formType)) {
        return res.status(403).json({ error: 'You do not have access to this form.' });
    }

    const deleted = deleteRecord(formType, recordId);
    if (!deleted) {
        return res.status(404).json({ error: 'Record not found.' });
    }

    res.json({ success: true });
});

module.exports = router;
