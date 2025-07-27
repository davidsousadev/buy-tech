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
            // Monta a estrutura da tabela
            let tabelaHTML = `
<table class="operacao-tabela">
  <thead>
    <tr>
      <th>ID</th>
      <th>Valor</th>
      <th>Motivo</th>
      <th>Tipo</th>
      <th>Data</th>
    </tr>
  </thead>
  <tbody>
`;

            // Verifica se há dados
            if (result && result.length > 0) {
                result.forEach((operacao) => {
                    tabelaHTML += `
        <tr class="${operacao.tipo === 1 ? 'credito' : 'debito'}">
          <td>#${operacao.id}</td>
          <td>R$ ${operacao.valor.toFixed(2)}</td>
          <td>${motivoTexto(operacao.motivo)}</td>
          <td>${operacao.tipo === 1 ? 'Crédito' : 'Débito'}</td>
          <td>${operacao.criacao_da_operacao}</td>
        </tr>
      `;
                });

                // Fecha a tabela
                tabelaHTML += `
    </tbody>
  </table>
  `;

                // Adiciona no DOM
                extratoCliente.innerHTML += tabelaHTML;


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
