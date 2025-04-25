// Função para obter um cookie pelo nome
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Função para listar produtos
async function listarProdutos(editar) {
    const tokenRevendedor = getCookie('authTokenRevendedor');
    const tokenRevendedorRefresh = getCookie('authTokenRevendedorRefresh');

    if (!tokenRevendedor && !tokenRevendedorRefresh) return;

    try {
        const response = await fetch('https://api-buy-tech.onrender.com/produtos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) throw new Error("Erro ao buscar produtos.");

        const result = await response.json();

        const lista_de_produtos_admin = document.getElementById("lista_de_produtos_admin");
        lista_de_produtos_admin.innerHTML = "";

        if (result.length === 0) {
            console.log("Nenhum produto encontrado.");
            return;
        }

        result.forEach((produto) => {
            const li = document.createElement("li");
            li.classList.add("produto-item");

            const promoClass = produto.status ? "promo" : "";

            li.innerHTML = `
                <div class="produto-detalhes ${promoClass}">
                    <img src="${produto.foto}" alt="${produto.nome}" class="produto-imagem-revendedor">
                    <div class="produto-info">
                        <h2>${produto.nome}</h2>
                        <p><strong>Marca:</strong> ${produto.marca}</p>
                        <p><strong>Descrição:</strong> ${produto.descricao}</p>
                        <p class="descontoDe"><strong>De:</strong> R$ ${parseFloat((produto.preco + produto.preco / 20).toFixed(2))}</p>
                        <p><strong>Preço:</strong> R$ ${produto.preco}</p>
                        <label for="quantidade-${produto.id}">Quantidade:</label>
                        <input type="number" id="quantidade-${produto.id}" min="1" value="1">
                        <button class="btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `;
            lista_de_produtos_admin.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao listar produtos:", error);
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

// Função para adicionar produto ao carrinho
async function adicionarAoCarrinho(produtoId) {
    const tokenRevendedor = getCookie('authTokenRevendedor');
    if (!tokenRevendedor) {
        alert("Você precisa estar logado para adicionar produtos ao carrinho.");
        return;
    }

    const quantidade = document.getElementById(`quantidade-${produtoId}`).value;

    // Garantindo que a quantidade seja um número válido
    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, insira uma quantidade válida.");
        return;
    }
    async function authenticate() {
        try {
            const response = await fetch('https://api-buy-tech.onrender.com/revendedores/autenticar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`,
                },
            });
    
            const result = await response.json();
    
            if (response.ok && result) {
    
                return result.id;
            } 
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
        return null;
    }
    const auth = await authenticate();
    const data = {
        produto_codigo: produtoId,
        revendedor_id: auth, 
        quantidade: parseInt(quantidade, 10)
    };

    try {
        const response = await fetch(" https://api-buy-tech.onrender.com/carrinhos_revendedor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenRevendedor}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            mostrarNotificacao("Produto adicionado ao carrinho!", {
                cor: "#4CAF50",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });

            setTimeout(() => location.reload(), 3000);
        } else {
            mostrarNotificacao(responseData.detail || "Erro ao adicionar produto.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        }

    } catch (error) {
        console.error("Erro ao adicionar produto ao carrinho:", error);
    }
}
