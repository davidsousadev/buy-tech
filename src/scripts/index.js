//index.js

import * as config from './consts.js';

export async function listarProdutos() {
    const lista_produtos = document.getElementById("lista_produtos");

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryString = urlParams.toString();

        displayLoader(true);

        const response = await fetch(`${config.API_URL}/produtos?${queryString}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }

        const produtos = await response.json();
        lista_produtos.innerHTML = "";

        if (Array.isArray(produtos) && produtos.length > 0) {
            produtos.forEach(produto => {
                const li = document.createElement("li");
                li.appendChild(criarCardProduto(produto));
                lista_produtos.appendChild(li);
            });
        } else {

            lista_produtos.innerHTML = '<p>Nenhum produto encontrado!</p>';
        }
        displayLoader(false);
    } catch (error) {
        
        lista_produtos.innerHTML = '<p>Erro ao carregar produtos. Tentando novamente...</p>';
        setTimeout(listarProdutos, 10000);
    } finally {

    }
}

function criarCardProduto(produto) {
    const card = document.createElement("div");
    card.className = `card ${produto.status ? "promo" : ""}`;

    const precoFormatado = produto.preco.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    card.innerHTML = `
        <img src="${produto.foto}" alt="${produto.nome}" class="card-img">
        <div class="card-body">
            <h3 class="card-title">${produto.nome}</h3>
            <p class="card-brand">Marca: ${produto.marca}</p>
            <p class="card-price">R$ ${precoFormatado}</p>
        </div>
        ${produto.status ? gerarFlamesHTML() : ""}
    `;

    const btnDetalhes = document.createElement("button");
    btnDetalhes.className = "btnDetalhes";
    btnDetalhes.textContent = "Ver Detalhes";
    btnDetalhes.addEventListener("click", () => verDetalhes(produto.id));

    card.querySelector('.card-body').appendChild(btnDetalhes);

    return card;
}

function gerarFlamesHTML() {
    return `
        <div class="flames">
            ${'<div class="flame"></div>'.repeat(24)}
        </div>
    `;
}


export function verDetalhes(id) {
    window.location.href = `produto.html?id=${id}`;
}

// Função para exibir/esconder o loader
export const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = isLoading ? 'flex' : 'none';
    }
};

listarProdutos();
window.listarProdutos = listarProdutos; 
