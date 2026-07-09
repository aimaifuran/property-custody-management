const API = {
    async request(path, options = {}) {
        const controller = new AbortController();
        const timeoutMs = options.timeout || 8000;
        const signal = options.signal || controller.signal;
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        let response;
        try {
            response = await fetch(path, {
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
                signal,
                ...options
            });
        } catch (err) {
            if (err.name === 'AbortError') throw new Error('Request timed out');
            throw err;
        } finally {
            clearTimeout(timer);
        }

        let payload = null;
        const text = await response.text();
        if (text) {
            try {
                payload = JSON.parse(text);
            } catch {
                payload = { error: text };
            }
        }

        if (!response.ok) {
            throw new Error(payload?.error || 'Request failed.');
        }

        return payload;
    },

    login(email, password, remember = true) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, remember })
        });
    },

    logout() {
        return this.request('/api/auth/logout', { method: 'POST' });
    },

    getMe() {
        return this.request('/api/auth/me');
    },

    getStats() {
        return this.request('/api/auth/stats');
    },

    getUsers() {
        return this.request('/api/users');
    },

    createUser(user) {
        return this.request('/api/users', {
            method: 'POST',
            body: JSON.stringify(user)
        });
    },

    updateUser(id, user) {
        return this.request(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user)
        });
    },

    deleteUser(id) {
        return this.request(`/api/users/${id}`, { method: 'DELETE' });
    },

    getRecordCounts() {
        return this.request('/api/records/counts');
    },

    getRecords(formType) {
        return this.request(`/api/records/${formType}`);
    },

    createRecord(formType, record) {
        return this.request(`/api/records/${formType}`, {
            method: 'POST',
            body: JSON.stringify(record)
        });
    },

    updateRecord(formType, id, record) {
        return this.request(`/api/records/${formType}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(record)
        });
    },

    deleteRecord(formType, id) {
        return this.request(`/api/records/${formType}/${id}`, { method: 'DELETE' });
    }
};

window.API = API;
