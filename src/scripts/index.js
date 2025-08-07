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


let carrosselData = [];
let currentIndex = 0;
let timer = null;
let isLoading = false;

async function carregarCarrossel() {
    // try {
    //     const response = await fetch(`${config.API_URL}/propaganda`);
    //     if (!response.ok) throw new Error("Erro de rede");
    //     carrosselData = await response.json();
    // } catch (err) {
    //     // Mock de dados
        carrosselData = [
            { img: 'src/imagens/live.jpg', link: 'https://produto1.com', tempo: 4000 },
            { img: 'src/imagens/live.jpg', link: 'https://produto2.com', tempo: 5000 },
            { img: 'src/imagens/live.jpg', link: 'https://produto3.com', tempo: 3000 }
        ];
    //}

    if (carrosselData.length > 0) iniciarCarrossel();
}

function iniciarCarrossel() {
    const navContainer = document.getElementById('carrossel-nav');
    navContainer.innerHTML = '';

    // Cálculo dinâmico do tamanho dos discos
    const total = carrosselData.length;
    const minWidth = 18;
    const maxWidth = 40;
    // Ajusta largura entre min e max conforme quantidade, mantendo maior se poucos, menor se muitos
    const width = Math.max(minWidth, Math.min(maxWidth, 80 / total));
    const height = width / 2;

    navContainer.style.bottom = '12px'; // mais para baixo

    carrosselData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carrossel-dot');
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');

        // Aplica tamanho dinâmico
        dot.style.width = width + 'px';
        dot.style.height = height + 'px';

        dot.addEventListener('click', (event) => {
            event.stopPropagation();  // evita abrir link do banner ao clicar no disco
            trocarImagem(index);
        });

        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                trocarImagem(index);
            }
        });

        navContainer.appendChild(dot);
    });

    mostrarImagem(0);
}

function trocarImagem(index) {
    if (!isLoading && index !== currentIndex) {
        clearTimeout(timer);
        mostrarImagem(index);
    }
}

function mostrarImagem(index) {
    const imgElement = document.getElementById('carrossel-img');
    const skeleton = document.getElementById('skeleton');
    const navDots = document.querySelectorAll('.carrossel-dot');

    if (!carrosselData[index]) return;

    currentIndex = index;
    const { img, link, tempo } = carrosselData[index];

    isLoading = true;
    skeleton.style.display = 'block';
    imgElement.style.display = 'none';

    const tempImg = new Image();
    tempImg.src = img;

    tempImg.onload = () => {
        imgElement.src = img;
        imgElement.style.display = 'block';
        skeleton.style.display = 'none';
        isLoading = false;
    };

    tempImg.onerror = () => {
        console.warn(`Erro ao carregar imagem: ${img}`);
        skeleton.style.display = 'block';
        imgElement.style.display = 'none';
        isLoading = false;
    };

    // Clique no banner abre link
    imgElement.parentElement.onclick = (e) => {
        e.stopPropagation();
        if (link && link.startsWith('http')) {
            window.open(link, '_blank');
        }
    };

    navDots.forEach(dot => dot.classList.remove('active'));
    if (navDots[index]) navDots[index].classList.add('active');

    const delay = tempo && !isNaN(tempo) ? tempo : 4000;
    timer = setTimeout(() => {
        const nextIndex = (index + 1) % carrosselData.length;
        mostrarImagem(nextIndex);
    }, delay);
}

carregarCarrossel();


const carrossel1x1Data = [
    { img: 'src/imagens/live.jpg', link: 'https://exemplo1.com', tempo: 4000 },
    // { img: 'src/imagens/live2.jpg', link: 'https://exemplo2.com', tempo: 4000 },
    // { img: 'src/imagens/live3.jpg', link: 'https://exemplo3.com', tempo: 4000 }
];

let index1x1 = 0;
let timer1x1 = null;

function iniciarCarrossel1x1() {
    const img = document.getElementById('img-1x1');
    const skeleton = document.getElementById('skeleton-1x1');
    const dotsContainer = document.getElementById('dots-1x1');
    dotsContainer.innerHTML = '';

    carrossel1x1Data.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => mostrarImagem1x1(i));
        dotsContainer.appendChild(dot);
    });

    img.addEventListener('click', () => {
        const link = carrossel1x1Data[index1x1].link;
        if (link) window.open(link, '_blank');
    });

    mostrarImagem1x1(0);
}

function mostrarImagem1x1(i) {
    clearTimeout(timer1x1);
    const img = document.getElementById('img-1x1');
    const skeleton = document.getElementById('skeleton-1x1');
    const dots = document.querySelectorAll('#dots-1x1 .dot');

    index1x1 = i;
    skeleton.style.display = 'block';
    img.style.display = 'none';

    const novaImg = new Image();
    novaImg.src = carrossel1x1Data[i].img;

    novaImg.onload = () => {
        img.src = novaImg.src;
        img.style.display = 'block';
        skeleton.style.display = 'none';
    };

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[i]) dots[i].classList.add('active');

    timer1x1 = setTimeout(() => {
        const next = (i + 1) % carrossel1x1Data.length;
        mostrarImagem1x1(next);
    }, carrossel1x1Data[i].tempo);
}

document.addEventListener('DOMContentLoaded', iniciarCarrossel1x1);