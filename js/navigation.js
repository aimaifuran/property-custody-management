document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (!toggle || !sidebar) return;

    function setMenuOpen(isOpen) {
        document.body.classList.toggle('sidebar-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => {
        setMenuOpen(!document.body.classList.contains('sidebar-open'));
    });

    sidebar.addEventListener('click', event => {
        if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('click', event => {
        const isOpen = document.body.classList.contains('sidebar-open');
        const clickedMenu = event.target.closest('.sidebar');
        const clickedToggle = event.target.closest('.sidebar-toggle');

        if (isOpen && !clickedMenu && !clickedToggle) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenuOpen(false);
    });
});
