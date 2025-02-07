const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};


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
        const response = await fetch(`https://api-buy-tech.onrender.com/cards/${id}`, {
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
            console.error("Erro ao atualizar");
        }
    } catch (error) {
        console.error("Erro ao atualizar:", error);
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


