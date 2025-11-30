//menu.js

import * as config from './consts.js';

const opcoes_perfil = document.getElementById('opcoes_perfil');
const itens_carrinho = document.getElementById('itens_carrinho');

document.getElementById('btnCart').addEventListener('click', buyCart);
document.getElementById('btnLogin').addEventListener('click', opcoes);
document.getElementById('finalizar_pedido').addEventListener('click', pedido);


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');


// JS
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('btn-toggle');
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('close');
    });
}



export async function listaItensCarrinho() {
    if (tokenCliente || tokenClienteRefresh) {
        try {
            const response = await fetch(`${config.API_URL}/carrinhos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
            });

            const resultadoItensCarrinho = await response.json();

            // Se o status for 200 → Carrinho vazio
            if (response.status === 200 && resultadoItensCarrinho.detail === "Carrinho vazio!") {
                finalizar_pedido.style.display = "none";
                lista_itens.innerHTML = `<p class="carrinho-vazio-texto">Seu carrinho está vazio.</p>`;
                return;
            }



            // Aqui continua o seu código normal:
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
                return;
            }

            // Continua normalmente o processamento dos itens
            lista_itens.innerHTML = "";
            var valorTotalItens = 0;
            var quantidadeDeProdutos = 0;
            for (const produto of resultadoItensCarrinho) {
                if (produto.codigo.length != 6) {
                    try {
                        const produtoResponse = await fetch(`${config.API_URL}/produtos/${produto.produto_codigo}`, {
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
                        setTimeout(() => {
                            listaItensCarrinho();
                        }, 10000);
                    }
                }
            }

            const total = document.createElement("li");
            total.innerHTML = `Total itens: R$: ${valorTotalItens.toFixed(2)}`;
            lista_itens.appendChild(total);
            if (quantidadeDeProdutos != 0) {
                finalizar_pedido.style.display = "block";
            } else {
                finalizar_pedido.style.display = "none";
                lista_itens.innerHTML = `<p class="carrinho-vazio-texto">Seu carrinho está vazio.</p>`;
            }

        } catch (error) {
            setTimeout(() => {

                listaItensCarrinho();
            }, 10000);
        }
    }
    else {
        document.getElementById('btnCart').style.display = 'none';
    }
}

export function verDetalhes(id) {
    window.location.href = `${config.FRONT_URL}/produto.html?id=${id}`;
}

export async function atualizarQuantidade(produtoCodigo, codigoCarrinho, idCliente) {
    displayLoader(true);
    const novaQuantidade = document.getElementById(`quantidade_${produtoCodigo}`).value;
    if ((tokenCliente || tokenClienteRefresh) && novaQuantidade) {
        try {
            const response = await fetch(`${config.API_URL}/carrinhos/${codigoCarrinho}`, {
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
                    displayLoader(false);
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
                    displayLoader(false);
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
                    displayLoader(false);
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
                    displayLoader(false);
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
            setTimeout(() => {
                atualizarQuantidade(produtoCodigo, codigoCarrinho, idCliente);
            }, 1000);
        }
    }
}

export function buyCart() {
    if (tokenCliente && tokenClienteRefresh) {
        opcoes_perfil.style.display = 'none';
        if (itens_carrinho.style.display === 'block') {
            itens_carrinho.style.display = 'none';
        } else {
            itens_carrinho.style.display = 'block';
        }
    }

}

function toggleDrawer() {
    if (tokenCliente && tokenClienteRefresh) {
        itens_carrinho.style.display = 'none';
        if (opcoes_perfil.style.display === 'block') {
            opcoes_perfil.style.display = 'none';
        } else {
            opcoes_perfil.style.display = 'block';
        }
    }
}

export function opcoes(qtd) {
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

export function pedido(qtd) {
    if (!tokenCliente || !tokenClienteRefresh) {
        window.location.href = 'logar.html';
    }
    else {
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
                    if (qtd === 0) {
                        var voltar = '.';
                        window.location.href = `cliente/pedido.html?id=${result.id}`;
                    }
                    else {
                        var voltar = '';
                        for (var i = 0; i < qtd; i++) {
                            voltar += '../';
                        }
                        window.location.href = `${voltar}cliente/pedido.html?id=${result.id}`;
                    }
                }



            } catch (error) {
                setTimeout(() => {
                    authenticate();
                }, 1000);
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

function buscar() {
    const termoBusca = document.querySelector("#barSearch").value.trim();
    if (termoBusca) {
        window.location.href = `index.html?nome=${encodeURIComponent(termoBusca)}`;
    }
}

// Evento de pressionar "Enter"
if (document.querySelector("#barSearch")) {
    document.querySelector("#barSearch").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            buscar(); // Chama a função de busca ao pressionar Enter
        }
    });
}


// Evento de clique no botão de busca
if (document.querySelector("#searchBtn")) {
    document.querySelector("#searchBtn").addEventListener("click", buscar);
    document.querySelector("#searchBtn").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            buscar(); // Chama a função de busca ao pressionar Enter
        }
    });
}


// Função de logoutAdmin 
export function logoutAdmin(qtd) {
    // Remove os cookies "authTokenAdmin e authTokenAdminRefresh"
    document.cookie = 'authTokenAdmin=; Max-Age=0; path=/;';
    document.cookie = 'authTokenAdminRefresh=; Max-Age=0; path=/;';
    if (qtd === 0) {
        var voltar = '.';
        window.location.href = `${voltar}/index.html`; // Redireciona para a página de login
    }
    else {
        var voltar = '';
        for (var i = 0; i < qtd; i++) {
            voltar += '../';
        }
        window.location.href = `${voltar}index.html`; // Redireciona para a página de login       
    }
};

// Função de logoutRevendedor
export function logoutRevendedor(qtd) {
    // Remove os cookies "authTokenRevendedor e authTokenAdminRevendedor"
    document.cookie = 'authTokenRevendedor=; Max-Age=0; path=/;';
    document.cookie = 'authTokenRevendedorRefresh=; Max-Age=0; path=/;';
    if (qtd === 0) {
        var voltar = '.';
        window.location.href = `${voltar}/index.html`; // Redireciona para a página de login
    }
    else {
        var voltar = '';
        for (var i = 0; i < qtd; i++) {
            voltar += '../';
        }
        window.location.href = `${voltar}index.html`; // Redireciona para a página de login       
    }
};

// Função de logout
export function logoutCliente(qtd) {
    // Remove os cookies "authTokenCliente e authTokenClienteRefresh"
    document.cookie = 'authTokenCliente=; Max-Age=0; path=/;';
    document.cookie = 'authTokenClienteRefresh=; Max-Age=0; path=/;';
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

// Função para exibir/esconder o loader
export const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = isLoading ? 'flex' : 'none';
    }
};

export function mudarPlaceholder() {

    var produtos = [
        'Computador',
        'Notebook',
        'Video Game',
        'Celular',
        'PC Gamer',
        'GoPro'
    ]
    if (document.querySelector("#barSearch")) {
        document.querySelector("#barSearch").placeholder = `${produtos[Math.floor(Math.random() * produtos.length)]}`;
    }
    setTimeout(() => {
        mudarPlaceholder();
    }, 5000);
}


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


mudarPlaceholder();

listaItensCarrinho();

window.logoutAdmin = logoutAdmin;
window.logoutRevendedor = logoutRevendedor;
window.logoutCliente = logoutCliente;
window.pedido = pedido;
window.buyCart = buyCart;
window.opcoes = opcoes;
window.listaItensCarrinho = listaItensCarrinho;
window.buscar = buscar;
window.toggleDrawer = toggleDrawer;
window.displayLoader = displayLoader;
window.atualizarQuantidade = atualizarQuantidade;
window.verDetalhes = verDetalhes;
document.addEventListener('DOMContentLoaded', iniciarCarrossel1x1);