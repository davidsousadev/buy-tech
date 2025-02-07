const formCadastroCliente = document.getElementById('formCadastroCliente');

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

if (formCadastroCliente) {
    const token = getCookie('authTokenAdmin');
    if (formCadastroCliente) {
        formCadastroCliente.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Criação do objeto com os dados aceitos pela API
            let formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                cpf: document.getElementById('cpf').value.replace(/\D/g, ''),  // Remove tudo que não for número
                data_nascimento: document.getElementById('dataNascimento').value,
                telefone: document.getElementById('telefone').value,
                cep: document.getElementById('cep').value.replace(/\D/g, ''),  // Remove tudo que não for número
                complemento: document.getElementById('complemento').value,
                password: document.getElementById('password').value,
                confirm_password: document.getElementById('confirmPassword').value
            };

            // Verifica se todos os campos obrigatórios estão preenchidos
            if (!formData.nome || !formData.email || !formData.cpf || !formData.data_nascimento || !formData.telefone || !formData.cep || !formData.password || !formData.confirm_password) {
                mostrarNotificacao("Todos os campos devem ser preenchidos.", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });

                return;
            }

            // Verifica se as senhas são iguais
            if (formData.password !== formData.confirm_password) {
                mostrarNotificacao("As senhas não coincidem.", {
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
                console.log(formData)
                const response = await fetch('https://api-buy-tech.onrender.com/clientes/cadastrar', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' },
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
                    window.location.href = './confirmacao.html';
                } else {
                    // Exibe mensagens de erro específicas com base na resposta da API
                    mostrarNotificacao(result.detail || 'Erro ao realizar o cadastro.', {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
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
}


async function listarPerfis(tipo, elementoId, editar = false) {
    const urls = {
        admins: 'https://api-buy-tech.onrender.com/admins',
        clientes: 'https://api-buy-tech.onrender.com/clientes',
        revendedores: 'https://api-buy-tech.onrender.com/revendedores'
    };

    var token = getCookie('authTokenAdmin');
    if (token) {
        try {
            const response = await fetch(urls[tipo], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const result = await response.json();

            if (result && result.length > 0) {
                const listarElemento = document.getElementById(elementoId);
                listarElemento.innerHTML = `<h3>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>`;

                result.forEach((usuario) => {
                    const li = document.createElement("li");
                    li.innerHTML = `<span>${usuario.nome}</span>`;

                    if (editar) {
                        let status = usuario.status;
                        if (status===true){
                            li.innerHTML += `<button onclick="atualizarStatusUsuario(${usuario.id}')">Desativar</button>`;
                        }
                        else{
                            li.innerHTML += `<button onclick="atualizarStatusUsuario(${usuario.id}')">Ativar</button>`;
                        }
                    }

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


async function atualizarStatusUsuario(id) {
    const token = getCookie('authTokenAdmin');
    if (!token) return;

    try {
        const response = await fetch(`https://api-buy-tech.onrender.com/clientes/admin/atualizar_status/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (response.ok) {
            listarEEditarPerfisAdmin();
        } else {
            console.error("Erro ao atualizar status do cliente");
        }
    } catch (error) {
        console.error("Erro ao atualizar status do cliente:", error);
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


