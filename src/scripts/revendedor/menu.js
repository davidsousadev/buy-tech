const opcoes_perfil = document.getElementById('opcoes_perfil');
const itens_carrinho = document.getElementById('itens_carrinho');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');
const tokenRevendedor = getCookie('authTokenRevendedor');
const tokenRevendedorRefresh = getCookie('authTokenRevendedorRefresh');
async function listaItensCarrinho() {

    if (tokenCliente || tokenClienteRefresh) {
        try {
            const response = await fetch('https://api-buy-tech.onrender.com/carrinhos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
            });

            const resultadoItensCarrinho = await response.json();
            if (resultadoItensCarrinho.detail) {
                if (resultadoItensCarrinho.detail === "Token expirado!") {
                    document.cookie = 'authTokenCliente=; Max-Age=0; path=/;';
                    document.cookie = 'authTokenClienteRefresh=; Max-Age=0; path=/;';
                    mostrarNotificacao(`Token expirado!`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = './logar.html';
                    }, 5000);
                }
                if (resultadoItensCarrinho.detail === "Carrinho vazio!") {
                    finalizar_pedido.style.display = "none";
                    lista_itens.innerHTML = `<p class="carrinho-vazio-texto">Seu carrinho está vazio.</p>`;
                }
                return;
            }

            lista_itens.innerHTML = "";
            var valorTotalItens = 0;
            var quantidadeDeProdutos = 0;
            for (const produto of resultadoItensCarrinho) {
                if (produto.codigo.length != 6) {
                    try {
                        const produtoResponse = await fetch(`https://api-buy-tech.onrender.com/produtos/${produto.produto_codigo}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const produtoDetalhes = await produtoResponse.json();

                        const li = document.createElement("li");
                        var total_item = (produto.quantidade * produtoDetalhes.preco).toFixed(2);
                        valorTotalItens += parseFloat(total_item);

                        li.innerHTML = `
                        <div class="card-carrinho">
                            <img src="${produtoDetalhes.foto}" alt="${produtoDetalhes.nome}" class="card-carrinho-img">
                            <div class="card-body">
                                <h3 class="card-carrinho-title">${produtoDetalhes.nome}</h3>
                                <p class="card-carrinho-brand">Marca: ${produtoDetalhes.marca}</p>
                                <p class="card-carrinho-price">R$ ${produtoDetalhes.preco.toFixed(2)}</p>
                                <div class="card-carrinho-quantity">
                                    <strong>Quantidade: <input type="number" id="quantidade_${produto.produto_codigo}" value="${produto.quantidade}" min="0"></strong>
                                    
                                    <span>Total: R$ ${total_item}</span>
                                </div>
                                    <div id="btn-cart">
                                        
                                        <button class="btn-cart" onclick="verDetalhes(${produtoDetalhes.id})">Ver Detalhes</button>
                                        <button class="btn-cart" onclick="atualizarQuantidade(${produto.produto_codigo}, ${produto.id}, ${produto.cliente_id})">Atualizar</button>
                                    </div>
                            </div>
                        </div>
                    `;
                        quantidadeDeProdutos += 1;
                        lista_itens.appendChild(li);
                    } catch (error) {
                        console.error("Erro ao buscar detalhes do produto:", error);
                    }
                }
            }

            const total = document.createElement("li");
            total.innerHTML = `Total itens: R$: ${valorTotalItens.toFixed(2)}`;
            lista_itens.appendChild(total);
            if (quantidadeDeProdutos != 0) {
                finalizar_pedido.style.display = "block";
            }
            else {
                finalizar_pedido.style.display = "none";
                lista_itens.innerHTML = `<p class="carrinho-vazio-texto">Seu carrinho está vazio.</p>`;
            }


        } catch (error) {
            console.error("Erro ao carregar o carrinho:", error);
        }
    }

}

async function atualizarQuantidade(produtoCodigo, codigoCarrinho, idCliente) {

    const novaQuantidade = document.getElementById(`quantidade_${produtoCodigo}`).value;
    if ((tokenCliente || tokenClienteRefresh) && novaQuantidade) {
        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/carrinhos/${codigoCarrinho}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
                body: JSON.stringify({
                    id: codigoCarrinho,
                    produto_codigo: produtoCodigo,
                    cliente_id: idCliente,
                    quantidade: novaQuantidade,
                }),
            });

            const resultado = await response.json();
            if (resultado) {
                if (resultado.message) {
                    mostrarNotificacao("Produto Atualizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                }
                if (resultado.detail === "Item removido do carrinho!") {
                    mostrarNotificacao(`${resultado.detail}`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 5000);
                }
                if (resultado.detail === "Token expirado!") {
                    mostrarNotificacao(`Token expirado!`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = './logar.html';
                    }, 5000);
                }
                if (resultado.detail === "Pedido maior que estoque!") {
                    mostrarNotificacao(`Pedido maior que estoque!`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                }
            }//

            // Atualizar a lista de itens após a alteração da quantidade
            listaItensCarrinho();

        } catch (error) {
            //console.error("Erro ao atualizar a quantidade:", error);
        }
    }
}

function buyCart() {
    if (tokenCliente || tokenClienteRefresh) {
        opcoes_perfil.style.display = 'none';
        if (itens_carrinho.style.display === 'block') {
            itens_carrinho.style.display = 'none';
        } else {
            itens_carrinho.style.display = 'block';
        }
    }
}

function toggleDrawer() {
    if (tokenCliente || tokenClienteRefresh) {
        itens_carrinho.style.display = 'none';
        if (opcoes_perfil.style.display === 'block') {
            opcoes_perfil.style.display = 'none';
        } else {
            opcoes_perfil.style.display = 'block';
        }
    }
}

function opcoes(qtd) {
    if (!tokenCliente || !tokenClienteRefresh) {
        if (qtd === 0) {
            var voltar = '.';
            window.location.href = `${voltar}/logar.html`; // Redireciona para a página de login
        }
        else {
            var voltar = '';
            for (var i = 0; i < qtd; i++) {
                voltar += '../';
            }
            window.location.href = `${voltar}logar.html`; // Redireciona para a página de login       
        }
    }
    else {
        toggleDrawer();
    }
}

function pedido(qtd) {
    if (!tokenCliente || !tokenClienteRefresh) {
        window.location.href = 'logar.html';
    }
    else {
        async function authenticate() {
            try {
                const response = await fetch('https://api-buy-tech.onrender.com/clientes/autenticar', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    const saldo = document.getElementById('saldo');
                    if (qtd === 0) {
                        var voltar = '.';
                        window.location.href = `cliente/pedido.html?id=${result.id}`;
                    }
                    else {
                        var voltar = '';
                        for (var i = 0; i < qtd; i++) {
                            voltar += '../';
                        }
                        console.log(`${voltar}cliente/pedido.html?id=${result.id}`)
                        window.location.href = `${voltar}cliente/pedido.html?id=${result.id}`;
                    }
                }



            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
            }
        }

        // Chama a função de autenticação
        authenticate();

    }
}

// Preenche o campo de busca com o termo na URL, se existir
window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const termoBusca = urlParams.get('nome');
    if (termoBusca) {
        document.querySelector("#barSearch").value = decodeURIComponent(termoBusca);
    }
});

listaItensCarrinho();

