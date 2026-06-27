const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
        window.location.href = 'admin-noticias.html';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.style.display = 'none';
            loginError.textContent = '';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Assuming the backend returns a token in data.token or data.accessToken
                    const token = data.token || data.accessToken || data.token_access; // Adapt based on actual API
                    if(token) {
                        localStorage.setItem('adminToken', token);
                        window.location.href = 'admin-noticias.html';
                    } else {
                        throw new Error("Token não recebido do servidor.");
                    }
                } else {
                    loginError.textContent = data.message || 'Email ou senha inválidos.';
                    loginError.style.display = 'block';
                }
            } catch (error) {
                console.error('Erro de login:', error);
                loginError.textContent = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
                loginError.style.display = 'block';
            }
        });
    }
});
