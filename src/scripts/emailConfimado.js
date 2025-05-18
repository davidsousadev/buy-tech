//emailConfirmado.js

import * as config from './consts.js';

const urlParams = new URLSearchParams(window.location.search);
const codigo = urlParams.get("codigo");
const confirmado = document.getElementById('confirmado');
const btnLogin = document.getElementById('btnLogin');

// Evento de pressionar "Enter"
document.querySelector("#barSearch").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        buscar(); // Chama a função de busca ao pressionar Enter
    }
});

// Evento de clique no botão de busca
document.querySelector("#searchBtn").addEventListener("click", buscar);

function buscar() {
    const termoBusca = document.querySelector("#barSearch").value.trim();
    if (termoBusca) {
        window.location.href = `${config.FRONT_URL}/index.html?nome=${encodeURIComponent(termoBusca)}`;
    }
}

if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        window.location.href = `../../logar.html`;
    });
}

if (codigo) {

    try {
        const response = await fetch(`${config.API_URL}/emails/confirmado/?codigo=${codigo}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json();

        if (result.email === true) {
            confirmado.innerHTML = `E-mail Confirmado com sucesso!`;
        } else {
            confirmado.innerHTML = `${result.detail}`;
        }
    } catch (error) {
        setTimeout(() => {
            location.reload();
        }, 10000);
    }
}

const themeToggleButton = document.getElementById('theme-toggle');

// Função para aplicar o tema
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

// Verificar se há um tema armazenado no localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    // Detectar o tema do sistema (opcional)
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
