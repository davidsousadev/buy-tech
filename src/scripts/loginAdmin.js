//loginAdmin.js

import * as config from './consts.js';

export const login = async () => {
    const form = document.getElementById('formLoginAdmin');
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
                const response = await fetch(`${config.API_URL}/admins/logar`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();
                displayLoader(false);
                disableSubmitButton(false);

                if (response.ok && result.access_token) {
                    // Armazena o token no cookie com tempo de expiração
                    document.cookie = `authTokenAdmin=${result.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
                    document.cookie = `authTokenAdminRefresh=${result.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
                    window.location.href = '/admin';
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