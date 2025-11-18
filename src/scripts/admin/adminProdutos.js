// adminProdutos.js

import * as config from '../consts.js';

const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get("id");
const formCadastroProdutoAdmin = document.getElementById('formCadastroProdutoAdmin');

var imagemValida = false;

//.container
const container = document.querySelector('.container');

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');

function listarProdutos(editar) {

    if (tokenAdmin || tokenAdminRefresh) {
        async function authenticate() {
            displayLoader(true);

            try {
                const response = await fetch(`${config.API_URL}/produtos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const result = await response.json();

                if (result && result.length > 0) {
                    const lista_de_produtos_admin = document.getElementById("lista_de_produtos_admin");
                    lista_de_produtos_admin.innerHTML = "";

                    result.forEach((produto) => {
                        const li = document.createElement("li");
                        li.classList.add("produto-item");

                        const precoFormatado = produto.preco.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });

                        li.innerHTML = `
                          <div class="produto-card">
                            <div class="produto-imagem">
                              <img src="${produto.foto}" alt="${produto.nome}" class="produto-foto">
                            </div>
                            <div class="produto-info">
                              <span class="produto-nome">${produto.nome}</span>
                              <span class="produto-preco">Preço: R$ ${precoFormatado}</span>
                              <span class="produto-descricao">Estoque: ${produto.quantidade_estoque} unidades</span>
                            </div>
                          </div>
                        `;

                        if (editar) {
                            li.innerHTML += ` <button onclick="editarProduto(${produto.id})">Editar</button>`;
                        }

                        lista_de_produtos_admin.appendChild(li);
                    });
                    displayLoader(false);

                }
                else {
                    lista_de_produtos_admin.innerHTML = "<li class='nenhum'>Nenhum produto encontrado.</li>";
                    document.getElementById("cards").innerHTML = "";
                    document.getElementById("cards").innerHTML = "<ul><a href='./cadastrar_produtos.html'><i class='bx bx-list-plus'></i><li>Cadastrar Produtos</li></a> <a href='../gerenciar_produtos.html'><i class='bx bx-arrow-back'></i><li>Voltar</li></a></ul>";
                    displayLoader(false);

                }
            } catch (error) {
                setTimeout(() => {
                    authenticate();
                }, 1000);
            }
        }
        authenticate();
    }
}

function editarProduto(id) {
    window.location.href = `cadastrar_produtos.html?id=${id}`;
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

if (formCadastroProdutoAdmin) {
    const tokenAdmin = getCookie('authTokenAdmin');
    const tokenAdminRefresh = getCookie('authTokenAdminRefresh');
    if (tokenAdmin || tokenAdminRefresh) {// Se ID existir, preenche o formulário
        if (idProduto) {
            async function carregarProduto() {
                displayLoader(true);
                disableSubmitButton(true);
                try {
                    const response = await fetch(`${config.API_URL}/produtos/${idProduto}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                        }
                    });

                    if (!response.ok) throw new Error("Erro ao carregar produto.");

                    const produto = await response.json();

                    // Preenche os campos do formulário
                    document.getElementById('nome').value = produto.nome;
                    document.getElementById('preco').value = produto.preco;
                    document.getElementById('foto').value = produto.foto;
                    document.getElementById('marca').value = produto.marca;
                    document.getElementById('categoria').value = produto.categoria;
                    document.getElementById('descricao').value = produto.descricao;
                    document.getElementById('quantidade_estoque').value = produto.quantidade_estoque;
                    document.getElementById('opcao_de_personalizado').value = produto.personalizado;
                    document.getElementById('opcao_de_status').value = produto.status;
                    displayLoader(false);
                    disableSubmitButton(false);
                } catch (error) {
                    displayLoader(false);
                    disableSubmitButton(false);

                    mostrarNotificacao("Erro ao carregar os dados do produto.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
            }
            carregarProduto();

            // Evento para atualizar produto
            formCadastroProdutoAdmin.addEventListener('submit', async (event) => {
                event.preventDefault();
                if (!imagemValida) {
                    mostrarNotificacao("O link da imagem é inválido. Insira uma imagem válida antes de cadastrar.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                    return;
                }
                let formData = {
                    nome: document.getElementById('nome').value,
                    preco: document.getElementById('preco').value,
                    foto: document.getElementById('foto').value,
                    marca: document.getElementById('marca').value,
                    categoria: document.getElementById('categoria').value,
                    descricao: document.getElementById('descricao').value,
                    quantidade_estoque: document.getElementById('quantidade_estoque').value,
                    personalizado: document.getElementById('opcao_de_personalizado').value,
                    status: document.getElementById('opcao_de_status').value,
                };
                displayLoader(true);
                disableSubmitButton(true);
                async function atualizarProdutos() {
                    try {
                        const response = await fetch(`${config.API_URL}/produtos/${idProduto}`, {
                            method: 'PATCH',
                            body: JSON.stringify(formData),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                            }
                        });

                        const result = await response.json();
                        if (response.ok) {
                            mostrarNotificacao("Produto atualizado com sucesso!", {
                                cor: "#4CAF50",
                                duracao: 4000,
                                posicao: "bottom-right"
                            });
                            setTimeout(() => {
                                window.location.href = './atualizar_produtos.html';
                            }, 3000);
                        } else {
                            if (result.detail) {
                                displayLoader(false);
                                disableSubmitButton(false);
                                mostrarNotificacao(`${result.detail}`, {
                                    cor: "#F44336",
                                    duracao: 4000,
                                    posicao: "bottom-right"
                                });
                            }
                        }
                    } catch (error) {
                        mostrarNotificacao("Erro ao atualizar os dados. Tente novamente.", {
                            cor: "#F44336",
                            duracao: 4000,
                            posicao: "bottom-right"
                        });
                        setTimeout(() => {
                            atualizarProdutos();
                        }, 3000);
                    }
                }
                atualizarProdutos();
            });
        }
        else {
            // Cadastro de novo produto
            formCadastroProdutoAdmin.addEventListener('submit', async (event) => {
                event.preventDefault();
                if (!imagemValida) {
                    mostrarNotificacao("O link da imagem é inválido. Insira uma imagem válida antes de cadastrar.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                    return;
                }
                let formData = {
                    nome: document.getElementById('nome').value,
                    preco: document.getElementById('preco').value,
                    foto: document.getElementById('foto').value,
                    marca: document.getElementById('marca').value,
                    categoria: document.getElementById('categoria').value,
                    descricao: document.getElementById('descricao').value,
                    quantidade_estoque: document.getElementById('quantidade_estoque').value,
                    personalizado: document.getElementById('opcao_de_personalizado').value,
                    status: document.getElementById('opcao_de_status').value,
                };

                if (!formData.nome || !formData.preco || !formData.foto || !formData.marca || !formData.categoria || !formData.descricao || !formData.quantidade_estoque) {
                    mostrarNotificacao("Todos os campos devem ser preenchidos.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                    return;
                }
                displayLoader(true);
                disableSubmitButton(true);
                try {
                    const response = await fetch(`${config.API_URL}/produtos`, {
                        method: 'POST',
                        body: JSON.stringify(formData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                        }
                    });

                    const result = await response.json();

                    if (response.ok) {
                        mostrarNotificacao("Produto cadastrado com sucesso!", {
                            cor: "#4CAF50",
                            duracao: 4000,
                            posicao: "bottom-right"
                        });
                        setTimeout(() => {
                            window.location.href = './index.html';
                        }, 3000);

                    } else {
                        if (result.detail) {
                            displayLoader(false);
                            disableSubmitButton(false);
                            mostrarNotificacao(`${result.detail}`, {
                                cor: "#F44336",
                                duracao: 4000,
                                posicao: "bottom-right"
                            });
                        }
                    }
                } catch (error) {

                    mostrarNotificacao("Erro ao enviar os dados. Tente novamente.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
            });
        }
    }

}
export async function carregarCatagorias() {
    const categoriaSelect = document.getElementById("categoria");
    displayLoader(true);
    if (!categoriaSelect) {
        return;
    }
    else {
        try {
            const response = await fetch(`${config.API_URL}/categorias`);
            const categorias = await response.json();

            // Limpa opções antigas
            categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

            if (categorias.length === 0) {
                formCadastroProdutoAdmin.style.display = 'none';
                displayLoader(false);
                mostrarNotificacao("Nenhuma categoria encontrada. Por favor, crie uma categoria antes de cadastrar produtos.", {
                    cor: "#F44336",
                    duracao: 3000,
                    posicao: "bottom-right"
                });
                setTimeout(() => {
                    window.location.href = `../categorias/cadastrar_categorias.html`;
                }, 2000);

                return;
            }

            categorias.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria.id;
                option.textContent = categoria.nome;
                categoriaSelect.appendChild(option);
            });
            displayLoader(false)
        } catch (error) {
            setTimeout(() => {
                carregarCatagorias();
            }, 3000);
        }
    }
}
carregarCatagorias();

export const pre = () => {
    const foto = document.getElementById('foto');
    const visualizacao = document.getElementById('preVisualizacao');

    if (!foto || !visualizacao) return;

    foto.addEventListener('blur', () => {
        const value = foto.value.trim();
        visualizacao.innerHTML = "";
        imagemValida = false;

        if (value === "") {
            visualizacao.style.display = "none";
            return;
        }

        visualizacao.style.display = "block";

        displayLoader(true);

        const img = new Image();

        img.onload = () => {
            imagemValida = true;

            visualizacao.innerHTML = `
                <p>Pré-visualização</p>
                <img src="${value}" alt="prévia"/>
            `;
            displayLoader(false);
        };

        img.onerror = () => {
            imagemValida = false;
            visualizacao.innerHTML = `
                <p>Imagem inválida ou link quebrado.</p>
            `;
            displayLoader(false);
        };

        img.src = value;
    });
};


document.addEventListener("DOMContentLoaded", () => {
    pre();
});

window.carregarCatagorias = carregarCatagorias;
window.listarProdutos = listarProdutos;
window.editarProduto = editarProduto;
window.displayLoader = displayLoader;
window.disableSubmitButton = disableSubmitButton;