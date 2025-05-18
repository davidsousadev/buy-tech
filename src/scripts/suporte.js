// suporte.js

import * as config from './consts.js';

const formSuporte = document.getElementById('formSuporte');

if (formSuporte) {
    formSuporte.addEventListener('submit', async (event) => {
        event.preventDefault();

        const mensagem = document.getElementById('enviar_email').value;

        if (!mensagem) {
            mostrarNotificacao("Digite uma mensagem", {
                cor: "#F44336",
                duracao: 4000,
                posicao: "bottom-right"
            });
            return;
        }

        if (!tokenCliente && !tokenClienteRefresh) {
            window.location.href = 'logar.html';
            return;
        }

        try {
            const authResponse = await fetch(`${config.API_URL}/clientes/autenticar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
            });

            if (!authResponse.ok) {
                throw new Error("Erro na autenticação");
            }

            const authResult = await authResponse.json();
            const userId = authResult.id;
            // Exibe o loader e desabilita o botão
            displayLoader(true);
            disableSubmitButton(true);
            const response = await fetch(`${config.API_URL}/emails/suporte/${userId}`, {
                method: 'POST',
                body: JSON.stringify({ enviar_email: mensagem }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar a mensagem ao suporte.');
            }
            displayLoader(false);
            disableSubmitButton(false);
            mostrarNotificacao("Mensagem enviada com sucesso!", {
                cor: "#4CAF50",
                duracao: 4000,
                posicao: "bottom-right"
            });

            setTimeout(() => {
                window.location.href = 'suporte.html';
            }, 5000);

        } catch (error) {
            displayLoader(false);
            disableSubmitButton(false);
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    });
}

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