document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberInput = document.getElementById('remember-login');
    const message = document.getElementById('login-message');
    const userCount = document.getElementById('login-user-count');
    const recordCount = document.getElementById('login-record-count');

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
            userCount.textContent = '1';
            recordCount.textContent = '0';
        }
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage('Please enter your email and password.');
            return;
        }

        try {
            const { user } = await API.login(email, password, rememberInput.checked);
            showMessage(`Welcome, ${user.name}. Opening dashboard...`, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 350);
        } catch (error) {
            showMessage(error.message || 'Login failed. Please try again.');
        }
    });

    redirectIfAuthenticated();
    loadStats();
});
