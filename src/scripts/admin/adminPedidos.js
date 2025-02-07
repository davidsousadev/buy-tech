function listarPedidos(editar) {
    var token = getCookie('authTokenAdmin');
    if (token) {
        async function authenticate() {
            try {
                const response = await fetch('https://api-buy-tech.onrender.com/pedidos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const result = await response.json();

                if (result && result.length > 0) {
                    const listar_de_pedidos = document.getElementById("listar_de_pedidos");
                    listar_de_pedidos.innerHTML = "";

                    result.forEach((pedido) => {
                        const li = document.createElement("li");
                        li.innerHTML = `<span id="categoria-nome-${pedido.id}">${pedido.nome}</span>`;

                        if (editar) {
                            li.innerHTML += ` <button onclick="editarCategoria(${pedido.id}, '${pedido.nome}')">Editar</button>`;
                        }

                        listar_de_pedidos.appendChild(li);
                    });
                } else {
                    listar_de_pedidos.innerHTML = "Nenhum pedido encontrado";
                    console.log("Nenhum pedido encontrada");
                }
            } catch (error) {
                console.error(error);
            }
        }
        authenticate();
    }
}

function editarPedido(id, nomeAtual) {
    const novoNome = prompt("Editar pediso:", nomeAtual);
    if (novoNome && novoNome !== nomeAtual) {
        atualizarPedido(id, novoNome);
    }
}

async function atualizarPedido(id, novoNome) {
    const token = getCookie('authTokenAdmin');
    if (!token) return;

    try {
        const response = await fetch(`https://api-buy-tech.onrender.com/pedido/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome: novoNome })
        });
        if (response.ok) {
            listarPedidos();
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


