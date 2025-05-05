//logadoUser.js

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
};

const themeToggleButton = document.getElementById('theme-toggle');

// Verificar se há um tema armazenado no localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(systemTheme);
}

// Alternar o tema ao clicar no botão
themeToggleButton.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Salvar a escolha do usuário
});

// Verificar o tipo de usuário e autenticar

const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');
const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');
const tokenRevendedor = getCookie('authTokenRevendedor');
const tokenRevendedorRefresh = getCookie('authTokenRevendedorRefresh');

// Autenticar administrador
if (tokenAdmin || tokenAdminRefresh) {
    window.location.href = 'admin';
}

// Autenticar cliente
else if (tokenCliente || tokenClienteRefresh) {
    window.location.href = 'cliente';
}

// Autenticar revendedor
else if (tokenRevendedor || tokenRevendedorRefresh) {
    window.location.href = 'revendedor';
}
