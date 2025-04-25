const listaDePedidos = document.getElementById("listaDePedidos");
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
async function cancelarPedido(id) {
    try {
        const response = await fetch(`https://api-buy-tech.onrender.com/pedidos_revendedor/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`
            },
            body: JSON.stringify({ status: "Cancelado" })
        });

        if (response.ok) {
            mostrarNotificacao("Pedido Cancelado com sucesso!", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            window.location.href = 'pedidos.html';
        } else {
            alert(`Erro ao cancelar o pedido #${id}`);
        }
    } catch (error) {
        console.error("Erro ao cancelar pedido:", error);
    }
}


async function extrato() {
    if (tokenRevendedor || tokenRevendedorRefresh) {
        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/operacoes_revendedor/pendencias`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`
                },
            });

            const result = await response.json();
            console.log(result);
            listaDePedidos.innerHTML = "";

            if (result && result.length > 0) {
                result.forEach((pedido) => {
                    let statusPedido = "";
                    let botoes = ""; // Variável para os botões
                    let codigoPedido = "";
                    if (pedido.codigo.length > 6 && pedido.status) {
                        codigoPedido = "Pedido está esperando pagamento";
                        statusPedido = "Pedido está esperando pagamento";
                        // Só exibir os botões se o pedido estiver esperando pagamento
                        botoes = `
                            <div class="buttons">
                                <button class="cancel-btn" onclick="cancelarPedido(${pedido.id})">Cancelar Pedido</button>
                                <button class="pay-btn" onclick="pagarPedido('${pedido.token_pagamento}')">Pagar Pedido</button>
                            </div>
                        `;
                    

                    const li = document.createElement("li");
                    li.classList.add("card");
                    li.innerHTML = `
                        <div class="card-body">
                            <h3 class="card-title">Pedido #${pedido.id}</h3>
                            <p><strong>Cliente:</strong> ${pedido.revendedor_id}</p>
                            <p><strong>Código:</strong> ${codigoPedido || "Cancelado"}</p>
                            <p><strong>Criação:</strong> ${pedido.criacao}</p>
                            <p><strong>Cupom de Desconto:</strong> ${pedido.cupom_de_desconto || "Nenhum"}</p>
                            <p><strong>Frete:</strong> R$ ${pedido.frete.toFixed(2)}</p>
                            <p><strong>Opção de Pagamento:</strong> ${pedido.opcao_de_pagamento ? "Boleto" : "À vista"}</p>
                            <p><strong>Pontos Fidelidade:</strong> ${pedido.pontos_fidelidade_resgatados}</p>
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
                listaDePedidos.innerHTML = "<p>Nenhuma pendência encontrada.</p>";
            }
        } catch (error) {
            console.error(error);
        }
    }
}


async function pagarPedido(tokenDePagamento) {
    if (tokenRevendedor || tokenRevendedorRefresh) {
        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/operacoes_revendedor/pagamentos/${tokenDePagamento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`
                },
            });

            const result = await response.json();
            console.log(result)
            if (result.detail === 'Pagamento não realizado, pontos fidelidade insuficientes!') {
                mostrarNotificacao("Pagamento não realizado, pontos fidelidade insuficientes!", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            } else {
                if (result.mensage === "Pagamento realizado com sucesso!") {
                    mostrarNotificacao("Pagamento realizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 5000);
                }
            }

        } catch (error) {
            console.error(error);
        }

    }
}
// Chamar a listagem ao carregar a página
extrato();
