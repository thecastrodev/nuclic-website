const API_URL = 'http://localhost:3000';

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin-login.html';
        return null;
    }
    return token;
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Only check auth if we are not on the login page
    if (!window.location.pathname.includes('admin-login.html')) {
        checkAuth();
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Helper for authenticated fetch
async function fetchWithAuth(endpoint, options = {}) {
    const token = checkAuth();
    if (!token) return;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        logout();
        return;
    }

    return response;
}
