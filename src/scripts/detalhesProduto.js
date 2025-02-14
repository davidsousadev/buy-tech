const urlParams = new URLSearchParams(window.location.search);
const idCarrinho = urlParams.get("id");

async function carregarDetalhesProduto() {
    if (!idCarrinho) {
        document.getElementById("detalhesProduto").innerHTML = "<p>Produto não encontrado!</p>";
        return;
    }

    try {
        const response = await fetch(` https://api-buy-tech.onrender.com/produtos/${idCarrinho}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar o produto");
        }

        const produto = await response.json();
        const promoClass = produto.status ? "promo" : "";
        document.getElementById("detalhesProduto").innerHTML = `
            <div class="produto-detalhes ${promoClass}">
                <img src="${produto.foto}" alt="${produto.nome}" class="produto-imagem">
                <div class="produto-info">
                    <h2>${produto.nome}</h2>
                    <p><strong>Marca:</strong> ${produto.marca}</p>
                    <p><strong>Descrição:</strong> ${produto.descricao}</p>
                    <p class="descontoDe"><strong>De:</strong> R$ ${parseFloat((produto.preco + produto.preco / 20).toFixed(2))}</p>
                    <p><strong>Preço:</strong> R$ ${produto.preco}</p>
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" min="0" value="1">
                    <button class="btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    } catch (error) {
        setTimeout(() => {
            carregarDetalhesProduto();
        }, 1000);
    }
}

async function adicionarAoCarrinho(produtoId) {
    const tokenCliente = getCookie('authTokenCliente'); 
    const tokenClienteRefresh = getCookie('authTokenClienteRefresh');
    const quantidade = document.getElementById("quantidade").value;

    if (!tokenCliente || !tokenClienteRefresh) {
        window.location.href = 'logar.html';
    }

    const data = {
        produto_codigo: produtoId,
        cliente_id: 1, 
        quantidade: parseInt(quantidade)
    };

    try {
        const response = await fetch(" https://api-buy-tech.onrender.com/carrinhos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenCliente || tokenClienteRefresh}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            mostrarNotificacao("Produto adicionado ao carrinho!", {
                cor: "#4CAF50",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            const errorData = await response.json();
            mostrarNotificacao(errorData.detail, {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        }
    } catch (error) {
        setTimeout(() => {
            adicionarAoCarrinho(produtoId)
        }, 1000);
    }
}

// Chamar a função ao carregar a página
carregarDetalhesProduto();
