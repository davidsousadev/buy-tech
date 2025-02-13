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
            try {
                const response = await fetch('https://api-buy-tech.onrender.com/categorias', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const result = await response.json();

                if (result && result.length > 0) {
                    const lista_de_categorias = document.getElementById("lista_de_categorias");
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
                } else {
                    console.log("Nenhuma categoria encontrada");
                }
            } catch (error) {
                console.error(error);
            }
        }
        authenticate();
    }
}

function editarCategoria(id) {
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
            try {
                const response = await fetch(`https://api-buy-tech.onrender.com/categorias/${idCategoria}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    }
                });

                if (!response.ok) throw new Error("Erro ao carregar categoria.");

                const produto = await response.json();

                // Preenche os campos do formulário
                document.getElementById('nome').value = produto.nome;

            } catch (error) {
                console.error("Erro ao carregar categoria:", error);
                mostrarNotificacao("Erro ao carregar os dados do categoria.", {
                    cor: "#F44336",
                    duracao: 4000,
                    posicao: "bottom-right"
                });
            }
        }
        carregarCategoria();

        // Evento para atualizar categoria
        formCadastroCategoria.addEventListener('submit', async (event) => {
            event.preventDefault();
            let formData = {
                nome: document.getElementById('nome').value,
            };

            try {
                const response = await fetch(`https://api-buy-tech.onrender.com/categorias/${idCategoria}`, {
                    method: 'PATCH',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    mostrarNotificacao("Categoria atualizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 3000,
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = './atualizar_categorias.html';
                    }, 3000);

                } else {
                    if (result.detail) {
                    mostrarNotificacao(`${result.detail}`, {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
                }
            } catch (error) {
                console.error('Erro ao atualizar o categoria:', error);
                mostrarNotificacao("Erro ao atualizar os dados. Tente novamente.", {
                    cor: "#F44336",
                    duracao: 4000,
                    posicao: "bottom-right"
                });
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
                const response = await fetch('https://api-buy-tech.onrender.com/categorias', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    }
                });

                const result = await response.json();
                console.log('Resposta da API:', result);

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
                console.error('Erro ao enviar os dados:', error);
                mostrarNotificacao("Erro ao enviar os dados. Tente novamente.", {
                    cor: "#F44336",
                    duracao: 4000,
                    posicao: "bottom-right"
                });
            }
        });
    }
}