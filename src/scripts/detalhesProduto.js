// detalhesProduto.js
import * as config from './consts.js';

function getCookie(nome) {
    const valor = `; ${document.cookie}`;
    const partes = valor.split(`; ${nome}=`);
    if (partes.length === 2) return partes.pop().split(';').shift();
    return null;
}

const urlParams = new URLSearchParams(window.location.search);
const idCarrinho = urlParams.get("id");

async function carregarDetalhesProduto() {
    const container = document.getElementById("detalhesProduto");

    if (!idCarrinho) {
        container.innerHTML = "<p>Produto não encontrado!</p>";
        return;
    }
    displayLoader(true);
    try {
        const response = await fetch(`${config.API_URL}/produtos/${idCarrinho}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar o produto");
        }

        const produto = await response.json();
        const promoClass = produto.status ? "promo" : "";
        const precoOriginal = 'R$ ' + (produto.preco + produto.preco / 20).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const precoFormatado = 'R$ ' + produto.preco.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });


        container.innerHTML = `
            <div class="produto-detalhes ${promoClass}">
                <img src="${produto.foto}" alt="${produto.nome}" class="produto-imagem">
                <div class="produto-info">
                    <h2>${produto.nome}</h2>
                    <p><strong>ID:</strong> ${produto.id} | <strong>Quantidade disponível:</strong> ${produto.quantidade_estoque}</p>
                    <p><strong>Marca:</strong> ${produto.marca}</p>
                    <p><strong>Descrição:</strong> ${produto.descricao}</p>
                    <p class="descontoDe"><strong>De:</strong> R$ ${precoOriginal}</p>
                    <p><strong>Preço:</strong> R$ ${precoFormatado}</p>
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" min="1" value="1">
                    <button class="btn" id="btnAdicionarCarrinho">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;

        document.getElementById("btnAdicionarCarrinho").addEventListener("click", () => {
            adicionarAoCarrinho(produto.id);
        });
        displayLoader(false);
    } catch (error) {
        displayLoader(false);
        mostrarNotificacao("Erro ao carregar item!", {
            cor: "#F44336",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
        setTimeout(carregarDetalhesProduto, 10000);
    }
}

export async function adicionarAoCarrinho(produtoId) {
    const tokenCliente = getCookie('authTokenCliente');
    const tokenClienteRefresh = getCookie('authTokenClienteRefresh');
    const quantidadeInput = document.getElementById("quantidade");
    const quantidade = quantidadeInput ? parseInt(quantidadeInput.value) : 0;

    if (!tokenCliente && !tokenClienteRefresh) {
        window.location.href = 'logar.html';
        return;
    }

    async function clienteData() {
        const avatar = document.getElementById('avatar');
        if (avatar) {
            avatar.classList.remove('bx-user');
            avatar.classList.add('bxs-user-circle');
        }
        displayLoader(true);
        async function authenticate() {
            try {
                const response = await fetch(`${config.API_URL}/clientes/autenticar`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    return result.id;
                } else {
                    return null;
                }

            } catch {
                return null;
            }
        }

        return await authenticate();
    }

    const clienteId = await clienteData();

    if (clienteId !== null) {
        if (!produtoId || quantidade < 1) {
            displayLoader(false);
            mostrarNotificacao("Dados inválidos para adicionar ao carrinho", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            return;
        }

        const data = {
            produto_codigo: produtoId,
            cliente_id: clienteId,
            quantidade: quantidade
        };

        try {
            const response = await fetch(`${config.API_URL}/carrinhos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenCliente || tokenClienteRefresh}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (response.status === 201) {
                mostrarNotificacao("Produto adicionado ao carrinho!", {
                    cor: "#4CAF50",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                displayLoader(false);
                setTimeout(() => { location.reload(); }, 3000);
            } else {
                displayLoader(false);
                mostrarNotificacao(result.detail || "Erro ao adicionar ao carrinho", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }

        } catch {
            displayLoader(false);
            mostrarNotificacao("Erro ao adicionar ao carrinho", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        }
    }
}

// Função para exibir/esconder o loader
export const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = isLoading ? 'flex' : 'none';
    }
};

carregarDetalhesProduto();
