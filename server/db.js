const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'property_custody.json');
const FORM_TYPES = ['ris', 'ics', 'par', 'property-card', 'iar', 'ptr', 'prs'];

function readDb() {
    try {
        const content = fs.readFileSync(dbPath, 'utf8');
        return content ? JSON.parse(content) : { users: [], records: [] };
    } catch {
        return { users: [], records: [] };
    }
}

function writeDb(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

function ensureDb(data) {
    if (!Array.isArray(data.users)) data.users = [];
    if (!Array.isArray(data.records)) data.records = [];
    return data;
}

function normalizeAllowedForms(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];

    try {
        return JSON.parse(value);
    } catch {
        return String(value)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    }
}

function parseUser(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        department: row.department || '',
        status: row.status || 'approved',
        allowedForms: normalizeAllowedForms(row.allowedForms),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
    };
}

function parseRecord(row) {
    if (!row) return null;
    const data = row.data || {};
    return {
        id: row.id,
        ...data,
        createdAt: data.createdAt || row.createdAt,
        updatedAt: row.updatedAt
    };
}

function getDb() {
    return ensureDb(readDb());
}

function getNextId(items) {
    return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function initDb() {
    const data = getDb();

    if (data.users.length === 0) {
        const hash = bcrypt.hashSync('admin123', 10);
        data.users.push({
            id: 1,
            name: 'Administrator',
            email: 'admin@supply.local',
            password_hash: hash,
            role: 'Admin',
            department: 'Supply Office',
            allowedForms: FORM_TYPES,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }

    writeDb(data);
}

function getRawUserByEmail(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    return getDb().users.find(user => String(user.email || '').trim().toLowerCase() === normalizedEmail) || null;
}

function getRawUserById(id) {
    return getDb().users.find(user => Number(user.id) === Number(id)) || null;
}

function getAllUsers() {
    return getDb().users.map(parseUser);
}

function createUser(user) {
    const data = getDb();
    const now = new Date().toISOString();
    const newUser = {
        id: getNextId(data.users),
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        department: user.department || '',
        status: user.status || 'approved',
        allowedForms: normalizeAllowedForms(user.allowedForms),
        createdAt: now,
        updatedAt: now
    };

    data.users.push(newUser);
    writeDb(data);
    return parseUser(newUser);
}

function updateUser(id, updates) {
    const data = getDb();
    const index = data.users.findIndex(user => Number(user.id) === Number(id));
    if (index === -1) return null;

    const existing = data.users[index];
    const updatedUser = {
        ...existing,
        ...updates,
        allowedForms: updates.allowedForms !== undefined
            ? normalizeAllowedForms(updates.allowedForms)
            : normalizeAllowedForms(existing.allowedForms),
        updatedAt: new Date().toISOString()
    };

    data.users[index] = updatedUser;
    writeDb(data);
    return parseUser(updatedUser);
}

function deleteUser(id) {
    const data = getDb();
    const index = data.users.findIndex(user => Number(user.id) === Number(id));
    if (index === -1) return false;

    data.users.splice(index, 1);
    writeDb(data);
    return true;
}

function getStats() {
    const data = getDb();
    return {
        userCount: data.users.length,
        recordCount: data.records.length
    };
}

function getCounts() {
    const data = getDb();
    return FORM_TYPES.reduce((counts, formType) => {
        counts[formType] = data.records.filter(record => record.formType === formType).length;
        return counts;
    }, {});
}

function getRecordsByForm(formType) {
    return getDb().records
        .filter(record => record.formType === formType)
        .map(parseRecord);
}

function getRawRecord(formType, id) {
    return getDb().records.find(record => record.formType === formType && Number(record.id) === Number(id)) || null;
}

function createRecord(formType, record) {
    const data = getDb();
    const now = new Date().toISOString();
    const newRecord = {
        id: getNextId(data.records),
        formType,
        data: { ...record },
        createdAt: now,
        updatedAt: now
    };

    data.records.push(newRecord);
    writeDb(data);
    return parseRecord(newRecord);
}

function updateRecord(formType, id, record) {
    const data = getDb();
    const index = data.records.findIndex(r => r.formType === formType && Number(r.id) === Number(id));
    if (index === -1) return null;

    const existing = data.records[index];
    const updatedRecord = {
        ...existing,
        data: { ...record },
        updatedAt: new Date().toISOString()
    };

    data.records[index] = updatedRecord;
    writeDb(data);
    return parseRecord(updatedRecord);
}

function deleteRecord(formType, id) {
    const data = getDb();
    const index = data.records.findIndex(record => record.formType === formType && Number(record.id) === Number(id));
    if (index === -1) return false;

    data.records.splice(index, 1);
    writeDb(data);
    return true;
}

module.exports = {
    FORM_TYPES,
    initDb,
    parseUser,
    parseRecord,
    getRawUserByEmail,
    getRawUserById,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getStats,
    getCounts,
    getRecordsByForm,
    getRawRecord,
    createRecord,
    updateRecord,
    deleteRecord
};
