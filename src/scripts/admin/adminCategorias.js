//adminCategorias.js

import * as config from '../consts.js';

const urlParams = new URLSearchParams(window.location.search);
const idCategoria = urlParams.get("id");
const formCadastroCategoria = document.getElementById('formCadastroCategoria');


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');

function listarCategorias(editar) {
    if (tokenAdmin || tokenAdminRefresh) {
        async function authenticate() {
            displayLoader(true);
            disableSubmitButton(true);
            try {
                const response = await fetch(`${config.API_URL}/categorias`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const result = await response.json();
                const lista_de_categorias = document.getElementById("lista_de_categorias");
                if (result && result.length > 0) {

                    lista_de_categorias.innerHTML = "";

                    result.forEach((categoria) => {
                        const li = document.createElement("li");
                        li.classList.add("categoria-item");

                        li.innerHTML = `
                            <div class="categoria-card">
                                <div class="categoria-info">
                                    <span class="categoria-id">ID: ${categoria.id}</span>
                                    <span class="categoria-nome">Nome: ${categoria.nome}</span>
                                    <span class="categoria-criacao">Criado em: ${categoria.criacao}</span>
                                </div>
                            </div>
                        `;

                        if (editar) {
                            li.innerHTML += ` <button onclick="editarCategoria(${categoria.id}, '${categoria.nome}')">Editar</button>`;
                        }

                        lista_de_categorias.appendChild(li);
                    });
                    displayLoader(false);

                } else {
                    lista_de_categorias.innerHTML = "<li>Nenhuma categoria encontrada.</li>";
                    displayLoader(false);

                }
            } catch (error) {
                setTimeout(() => {
                    listarCategorias(editar);
                }, 1000);
            }
        }
        authenticate();
    }
}

export function editarCategoria(id) {
    window.location.href = `cadastrar_categorias.html?id=${id}`;
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

if (formCadastroCategoria) {
    // Se ID existir, preenche o formulário
    if (idCategoria) {
        async function carregarCategoria() {
            displayLoader(true);
            disableSubmitButton(true);
            try {
                const response = await fetch(`${config.API_URL}/categorias/${idCategoria}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    }
                });

                if (!response.ok) throw new Error("Erro ao carregar categoria.");

                const produto = await response.json();

                // Preenche os campos do formulário
                document.getElementById('nome').value = produto.nome;
                displayLoader(false);
                disableSubmitButton(false);
            } catch (error) {
                setTimeout(() => {
                    carregarCategoria();
                }, 1000);
            }
        }
        carregarCategoria();

        // Evento para atualizar categoria
        formCadastroCategoria.addEventListener('submit', async (event) => {
            event.preventDefault();
            let formData = {
                nome: document.getElementById('nome').value,
            };
            displayLoader(true);
            disableSubmitButton(true);
            try {
                const response = await fetch(`${config.API_URL}/categorias/${idCategoria}`, {
                    method: 'PATCH',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    }
                });

                const result = await response.json();

                if (result.message === "Categoria atualizada com sucesso!") {
                    mostrarNotificacao(result.message, {
                        cor: "#4CAF50",
                        duracao: 3000,
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = './atualizar_categorias.html';
                    }, 3000);
                } else {
                    displayLoader(false);
                    disableSubmitButton(false);
                    if (result.detail) {
                        mostrarNotificacao(`${result.detail}`, {
                            cor: "#F44336",
                            duracao: 4000,
                            posicao: "bottom-right"
                        });
                    }
                }
            } catch (error) {
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        });
    }
    else {
        // Cadastro de nova categoria
        formCadastroCategoria.addEventListener('submit', async (event) => {
            event.preventDefault();

            let formData = {
                nome: document.getElementById('nome').value,

            };

            if (!formData.nome) {
                mostrarNotificacao("Todos os campos devem ser preenchidos.", {
                    cor: "#F44336",
                    duracao: 4000,
                    posicao: "bottom-right"
                });
                return;
            }

            try {
                const response = await fetch(`${config.API_URL}/categorias`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    }
                });

                const result = await response.json();
                

                if (response.ok) {
                    mostrarNotificacao("Cadastro realizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 5000);
                } else {
                    mostrarNotificacao('Erro ao realizar o cadastro.', {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
            } catch (error) {
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        });
    }
}

window.listarCategorias = listarCategorias;
window.editarCategoria = editarCategoria;
window.displayLoader = displayLoader;