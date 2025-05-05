// extrato.js

import * as config from '../consts.js';

const extratoCliente = document.getElementById("extratoCliente");

async function extrato() {
    if (tokenRevendedor || tokenRevendedorRefresh) {
    try {
        const response = await fetch(`${config.API_URL}/operacoes_revendedor/extrato`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`
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
        } else {
            extratoCliente.innerHTML = "<p>Nenhuma operação encontrada.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar extrato:", error);
        extratoCliente.innerHTML = "<p>Erro ao carregar o extrato.</p>";
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

// Chamar a função ao carregar a página
extrato();
