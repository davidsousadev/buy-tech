const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get("id");

async function carregarDetalhesProduto() {
    if (!idProduto) {
        document.getElementById("detalhesProduto").innerHTML = "<p>Produto não encontrado!</p>";
        return;
    }

    try {
        const response = await fetch(`https://api-buy-tech.onrender.com/produtos/${idProduto}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar o produto");
        }

        const produto = await response.json();

        document.getElementById("detalhesProduto").innerHTML = `
            <div class="produto-detalhes">
                <img src="${produto.foto}" alt="${produto.nome}" class="produto-imagem">
                <div class="produto-info">
                    <h2>${produto.nome}</h2>
                    <p><strong>Marca:</strong> ${produto.marca}</p>
                    <p><strong>Descrição:</strong> ${produto.descricao}</p>
                    <p><strong>Preço:</strong> R$ ${produto.preco}</p>
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" min="1" value="1">
                    <button class="btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Erro ao carregar os detalhes do produto:", error);
        document.getElementById("detalhesProduto").innerHTML = "<p>Erro ao carregar o produto.</p>";
    }
}

async function adicionarAoCarrinho(produtoId) {
    const token = getCookie("authTokenCliente"); // Obtendo o token do cookie
    const quantidade = document.getElementById("quantidade").value;

    if (!token) {
        window.location.href = 'login.html';
    }

    const data = {
        produto_codigo: produtoId,
        cliente_id: 1, // Substituir pelo ID real do cliente autenticado
        quantidade: parseInt(quantidade)
    };

    try {
        const response = await fetch("https://api-buy-tech.onrender.com/carrinhos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            mostrarNotificacao("Produto adicionado ao carrinho!", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
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
        console.error("Erro na requisição:", error);
        
    }
}

// Chamar a função ao carregar a página
carregarDetalhesProduto();
