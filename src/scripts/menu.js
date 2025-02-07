const opcoes_perfil = document.getElementById('opcoes_perfil');
const itens_carrinho = document.getElementById('itens_carrinho');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

async function listaItensCarrinho() {
    var token = getCookie('authTokenCliente');
    if (token) {
        try {
            const response = await fetch('https://api-buy-tech.onrender.com/carrinhos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const resultadoItensCarrinho = await response.json();

            if (resultadoItensCarrinho.detail) {
                if (resultadoItensCarrinho.detail === "Token expirado!") {
                    document.cookie = 'authTokenCliente=; Max-Age=0; path=/;';
                    window.location.href = './logar.html';
                }
                if (resultadoItensCarrinho.detail === "Carrinho vazio!") {
                    lista_itens.innerHTML = "<p>Seu carrinho está vazio.</p>";
                }
                return;
            }

            lista_itens.innerHTML = "";
            var valorTotalItens = 0;
            for (const produto of resultadoItensCarrinho) {
                try {
                    const produtoResponse = await fetch(`https://api-buy-tech.onrender.com/produtos/${produto.produto_codigo}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const produtoDetalhes = await produtoResponse.json(); // Renomeei esta variável
                    
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
                                    <strong>Quantidade: <input type="number" id="quantidade_${produto.produto_codigo}" value="${produto.quantidade}" min="1"></strong>
                                    
                                    <span>Total: R$ ${total_item}</span>
                                </div>
                                    <div id="btn-cart">
                                        
                                        <button class="btn-cart" onclick="verDetalhes(${produtoDetalhes.id})">Ver Detalhes</button>
                                        <button class="btn-cart" onclick="atualizarQuantidade(${produto.produto_codigo})">Atualizar</button>
                                    </div>
                            </div>
                        </div>
                    `;
                    
                    lista_itens.appendChild(li);
                } catch (error) {
                    console.error("Erro ao buscar detalhes do produto:", error);
                }
            }
            
            const total = document.createElement("li");
            total.innerHTML = `Total itens: R$: ${valorTotalItens.toFixed(2)}`;
            lista_itens.appendChild(total);
            finalizar_pedido.style.display = "block";

        } catch (error) {
            console.error("Erro ao carregar o carrinho:", error);
        }
    }
}

async function atualizarQuantidade(produtoCodigo) {
    var token = getCookie('authTokenCliente');
    const novaQuantidade = document.getElementById(`quantidade_${produtoCodigo}`).value;

    if (token && novaQuantidade) {
        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/carrinhos/${produtoCodigo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantidade: novaQuantidade,
                }),
            });

            const resultado = await response.json();
            if (resultado.detail === "Token expirado!") {
                document.cookie = 'authTokenCliente=; Max-Age=0; path=/;';
                window.location.href = './logar.html';
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
            // Atualizar a lista de itens após a alteração da quantidade
            listaItensCarrinho();

        } catch (error) {
            //console.error("Erro ao atualizar a quantidade:", error);
        }
    }
}
listaItensCarrinho();


function buyCart() {
    var token = getCookie('authTokenCliente');
    if (token) {
        opcoes_perfil.style.display = 'none';
        if (itens_carrinho.style.display === 'block') {
            itens_carrinho.style.display = 'none';
        } else {
            itens_carrinho.style.display = 'block';
        }
    }
}

function toggleDrawer() {
    var token = getCookie('authTokenCliente');
    if (token) {
        itens_carrinho.style.display = 'none';
        if (opcoes_perfil.style.display === 'block') {
            opcoes_perfil.style.display = 'none';
        } else {
            opcoes_perfil.style.display = 'block';
        }
    }
}

// Função de logout
function logout(qtd) {
    // Remove o cookie "authToken"
    document.cookie = 'authTokenCliente=; Max-Age=0; path=/;';
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
};

function opcoes() {
    var token = getCookie('authTokenCliente');
    if (!token) {
        window.location.href = 'logar.html';
    }
    else {
        toggleDrawer();
    }
}

function pedido() {
    var token = getCookie('authTokenCliente');
    if (!token) {
        window.location.href = 'logar.html';
    }
    else {
        window.location.href = 'cliente/pedido.html';
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

function buscar() {
    const termoBusca = document.querySelector("#barSearch").value.trim();
    if (termoBusca) {
        window.location.href = `index.html?nome=${encodeURIComponent(termoBusca)}`;
    }
}

// Evento de pressionar "Enter"
document.querySelector("#barSearch").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        buscar(); // Chama a função de busca ao pressionar Enter
    }
});

// Evento de clique no botão de busca
document.querySelector("#searchBtn").addEventListener("click", buscar);

