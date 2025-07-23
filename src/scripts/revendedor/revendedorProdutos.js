// revendedorProdutos.js

import * as config from '../consts.js';

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
        const response = await fetch(`${config.API_URL}/produtos`, {
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
            return;
        }

        result.forEach((produto) => {
            const li = document.createElement("li");
            li.classList.add("produto-item");

            const promoClass = produto.status ? "promo" : "";

            const precoOriginal = (produto.preco + produto.preco / 20).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            
            const precoAtual = produto.preco.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            
            li.innerHTML = `
              <div class="produto-detalhes ${promoClass}">
                <img src="${produto.foto}" alt="${produto.nome}" class="produto-imagem-revendedor">
                <div class="produto-info">
                  <h2>${produto.nome}</h2>
                  <p><strong>Marca:</strong> ${produto.marca}</p>
                  <p><strong>Descrição:</strong> ${produto.descricao}</p>
                  <p class="descontoDe"><strong>De:</strong> R$ ${precoOriginal}</p>
                  <p><strong>Preço:</strong> R$ ${precoAtual}</p>
                  <label for="quantidade-${produto.id}">Quantidade:</label>
                  <input type="number" id="quantidade-${produto.id}" min="1" value="1">
                  <button class="btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                </div>
              </div>
            `;
            
            lista_de_produtos_admin.appendChild(li);
        });

    } catch (error) {
        setTimeout(() => {
            listarProdutos(editar);
        }
        , 10000);
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
        
        return;
    }

    const quantidade = document.getElementById(`quantidade-${produtoId}`).value;

    // Garantindo que a quantidade seja um número válido
    if (isNaN(quantidade) || quantidade <= 0) {
        
        return;
    }
    async function authenticate() {
        try {
            const response = await fetch(`${config.API_URL}/revendedores/autenticar`, {
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
            setTimeout(() => {
                authenticate();
            }
            , 1000);
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
        const response = await fetch(`${config.API_URL}/carrinhos_revendedor`, {
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
        setTimeout(() => {
            adicionarAoCarrinho(produtoId);
        }
        , 1000);
    }
}
