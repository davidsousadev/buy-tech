//logadoCliente.js

import * as config from './consts.js';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');

if (tokenCliente || tokenClienteRefresh) {
  const avatar = document.getElementById('avatar');
  avatar.classList.remove('bx-user');
  avatar.classList.add('bxs-user-circle');
  // Função assíncrona para fazer a requisição à API
  async function authenticate() {
    try {
      const response = await fetch(`${config.API_URL}/clientes/autenticar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const saldo = document.getElementById('saldo');
        saldo.innerHTML = result.pontos_fidelidade.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }


    } catch (error) {
      setTimeout(() => {
        authenticate();
      }, 1000);
    }
  }

  // Chama a função de autenticação
  authenticate();
}

// Função de logout
export function logoutCliente(qtd) {
  // Remove os cookies "authTokenCliente e authTokenClienteRefresh"
  document.cookie = 'authTokenCliente=; Max-Age=0; path=/;';
  document.cookie = 'authTokenClienteRefresh=; Max-Age=0; path=/;';
  if (qtd === 0) {
    var voltar = '.';
    window.location.href = `${voltar}/logar.html`; // Redireciona para a página de login
  }
  else {
    var voltar = '';
    for (var i = 0; i < qtd; i++) {
      voltar += '../';
    }
    window.location.href = `${voltar}logar.html`; // Redireciona para a página de login       
  }
};

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
