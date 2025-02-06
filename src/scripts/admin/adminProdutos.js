function listarCategorias(editar) {
    var token = getCookie('authTokenAdmin');
    if (token) {
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
                    const listar_de_categorias = document.getElementById("listar_de_categorias");
                    listar_de_categorias.innerHTML = "";
                
                    result.forEach((categoria) => {
                        const li = document.createElement("li");
                        li.innerHTML = `<span id="categoria-nome-${categoria.id}">${categoria.nome}</span>`;
                        
                        if (editar) {
                            li.innerHTML += ` <button onclick="editarCategoria(${categoria.id}, '${categoria.nome}')">Editar</button>`;
                        }

                        listar_de_categorias.appendChild(li);
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

function editarCategoria(id, nomeAtual) {
    const novoNome = prompt("Editar categoria:", nomeAtual);
    if (novoNome && novoNome !== nomeAtual) {
        atualizarCategoria(id, novoNome);
    }
}

async function atualizarCategoria(id, novoNome) {
    const token = getCookie('authTokenAdmin');
    if (!token) return;

    try {
        const response = await fetch(`https://api-buy-tech.onrender.com/categorias/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome: novoNome })
        });
        if (response.ok) {
            listarCategorias();
        } else {
            console.error("Erro ao atualizar categoria");
        }
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
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

const formCadastroProdutoAdmin = document.getElementById('formCadastroProdutoAdmin');
if (formCadastroProdutoAdmin) {
    formCadastroProdutoAdmin.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Criação do objeto com os dados aceitos pela API
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
        console.table(formData)
        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!formData.nome || !formData.preco || !formData.foto || !formData.marca || !formData.categoria || !formData.descricao || !formData.quantidade_estoque) {
            mostrarNotificacao("Todos os campos devem ser preenchidos.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            
            return;
        }
        // Exibe o loader e desabilita o botão
        displayLoader(true);
        disableSubmitButton(true);
        try {
            const token = getCookie('authTokenAdmin');
            if (token) {
            const response = await fetch('https://api-buy-tech.onrender.com/produtos', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 }
                
            });
            
            const result = await response.json();
            // Exibe a resposta da API no console para depuração
            console.log('Resposta da API:', result);
            // Esconde o loader e habilita o botão novamente
            displayLoader(false);
            disableSubmitButton(false);
            if (response.ok) {
                mostrarNotificacao("Cadastro realizado com sucesso!", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                window.location.href = './index.html';
            } else {
                // Exibe mensagens de erro específicas com base na resposta da API
                mostrarNotificacao('Erro ao realizar o cadastro.', {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
        }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            // Esconde o loader e habilita o botão novamente
            displayLoader(false);
            disableSubmitButton(false);
            mostrarNotificacao("Erro ao enviar os dados. Tente novamente.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        }
    });
}

