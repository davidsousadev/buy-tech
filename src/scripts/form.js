//form.js

import * as config from './consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export const handleFormSubmission = async () => {
    const formCadastroCliente = document.getElementById('formCadastroCliente');
    const formAtualizacaoCliente = document.getElementById('formAtualizacaoCliente');

    const formCadastroAdmin = document.getElementById('formCadastroAdmin');
    const formCadastroAdminAtualizar = document.getElementById('formCadastroAdminAtualizar');

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

                const response = await fetch(`${config.API_URL}/clientes/cadastrar`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();

                displayLoader(false);
                disableSubmitButton(false);

                if (response.status === 201) {
                    mostrarNotificacao("Cadastro realizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });

                    setTimeout(() => {
                        window.location.href = `${config.FRONT_URL}/confirmacao.html`;
                    }, 3000);

                } else {
                    mostrarNotificacao(result.detail || 'Erro ao realizar o cadastro.', {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                }
            } catch (error) {

                // Esconde o loader e habilita o botão novamente
                displayLoader(false);
                disableSubmitButton(false);

                mostrarNotificacao("Erro ao realizar o cadastro.", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
        });


    }
    if (formCadastroAdminAtualizar) {
        const tokenAdmin = getCookie('authTokenAdmin');
        const tokenAdminRefresh = getCookie('authTokenAdminRefresh');
        if (tokenAdmin || tokenAdminRefresh) {
            formCadastroAdminAtualizar.addEventListener('submit', async (event) => {
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

                    const response = await fetch(`${config.API_URL}/admins/atualizar`, {
                        method: 'PATCH',
                        body: JSON.stringify(formData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                        },
                    });

                    const result = await response.json();


                    // Esconde o loader e habilita o botão novamente
                    displayLoader(false);
                    disableSubmitButton(false);

                    if (response.ok) {
                        mostrarNotificacao("Cadastro Atualizado com sucesso!", {
                            cor: "#4CAF50",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 5000);

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
                    // Esconde o loader e habilita o botão novamente
                    displayLoader(false);
                    disableSubmitButton(false);
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            });
        }
    }
    if (formCadastroAdmin) {
        formCadastroAdmin.addEventListener('submit', async (event) => {
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

                const response = await fetch(`${config.API_URL}/admins/cadastrar`, {
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
                        cor: "#F44336",
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
                // Esconde o loader e habilita o botão novamente
                displayLoader(false);
                disableSubmitButton(false);
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        });
    }
    if (formAtualizacaoCliente) {
        const tokenCliente = getCookie('authTokenCliente');
        const tokenClienteRefresh = getCookie('authTokenClienteRefresh');
        if (tokenCliente || tokenClienteRefresh) {
            formAtualizacaoCliente.addEventListener('submit', async (event) => {
                event.preventDefault();

                // Criação do objeto com os dados aceitos pela API
                let formData = {

                    email: document.getElementById('email').value,
                    telefone: document.getElementById('telefone').value,
                    cep: document.getElementById('cep').value.replace(/\D/g, ''),  // Remove tudo que não for número
                    complemento: document.getElementById('complemento').value,
                    password: document.getElementById('password').value,
                    confirm_password: document.getElementById('confirmPassword').value
                };

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

                    const response = await fetch(`${config.API_URL}/clientes`, {
                        method: 'PATCH',
                        body: JSON.stringify(formData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`
                        },
                    });

                    const result = await response.json();



                    // Esconde o loader e habilita o botão novamente
                    displayLoader(false);
                    disableSubmitButton(false);

                    if (response.ok) {
                        mostrarNotificacao("Cadastro Atualizado com sucesso!", {
                            cor: "#4CAF50",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                        setTimeout(() => {
                            window.location.href = '../logar.html';
                        }, 5000);

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

                    // Esconde o loader e habilita o botão novamente
                    displayLoader(false);
                    disableSubmitButton(false);
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            });
        }
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
