export const login = async () => {
    const form = document.getElementById('formLogin');
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

            // Identifica o tipo de login (Admin ou Revendedor)
            const tipoUsuario = document.getElementById('tipoUsuario').value; // 'admin' ou 'revendedor'

            if (!tipoUsuario) {
                mostrarNotificacao('Por favor, selecione o tipo de usuário.!', {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                return;
            }

            // Define o endpoint e o token com base no tipo de usuário
            let url = '';
            let authTokenName = '';

            if (tipoUsuario === 'admin') {
                url = ' https://api-buy-tech.onrender.com/admins/logar';
                authTokenName = 'authTokenAdmin';
            } else if (tipoUsuario === 'revendedor') {
                url = ' https://api-buy-tech.onrender.com/revendedores/logar';
                authTokenName = 'authTokenRevendedor';
            } else if (tipoUsuario === 'cliente') {
                url = ' https://api-buy-tech.onrender.com/clientes/logar';
                authTokenName = 'authTokenCliente';
            } else {
                mostrarNotificacao('Tipo de usuário inválido.!', {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                return;
            }

            displayLoader(true);
            disableSubmitButton(true);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();
                displayLoader(false);
                disableSubmitButton(false);

                if (response.ok) {
                    // Armazena o token no cookie com tempo de expiração
                    document.cookie = `${authTokenName}=${result.access_token}; path=/; max-age=${6000}`;
                    document.cookie = `${authTokenName}Refresh=${result.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
                    mostrarNotificacao("Logado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = `${tipoUsuario}`;
                    }, 3000);

                } else {
                    mostrarNotificacao(`${result.detail}`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                }
            } catch (error) {
                displayLoader(false);
                disableSubmitButton(false);
                mostrarNotificacao(`Erro ao enviar os dados. Tente novamente.`, {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
        });
    }
    
};

// Função para exibir/esconder o loader
const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = isLoading ? 'flex' : 'none';
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