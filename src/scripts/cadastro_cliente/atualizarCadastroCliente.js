const tokenCliente = getCookie('authTokenCliente');
const tokenRefresh = getCookie('authTokenClienteRefresh')
if (tokenCliente || tokenClienteRefresh) {
    const avatar = document.getElementById('avatar');
    avatar.classList.remove('bx-user');
    avatar.classList.add('bxs-user-circle');
    // Função assíncrona para fazer a requisição à API
    async function authenticate() {
        try {
            const response = await fetch('https://api-buy-tech.onrender.com/clientes/autenticar', {
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
                document.getElementById('cep').value = result.cep;
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

