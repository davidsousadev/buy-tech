// logadoRevendedor.js
import config from '../config.js';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};


const tokenRevendedor = getCookie('authTokenRevendedor');
const tokenRevendedorRefresh = getCookie('authTokenRevendedorRefresh');

if (tokenRevendedor || tokenRevendedorRefresh) {
  const exit = document.getElementById('exit');
  exit.classList.add('bx-exit');
  // Função assíncrona para fazer a requisição à API
  async function authenticate() {
    try {
      const response = await fetch(`${config.API_URL}/revendedores/autenticar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`,
        },
      });

      if (!response.ok) {
        //document.cookie = 'authTokenAdmin=; Max-Age=0; path=/;';
        throw new Error(`Erro ao autenticar: ${response.statusText}`);
      }

      const result = await response.json();


    } catch (error) {
      setTimeout(() => {
        authenticate();
      }, 10000);
    }
  }

  // Chama a função de autenticação
  authenticate();
}
else {
  window.location.href = '../index.html';
}

const themeToggleButton = document.getElementById('theme-toggle');

// Função para injetar estilos da barra de rolagem
function aplicarEstiloScrollBar(trackColor, thumbColor, borderRadius) {
  const styleTagId = 'custom-scrollbar-style';

  // Remove estilo antigo, se existir
  const existingStyle = document.getElementById(styleTagId);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Cria novo <style>
  const style = document.createElement('style');
  style.id = styleTagId;
  style.innerHTML = `
    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-track {
      background-color: ${trackColor};
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${thumbColor};
      border-radius: ${borderRadius};
    }

    ::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;

  document.head.appendChild(style);

  // Firefox
  document.body.style.scrollbarColor = `${thumbColor} ${trackColor}`;
  document.body.style.scrollbarWidth = 'thin';
}

// Função para aplicar o tema
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    aplicarEstiloScrollBar('#004AAD', '#FFF', '5px');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    aplicarEstiloScrollBar('#FFF', '#004AAD', '0px');
  }
}

// Verificar se há um tema armazenado no localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  // Detectar o tema do sistema
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(systemTheme);
}

// Alternar o tema ao clicar no botão
themeToggleButton.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme); // Salva a escolha do usuário
});


