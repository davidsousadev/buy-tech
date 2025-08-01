// pedidos.js

import * as config from '../consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');

const listaDePedidos = document.getElementById("listaDePedidos");

export async function cancelarPedido(id) {
    displayLoader(true);
    disableSubmitButton(true);
    try {
        const response = await fetch(`${config.API_URL}/pedidos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`
            },
            body: JSON.stringify({ status: "Cancelado" })
        });
        const result = await response.json();
        if (response.ok) {
            mostrarNotificacao("Pedido Cancelado com sucesso!", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            displayLoader(false);
            disableSubmitButton(false);
            setTimeout(() => {
                window.location.href = 'pedidos.html';
            }
                , 2000);
        } else {

            mostrarNotificacao(`${result.detail}`, {
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
            cancelarPedido(id);
        }, 1000);
    }
}


export async function extrato() {
    if (tokenCliente || tokenClienteRefresh) {
        displayLoader(true);
        try {
            const response = await fetch(`${config.API_URL}/pedidos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`
                },
            });

            const result = await response.json();
            listaDePedidos.innerHTML = "";

            if (result && result.length > 0) {
                result.forEach((pedido) => {
                    let statusPedido = "";
                    let botoes = ""; // Variável para os botões
                    let codigoPedido = "";
                    if (pedido.codigo.length === 6 && pedido.status) {
                        statusPedido = "Pedido Pago";
                        codigoPedido = pedido.codigo;
                    } else if (pedido.codigo === "" && !pedido.status) {
                        statusPedido = "Pedido Cancelado";
                    } else if (pedido.codigo.length > 6 && pedido.status) {
                        codigoPedido = "Pedido está esperando pagamento";
                        statusPedido = "Pedido está esperando pagamento";
                        // Só exibir os botões se o pedido estiver esperando pagamento
                        botoes = `
                            <div class="buttons">
                                <button class="cancel-btn" onclick="cancelarPedido(${pedido.id})">Cancelar Pedido</button>
                                <button class="pay-btn" onclick="pagarPedido('${pedido.token_pagamento}')">Pagar Pedido</button>
                            </div>
                        `;
                    }

                    const li = document.createElement("li");
                    li.classList.add("card");
                    li.innerHTML = `
                        <div class="card-body">
                            <h3 class="card-title">Pedido #${pedido.id}</h3>
                            <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                            <p><strong>Código:</strong> ${codigoPedido || "Cancelado"}</p>
                            <p><strong>Criação:</strong> ${pedido.criacao}</p>
                            <p><strong>Cupom de Desconto:</strong> ${pedido.cupom_de_desconto || "Nenhum"}</p>
                            <p><strong>Frete:</strong> R$ ${pedido.frete.toFixed(2)}</p>
                            <p><strong>Opção de Pagamento:</strong> ${pedido.opcao_de_pagamento ? "Boleto" : "À vista"}</p>
                            <p><strong>Pontos Fidelidade:</strong> ${pedido.pontos_fidelidade_resgatados}</p>
                            <p><strong>Status:</strong> ${statusPedido}</p>
                            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                            ${botoes} <!-- Adiciona os botões somente se necessário -->
                        </div>
                    `;
                    listaDePedidos.appendChild(li);
                });
                displayLoader(false);
            } else {
                listaDePedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
                displayLoader(false);
            }
        } catch (error) {
            setTimeout(() => {
                extrato();
            }, 1000);
        }
    }
}


export async function pagarPedido(tokenDePagamento) {
    if (tokenCliente || tokenClienteRefresh) {
        displayLoader(true);
        disableSubmitButton(true);
        try {
            const response = await fetch(`${config.API_URL}/operacoes/pagamentos/${tokenDePagamento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`
                },
            });

            const result = await response.json();

            if (result.detail) {
                mostrarNotificacao(`${result.detail}`, {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                displayLoader(false);
                disableSubmitButton(false);
            } else if (result.mensage === "Pagamento realizado com sucesso!") {
                mostrarNotificacao("Pagamento realizado com sucesso!", {
                    cor: "#4CAF50",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                displayLoader(false);
                disableSubmitButton(false);
                setTimeout(() => {
                    location.reload();
                }, 5000);
            }


        } catch (error) {
            setTimeout(() => {
                pagarPedido(tokenDePagamento);
            }, 1000);
        }

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

// Chamar a listagem ao carregar a página
extrato();

window.extrato = extrato;
window.pagarPedido = pagarPedido;
window.cancelarPedido = cancelarPedido;