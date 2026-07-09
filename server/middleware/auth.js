function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    if ((req.session.role || '').toLowerCase() !== 'admin') {
        return res.status(403).json({ error: 'Administrator access required.' });
    }
    next();
}

function canAccessForm(session, formType) {
    if ((session.role || '').toLowerCase() === 'admin') return true;
    const allowed = session.allowedForms || [];
    return allowed.includes(formType);
}

module.exports = {
    requireAuth,
    requireAdmin,
    canAccessForm
};
