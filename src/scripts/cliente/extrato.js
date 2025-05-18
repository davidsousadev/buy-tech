// extrato.js

import * as config from '../consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');

const extratoCliente = document.getElementById("extratoCliente");

async function extrato() {
    if (tokenCliente || tokenClienteRefresh) {
        displayLoader(true);
        disableSubmitButton(true);
        try {
            const response = await fetch(`${config.API_URL}/operacoes/extrato`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar extrato: ${response.status}`);
            }

            const result = await response.json();
            extratoCliente.innerHTML = ""; // Limpa antes de exibir

            if (result && result.length > 0) {
                result.forEach((operacao) => {
                    const li = document.createElement("li");
                    li.classList.add("operacao-card");
                    li.innerHTML = `
                    <div class="operacao-body">
                        <span class="operacao-title">Operação #${operacao.id}</span>
                        <p><strong>Valor:</strong> R$ ${operacao.valor.toFixed(2)}</p>
                        <p><strong>Motivo:</strong> ${motivoTexto(operacao.motivo)}</p>
                        <p><strong class="${operacao.tipo === 1 ? "credito" : "debito"}">Tipo:</strong> ${operacao.tipo === 1 ? "Crédito" : "Débito"}</p>
                        <p><strong>Data:</strong> ${operacao.criacao_da_operacao}</p>
                    </div>
                `;
                    extratoCliente.appendChild(li);
                });
                displayLoader(false);
                disableSubmitButton(false);
            } else {
                extratoCliente.innerHTML = "<p>Nenhuma operação encontrada.</p>";
                displayLoader(false);
                disableSubmitButton(false);
            }
        } catch (error) {
            setTimeout(() => {
                extrato();
            }
            , 1000);
        }
    }
}

// Função para traduzir os motivos
function motivoTexto(motivo) {
    switch (motivo) {
        case 1: return "Referência";
        case 2: return "Cashback";
        case 3: return "Pagamento";
        default: return "Desconhecido";
    }
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

// Chamar a função ao carregar a página
extrato();
