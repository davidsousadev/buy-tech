export const handleFormSubmission = async () => {
    const form = document.getElementById('formCadastro');
    const submitButton = document.getElementById('submitButton'); // Assumindo que o botão de submit tenha o id 'submitButton'

    if (form) {
        form.addEventListener('submit', async (event) => {
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
                displayMessage('Todos os campos devem ser preenchidos.');
                return;
            }

            // Verifica se as senhas são iguais
            if (formData.password !== formData.confirm_password) {
                displayMessage('As senhas não coincidem.');
                return;
            }

            // Exibe os dados enviados para depuração
            console.log('Dados enviados para a API:', formData);

            // Exibe o loader e desabilita o botão
            displayLoader(true);
            disableSubmitButton(true);

            try {
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
                    displayMessage('Cadastro realizado com sucesso!', 'success');
                    window.location.href = './confirmacao.html';
                } else {
                    // Exibe mensagens de erro específicas com base na resposta da API
                    displayMessage(result.detail || 'Erro ao realizar o cadastro.');
                }
            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
                // Esconde o loader e habilita o botão novamente
                displayLoader(false);
                disableSubmitButton(false);
                displayMessage('Erro ao enviar os dados. Tente novamente.');
            }
        });
    }
};

// Função para exibir mensagens de sucesso ou erro
const displayMessage = (message, type = 'error') => {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.style.color = type === 'success' ? 'green' : 'red';
    }
};

// Função para exibir/esconder o loader
const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = isLoading ? 'block' : 'none';
    }
};

// Função para habilitar/desabilitar o botão de submit
const disableSubmitButton = (isDisabled) => {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.disabled = isDisabled;
    }
};
