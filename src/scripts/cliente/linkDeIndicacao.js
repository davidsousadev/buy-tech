// linkDeIndicacao.js

import * as config from '../consts.js';

const linkDeIndicacaoTexto = document.getElementById('link_de_indicacao_texto');
const copiarLinkBtn = document.getElementById('copiar_link');
const notificacao = document.getElementById('notificacao');

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');
document.getElementById('copiar_link').addEventListener('click', copiarCodigo);

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

// Função para copiar o código do link
export function copiarCodigo() {
    const codigo = linkDeIndicacaoTexto.innerText;
    navigator.clipboard.writeText(codigo).then(() => {
        mostrarNotificacao("Link copiado com sucesso!", {
            cor: "#4CAF50",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
    }).catch(err => {
        setTimeout(() => {
            copiarCodigo();
        }, 2000);
    });
}

// Verificando se o token existe
if (tokenCliente || tokenClienteRefresh) {
    async function authenticate() {
        displayLoader(true);
        disableSubmitButton(true);
        try {
            // Fazendo a requisição para autenticar o cliente
            const response = await fetch(`${config.API_URL}/clientes/autenticar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                const clienteId = result.id;

                // Atualizando o texto do link de indicação
                const link = `${config.FRONT_URL}/cadastrar.html?ref=${clienteId}`;
                linkDeIndicacaoTexto.textContent = link;
                displayLoader(false);
                disableSubmitButton(false);
            } else {
                mostrarNotificacao("Erro ao autenticar!", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                displayLoader(false);
                disableSubmitButton(false);
            }
        } catch (error) {
            setTimeout(() => {
                authenticate();
            }, 2000);
        }
    }

    // Chama a função de autenticação
    authenticate();
} 