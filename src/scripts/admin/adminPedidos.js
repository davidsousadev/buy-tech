// adminPedidos.js

import * as config from '../consts.js';

const listaDePedidos = document.getElementById("listaDePedidos");
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');

async function cancelarPedido(id) {
    displayLoader(true);
    disableButton(true);
    try {
        const response = await fetch(`${config.API_URL}/pedidos/admin/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
            },
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
            window.location.href = 'lista_pedidos_cancelados.html';
        } else {
            mostrarNotificacao(result.detail, {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            displayLoader(false);
            disableButton(false);
        }
    } catch (error) {
        setTimeout(() => {
            cancelarPedido(id);
        }, 1000);
    }
}


async function extrato(editar) {

    if (tokenAdmin || tokenAdminRefresh) {
        displayLoader(true);
        try {
            const response = await fetch(`${config.API_URL}/pedidos/admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                },
            });

            const result = await response.json();

            listaDePedidos.innerHTML = "";
            var quantidadeDePedidos = 0;
            if (result && result.length > 0) {

                result.forEach((pedido) => {
                    let statusPedido = "";
                    let botoes = ""; // Variável para os botões
                    let codigoPedido = "";

                    // Pedido Cancelado
                    if (editar === undefined && pedido.codigo === "" && pedido.status === false) {
                        statusPedido = "Pedido Cancelado";
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
                            <p><strong>Pontos Fidelidade:</strong> ${pedido.pontos_fidelidade_resgatados.toFixed(2)}</p>
                            <p><strong>Produtos:</strong> ${pedido.produtos}</p>
                            <p><strong>Status:</strong> ${statusPedido}</p>
                            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                            ${botoes} <!-- Adiciona os botões somente se necessário -->
                        </div>
                    `;
                        listaDePedidos.appendChild(li);
                        quantidadeDePedidos++;
                    }
                    // Pedido Pago
                    else if (editar === true && pedido.codigo.length === 6 && pedido.status) {
                        statusPedido = "Pedido Pago";
                        codigoPedido = pedido.codigo;
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
                            <p><strong>Pontos Fidelidade:</strong> ${pedido.pontos_fidelidade_resgatados.toFixed(2)}</p>
                            <p><strong>Produtos:</strong> ${pedido.produtos}</p>
                            <p><strong>Status:</strong> ${statusPedido}</p>
                            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                            ${botoes} <!-- Adiciona os botões somente se necessário -->
                        </div>
                    `;
                        listaDePedidos.appendChild(li);
                        quantidadeDePedidos++;

                    }
                    // Pedido Aguardando Pagamento
                    else if (editar === false && pedido.codigo.length > 6 && pedido.status) {
                        codigoPedido = "Pedido está esperando pagamento";
                        statusPedido = "Pedido está esperando pagamento";
                        botoes = ` <button class="cancel-btn" onclick="cancelarPedido(${pedido.id})">Cancelar Pedido</button>`;
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
                            <p><strong>Pontos Fidelidade:</strong> ${pedido.pontos_fidelidade_resgatados.toFixed(2)}</p>
                            <p><strong>Produtos:</strong> ${pedido.produtos}</p>
                            <p><strong>Status:</strong> ${statusPedido}</p>
                            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                            ${botoes} <!-- Adiciona os botões somente se necessário -->
                        </div>
                    `;
                        listaDePedidos.appendChild(li);
                        quantidadeDePedidos++;
                    }

                });
                displayLoader(false);
            } else {
                listaDePedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
                displayLoader(false);
            }
            if (quantidadeDePedidos === 0) {
                listaDePedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
                displayLoader(false);
            }
            else {
                listaDePedidos.innerHTML += `<hr /><p>Total de pedidos: ${quantidadeDePedidos} ${quantidadeDePedidos === 1 ? 'pedido' : 'pedidos'}.</p>`;

                displayLoader(false);
            }
        } catch (error) {
            setTimeout(() => {
                extrato(editar);
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
const disableButton = (isDisabled) => {
    // Seleciona o botão pela classe "botaoAtivarDesativar"
    const submitButton = document.querySelector('.botaoAtivarDesativar');

    if (submitButton) {
        submitButton.disabled = isDisabled;
    }
};

window.extrato = extrato;
window.cancelarPedido = cancelarPedido;
