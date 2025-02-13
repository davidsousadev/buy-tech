const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export const handleFormSubmission = async () => {
    const formCadastroPessoaJuridica = document.getElementById('formCadastroPessoaJuridica');
    const formCadastroPessoaJuridicaAtualizado = document.getElementById('formCadastroPessoaJuridicaAtualizado');
    if (formCadastroPessoaJuridica) {
        formCadastroPessoaJuridica.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Criação do objeto com os dados aceitos pela API
            let formData = {
                razao_social: document.getElementById('razaoSocial').value,
                email: document.getElementById('email').value,
                cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''),  // Remove tudo que não for número
                telefone: document.getElementById('telefone').value,
                inscricao_estadual: document.getElementById('inscricao_estadual').value.replace(/\D/g, ''),  // Remove tudo que não for número
                password: document.getElementById('password').value,
                confirm_password: document.getElementById('confirmPassword').value
            };

            // Verifica se todos os campos obrigatórios estão preenchidos
            if (!formData.email || !formData.cnpj || !formData.telefone || !formData.inscricao_estadual || !formData.password || !formData.confirm_password) {
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
                const response = await fetch('https://api-buy-tech.onrender.com/revendedores/cadastrar', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();

                // Esconde o loader e habilita o botão novamente
                displayLoader(false);
                disableSubmitButton(false);

                if (response.ok) {
                    mostrarNotificacao("Cadastro realizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    window.location.href = '../confirmacao.html';
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
    if(formCadastroPessoaJuridicaAtualizado){
        formCadastroPessoaJuridicaAtualizado.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Criação do objeto com os dados aceitos pela API
            let formData = {
                razao_social: document.getElementById('razaoSocial').value,
                email: document.getElementById('email').value,
                cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''),  // Remove tudo que não for número
                telefone: document.getElementById('telefone').value,
                inscricao_estadual: document.getElementById('inscricao_estadual').value.replace(/\D/g, ''),  // Remove tudo que não for número
                password: document.getElementById('password').value,
                confirm_password: document.getElementById('confirmPassword').value
            };

            // Verifica se todos os campos obrigatórios estão preenchidos
            if (!formData.email || !formData.cnpj || !formData.telefone || !formData.inscricao_estadual || !formData.password || !formData.confirm_password) {
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
                console.table(formData)
                const response = await fetch('https://api-buy-tech.onrender.com/revendedores/atualizar', {
                    method: 'PATCH',
                    body: JSON.stringify(formData),
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`,
                     },
                });

                const result = await response.json();

                // Esconde o loader e habilita o botão novamente
                displayLoader(false);
                disableSubmitButton(false);

                if (response.ok) {
                    mostrarNotificacao("Cadastro realizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                   
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
