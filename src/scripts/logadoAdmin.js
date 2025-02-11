const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const decodeToken = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = atob(payloadBase64);
        return JSON.parse(payloadDecoded);
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
};

const token = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');

if (token || tokenRefresh) {
    const exit = document.getElementById('exit');
    exit.classList.add('bx-exit');
    // Função assíncrona para fazer a requisição à API
    async function authenticate() {
        try {
            const response = await fetch('https://api-buy-tech.onrender.com/admins/autenticar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAdminRefresh}`,
                },
            });

            if (!response.ok) {
                //document.cookie = 'authTokenAdmin=; Max-Age=0; path=/;';
                throw new Error(`Erro ao autenticar: ${response.statusText}`);
            }

            const result = await response.json();
            //console.log(result.id);

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
    }

    // Chama a função de autenticação
    authenticate();
}
else {
    window.location.href = '../index.html';
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
