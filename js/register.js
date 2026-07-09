document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmInput = document.getElementById('register-confirm-password');
    const message = document.getElementById('register-message');
    const userCount = document.getElementById('register-user-count');
    const recordCount = document.getElementById('register-record-count');

    function showMessage(text, type = 'error') {
        message.textContent = text;
        message.dataset.type = type;
    }

    async function loadStats() {
        try {
            const stats = await API.getStats();
            userCount.textContent = stats.userCount;
            recordCount.textContent = stats.recordCount;
        } catch {
            userCount.textContent = '0';
            recordCount.textContent = '0';
        }
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        if (!name || !email || !password || !confirm) {
            showMessage('Please complete all fields.');
            return;
        }

        if (password !== confirm) {
            showMessage('Passwords do not match.');
            return;
        }

        try {
            await API.register({ name, email, password });
            showMessage('Account request submitted. Please wait for admin approval.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1400);
        } catch (error) {
            showMessage(error.message || 'Account creation failed.');
        }
    });

    loadStats();
});