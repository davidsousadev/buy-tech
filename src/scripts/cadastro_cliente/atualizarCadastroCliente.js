// atualizarCadastroCliente.js

import * as config from '../consts.js';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');

if (tokenCliente || tokenClienteRefresh) {
    const avatar = document.getElementById('avatar');
    avatar.classList.remove('bx-user');
    avatar.classList.add('bxs-user-circle');
    // Função assíncrona para fazer a requisição à API
    async function authenticate() {
        try {
            const response = await fetch(`${config.API_URL}/clientes/autenticar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                // Preenche os campos do formulário
                document.getElementById('nome').value = result.nome;
                document.getElementById('email').value = result.email;
                document.getElementById('dataNascimento').value = result.data_nascimento;
                let cepNumerico = parseInt(result.cep, 10); // Converte para número
                let cepString = cepNumerico.toString().padStart(8, '0'); // Garante 8 dígitos
                document.getElementById('cep').value = cepString.replace(/(\d{5})(\d{3})$/, '$1-$2');

                document.getElementById('cpf').value = result.cpf;
                document.getElementById('telefone').value = result.telefone;
                document.getElementById('complemento').value = result.complemento;

                const saldo = document.getElementById('saldo');
                saldo.innerHTML = result.pontos_fidelidade.toFixed(2);
            }

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
    }

    // Chama a função de autenticação
    authenticate();
}

