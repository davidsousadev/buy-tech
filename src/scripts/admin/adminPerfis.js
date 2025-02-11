const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const formCadastroCliente = document.getElementById('formCadastroCliente');
const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');
async function listarPerfis(tipo, elementoId, editar = false) {
    const urls = {
        admins: 'https://api-buy-tech.onrender.com/admins',
        clientes: 'https://api-buy-tech.onrender.com/clientes/admin',
        revendedores: 'https://api-buy-tech.onrender.com/revendedores'
    };


    if (tokenAdmin || tokenAdminRefresh) {
        try {
            const response = await fetch(urls[tipo], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                },
            });
            const result = await response.json();

            if (result && result.length > 0) {
                const listarElemento = document.getElementById(elementoId);
                listarElemento.innerHTML = `<h3>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>`;

                result.forEach((usuario) => {
                    const li = document.createElement("li");
                    li.classList.add("usuario-item");

                    // Inicializa a string para os dados do usuário
                    let usuarioHTML = `
                        <div class="usuario-info">
                            <span class="usuario-id">ID: ${usuario.id}</span>
                            <span class="usuario-nome">Nome: ${usuario.nome}</span>
                            <span class="usuario-email">Email: ${usuario.email}</span>
                        </div>
                        <div class="usuario-status">
                    `;

                    // Adiciona o botão de editar somente se 'editar' for true
                    if (editar === true) {
                        usuarioHTML += `
                            <button onclick="atualizarStatusUsuario(${usuario.id}, '${tipo}')">
                                ${usuario.status ? 'Desativar' : 'Ativar'}
                            </button>
                        `;
                    }

                    // Finaliza a string com a div de status
                    usuarioHTML += `</div>`;

                    // Define o conteúdo HTML do <li>
                    li.innerHTML = usuarioHTML;

                    // Adiciona o item à lista na página
                    listarElemento.appendChild(li);
                });

            } else {
                console.log(`Nenhum usuário encontrado para ${tipo}`);
            }
        } catch (error) {
            console.error(`Erro ao listar ${tipo}:`, error);
        }
    }
}

async function listarEEditarPerfisAdmin() {
    listarPerfis('admins', 'listar_de_perfis_admins', true);
    listarPerfis('clientes', 'listar_de_perfis_clientes', true);
    listarPerfis('revendedores', 'listar_de_perfis_revendedores', true);
}

function listarPerfisAdmin() {
    listarPerfis('admins', 'listar_de_perfis_admins', false);
    listarPerfis('clientes', 'listar_de_perfis_clientes', false);
    listarPerfis('revendedores', 'listar_de_perfis_revendedores', false);
}


async function atualizarStatusUsuario(id, tipo) {
    
    if (!tokenAdmin && !tokenAdminRefresh) return;
    
    const tiposValidos = ['admins', 'clientes', 'revendedores'];
    if (!tiposValidos.includes(tipo)) {
        console.error("Tipo inválido");
        return;
    }
    try {

        const url = tipo === 'clientes'
            ? `https://api-buy-tech.onrender.com/${tipo}/admin/atualizar_status/${id}`
            : `https://api-buy-tech.onrender.com/${tipo}/atualizar_status/${id}`;

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
            },
        });

        if (response.ok) {
            mostrarNotificacao("Status do usuário atualizado com sucesso!", {
                cor: "#4CAF50",
                duracao: 2000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            setTimeout(() => {
                listarEEditarPerfisAdmin();
            }, 3000);
        } else {
            console.error("Erro ao atualizar status do usuário");
        }
    } catch (error) {
        console.error("Erro ao atualizar status do usuário:", error);
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


