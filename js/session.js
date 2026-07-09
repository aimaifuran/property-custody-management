const FORM_LABELS = {
    ris: 'Requisition & Issue Slip',
    ics: 'Inventory Custodian Slip',
    par: 'Property Acknowledgement Receipt',
    'property-card': 'Property Card',
    iar: 'Inspection & Acceptance Report',
    ptr: 'Property Transfer Report',
    prs: 'Property Return Slip'
};

function isAdminUser(user) {
    return (user?.role || '').toLowerCase() === 'admin';
}

function canAccessForm(user, pageKey) {
    if (!user) return false;
    if (isAdminUser(user)) return true;
    return (user.allowedForms || []).includes(pageKey);
}

function setupSidebar(user) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || !user) return;

    sidebar.querySelector('a[href="login.html"]')?.remove();

    if (sidebar.querySelector('.sidebar-user')) return;

    const userBlock = document.createElement('div');
    userBlock.className = 'sidebar-user';
    userBlock.innerHTML = `
        <div class="sidebar-user-info">
            <strong>${escapeSidebarText(user.name)}</strong>
            <span>${escapeSidebarText(user.role)}</span>
        </div>
        <button type="button" id="logout-btn" class="sidebar-logout">Logout</button>
    `;
    sidebar.appendChild(userBlock);

    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await API.logout();
        } finally {
            window.location.href = 'login.html';
        }
    });
}

function escapeSidebarText(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function applySidebarAccess(user) {
    if (!user || isAdminUser(user)) return;

    document.querySelectorAll('.sidebar a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const pageKey = href.replace('.html', '');
        if (FORM_LABELS[pageKey] && !canAccessForm(user, pageKey)) {
            link.style.display = 'none';
        }
        if (href === 'user-management.html') {
            link.style.display = 'none';
        }
    });
}

async function requireAuth(options = {}) {
    try {
        const { user } = await API.getMe();
        window.currentUser = user;
        setupSidebar(user);
        applySidebarAccess(user);

        if (options.adminOnly && !isAdminUser(user)) {
            window.location.href = 'index.html';
            return null;
        }

        return user;
    } catch {
        window.location.href = 'login.html';
        return null;
    }
}

async function redirectIfAuthenticated() {
    try {
        await API.getMe();
        window.location.href = 'index.html';
    } catch {
        // Stay on login page.
    }
}

window.requireAuth = requireAuth;
window.redirectIfAuthenticated = redirectIfAuthenticated;
window.canAccessForm = canAccessForm;
window.isAdminUser = isAdminUser;
