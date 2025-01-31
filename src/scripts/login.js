export const login = async () => {
    const form = document.getElementById('formLogin');
    const submitButton = document.getElementById('submitButton');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            let formData = {
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value.trim(),
            };

            if (!formData.email || !formData.password) {
                displayMessage('Todos os campos devem ser preenchidos.');
                return;
            }

            displayLoader(true);
            disableSubmitButton(true);

            try {
                const response = await fetch('https://api-buy-tech.onrender.com/clientes/logar', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();
                console.log('Resposta da API:', result);

                displayLoader(false);
                disableSubmitButton(false);

                if (response.ok) {
                    // Armazena o token no cookie com tempo de expiração
                    document.cookie = `authToken=${result.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
                    displayMessage('Logado com sucesso!', 'success');
                    window.location.href = './index.html';
                } else {
                    displayMessage(result.detail || 'Erro ao realizar o login.');
                }
            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
                displayLoader(false);
                disableSubmitButton(false);
                displayMessage('Erro ao enviar os dados. Tente novamente.');
            }
        });
    }
};

// Função para exibir mensagens de sucesso ou erro
const displayMessage = (message, type = 'error') => {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.style.color = type === 'success' ? 'green' : 'red';
    }
};

// Função para exibir/esconder o loader
const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = isLoading ? 'block' : 'none';
    }
};

// Função para habilitar/desabilitar o botão de submit
const disableSubmitButton = (isDisabled) => {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.disabled = isDisabled;
    }
};


login();