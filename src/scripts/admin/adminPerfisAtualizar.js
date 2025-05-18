// adminPerfisAtualizar.js

import * as config from '../consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');

async function listarPerfis(tipo, elementoId, editar = false) {
    const urls = {
        admins: `${config.API_URL}/admins`,
        clientes: `${config.API_URL}/clientes/admin`,
        revendedores: `${config.API_URL}/revendedores`
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
                listarElemento.innerHTML += `<hr /> <br />`;
                result.forEach((usuario) => {
                    const li = document.createElement("li");
                    li.classList.add("usuario-item");
                    // Verifica se deve usar 'nome' ou 'razao_social'
                    const nomeOuRazao = (tipo === "revendedores" || tipo === "cliente") ? usuario.razao_social : usuario.nome;

                    let usuarioHTML = `
                        <div class="usuario-info">
                            <span class="usuario-id">ID: ${usuario.id}</span>
                            <span class="usuario-nome">Nome: ${nomeOuRazao}</span>
                            <span class="usuario-email">Email: ${usuario.email}</span>
                        </div>
                        <div class="usuario-status">
                    `;

                    if (editar === true) {
                        usuarioHTML += `
                            <button class="botaoAtivarDesativar" onclick="atualizarStatusUsuario(${usuario.id}, '${tipo}')">
                                ${usuario.status ? 'Desativar' : 'Ativar'}
                            </button>
                        `;
                    }

                    usuarioHTML += `</div>`;
                    li.innerHTML = usuarioHTML;
                    listarElemento.appendChild(li);
                });
                
            }
        } catch (error) {
            setTimeout(() => {
                listarPerfis(tipo, elementoId, editar);
            }, 1000);
        }
    }
}


export async function listarEEditarPerfisAdmin() {
    listarPerfis('admins', 'listar_de_perfis_admins', true);
    listarPerfis('clientes', 'listar_de_perfis_clientes', true);
    listarPerfis('revendedores', 'listar_de_perfis_revendedores', true);
}

export function listarPerfisAdmin() {
    listarPerfis('admins', 'listar_de_perfis_admins', false);
    listarPerfis('clientes', 'listar_de_perfis_clientes', false);
    listarPerfis('revendedores', 'listar_de_perfis_revendedores', false);
}


export async function atualizarStatusUsuario(id, tipo) {
    if (!tokenAdmin && !tokenAdminRefresh) return;

    const tiposValidos = ['admins', 'clientes', 'revendedores'];
    if (!tiposValidos.includes(tipo)) {
        return;
    }
    displayLoader(true);
    disableButton(true);
    try {
        // Define a URL corretamente para cada tipo
        const url = tipo === 'clientes'
            ? `${config.API_URL}/clientes/admin/atualizar_status/${id}`
            : tipo === 'revendedores'
                ? `${config.API_URL}/revendedores/admin/atualizar_status/${id}`
                : `${config.API_URL}/${tipo}/atualizar_status/${id}`;

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
                displayLoader(false);
                disableButton(false);
                listarEEditarPerfisAdmin();
            }, 3000);
            
        } else {
            if(response.status === 403) {
                mostrarNotificacao("Você não tem permissão para realizar essa ação!", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                displayLoader(false);
            disableButton(false);
            setTimeout(() => {
                listarEEditarPerfisAdmin();
            }, 3000);
            }
        }
    } catch (error) {
        setTimeout(() => {
            atualizarStatusUsuario(id, tipo);
        }, 1000);
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
const disableButton = (isDisabled) => {
    // Seleciona o botão pela classe "botaoAtivarDesativar"
    const submitButton = document.querySelector('.botaoAtivarDesativar');

    if (submitButton) {
        submitButton.disabled = isDisabled;
    }
};

listarEEditarPerfisAdmin();

window.listarEEditarPerfisAdmin = listarEEditarPerfisAdmin; 
window.atualizarStatusUsuario = atualizarStatusUsuario;
