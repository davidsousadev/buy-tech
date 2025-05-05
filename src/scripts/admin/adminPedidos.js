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
    try {
        const response = await fetch(`${config.API_URL}/pedidos/admin/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
            },
        });

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
            alert(`Erro ao cancelar o pedido #${id}`);
        }
    } catch (error) {
        setTimeout(() => {
            cancelarPedido(id);
        }, 100);
    }
}


async function extrato(editar) {

    if (tokenAdmin || tokenAdminRefresh) {
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

            if (result && result.length > 0) {
                result.forEach((pedido) => {
                    let statusPedido = "";
                    let botoes = ""; // Variável para os botões
                    let codigoPedido = "";
                    if (editar === undefined && pedido.codigo === "" && pedido.status===false) {
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
                    }
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
                    } else if (editar === false && pedido.codigo.length > 6 && pedido.status) {
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
                    }
                });
            } else {
                listaDePedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
            }
        } catch (error) {
            setTimeout(() => {
                extrato(editar);
            }, 100);
        }
    }
}
