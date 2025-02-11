const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get("id");
const formCadastroProdutoAdmin = document.getElementById('formCadastroProdutoAdmin');

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};


function listarProdutos(editar) {
    const tokenAdmin = getCookie('authTokenAdmin');
    const tokenAdminRefresh = getCookie('authTokenAdminRefresh');
    if (tokenAdmin || tokenAdminRefresh) {
        async function authenticate() {
            try {
                const response = await fetch('https://api-buy-tech.onrender.com/produtos', {
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

                        li.innerHTML = `
                            <div class="produto-card">
                                <div class="produto-imagem">
                                    <img src="${produto.foto}" alt="${produto.nome}" class="produto-foto">
                                </div>
                                <div class="produto-info">
                                    <span class="produto-nome">${produto.nome}</span>
                                    <span class="produto-preco">Preço: R$ ${produto.preco.toFixed(2)}</span>
                                    <span class="produto-descricao">${produto.descricao}</span>
                                </div>
                            </div>
                        `;
                        if (editar) {
                            li.innerHTML += ` <button onclick="editarProduto(${produto.id})">Editar</button>`;
                        }

                        lista_de_produtos_admin.appendChild(li);
                    });
                } else {
                    console.log("Nenhuma produto encontrada");
                }
            } catch (error) {
                console.error(error);
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
                try {
                    const response = await fetch(`https://api-buy-tech.onrender.com/produtos/${idProduto}`, {
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
                    document.getElementById('personalizado').checked = produto.personalizado;

                } catch (error) {
                    console.error("Erro ao carregar produto:", error);
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
                let formData = {
                    nome: document.getElementById('nome').value,
                    preco: document.getElementById('preco').value,
                    foto: document.getElementById('foto').value,
                    marca: document.getElementById('marca').value,
                    categoria: document.getElementById('categoria').value,
                    descricao: document.getElementById('descricao').value,
                    quantidade_estoque: document.getElementById('quantidade_estoque').value,
                    personalizado: document.getElementById('personalizado').checked,
                };

                try {
                    const response = await fetch(`https://api-buy-tech.onrender.com/produtos/${idProduto}`, {
                        method: 'PATCH',
                        body: JSON.stringify(formData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                        }
                    });

                    const result = await response.json();
                    console.log('Resposta da API:', result);

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
                        mostrarNotificacao("Erro ao atualizar o produto.", {
                            cor: "#F44336",
                            duracao: 4000,
                            posicao: "bottom-right"
                        });
                    }
                } catch (error) {
                    console.error('Erro ao atualizar o produto:', error);
                    mostrarNotificacao("Erro ao atualizar os dados. Tente novamente.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
            });
        }
        else {
            // Cadastro de novo produto
            formCadastroProdutoAdmin.addEventListener('submit', async (event) => {
                event.preventDefault();

                let formData = {
                    nome: document.getElementById('nome').value,
                    preco: document.getElementById('preco').value,
                    foto: document.getElementById('foto').value,
                    marca: document.getElementById('marca').value,
                    categoria: document.getElementById('categoria').value,
                    descricao: document.getElementById('descricao').value,
                    quantidade_estoque: document.getElementById('quantidade_estoque').value,
                    personalizado: document.getElementById('personalizado').checked,
                };

                if (!formData.nome || !formData.preco || !formData.foto || !formData.marca || !formData.categoria || !formData.descricao || !formData.quantidade_estoque) {
                    mostrarNotificacao("Todos os campos devem ser preenchidos.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                    return;
                }

                try {
                    const response = await fetch('https://api-buy-tech.onrender.com/produtos', {
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
                        mostrarNotificacao("Produto cadastrado com sucesso!", {
                            cor: "#4CAF50",
                            duracao: 4000,
                            posicao: "bottom-right"
                        });
                        setTimeout(() => {
                            window.location.href = './index.html';
                        }, 3000);
                        
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

}

// Lista categorias e manda para o select
document.addEventListener("DOMContentLoaded", async function () {
    const categoriaSelect = document.getElementById("categoria");

    try {
        const response = await fetch("https://api-buy-tech.onrender.com/categorias");
        const categorias = await response.json();

        // Limpa opções antigas
        categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

        // Adiciona as categorias ao select
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nome;
            categoriaSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        categoriaSelect.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    }
});