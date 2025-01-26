export const handleFormSubmission = async () => {
    const form = document.getElementById('formCadastro');
    const submitButton = document.getElementById('submitButton');

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
