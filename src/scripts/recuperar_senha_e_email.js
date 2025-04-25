// Formulário para Recuperar Senha
const formRecuperarSenha = document.getElementById('formRecuperarSenha');
if (formRecuperarSenha) {
   
    formRecuperarSenha.addEventListener('submit', async (e) => {
        e.preventDefault();  // Impede o envio tradicional do formulário

        const termo = document.getElementById('termo').value.trim();

        // Função para remover caracteres não numéricos
        const limparNumero = (valor) => valor.replace(/\D/g, '');

        // Identificação do tipo de entrada
        let tipo = '';
        if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(termo) || /^\d{11}$/.test(termo)) {
            tipo = 'cpf';
        } else if (/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(termo) || /^\d{14}$/.test(termo)) {
            tipo = 'cnpj';
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(termo)) {
            tipo = 'email';
        } else {
            mostrarNotificacao("Digite um CPF, CNPJ ou e-mail válido.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            return;
        }

        // Limpa CPF/CNPJ antes de enviar
        let parametro = termo;
        if (tipo === 'cpf' || tipo === 'cnpj') {
            parametro = limparNumero(termo);
        }

        if (parametro) {

            displayLoader(true);
            disableSubmitButton('submitButtonSenha', true);
            try {
                const response = await fetch(`https://api-buy-tech.onrender.com/emails/recuperar_senha?${tipo}=${parametro}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.email) {
                        displayLoader(false);
                        disableSubmitButton('submitButtonSenha', false);
                        mostrarNotificacao("Senha Recuperada!", {
                            cor: "#4CAF50",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                        setTimeout(() => {
                            window.location.href = `./logar.html`;
                        }, 3000);
                    }
                } else {
                    const result = await response.json();
                    displayLoader(false);
                    disableSubmitButton('submitButtonSenha', false);
                    if (result.detail) {
                        mostrarNotificacao(`${result.detail}`, {
                            cor: "#F44336",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                    }
                }
            } catch (error) {
                displayLoader(false);
                disableSubmitButton('submitButtonSenha', false);
                setTimeout(() => {
                location.reload();
                }, 1000);
            }
        }
    });
}

// Formulário para recuperar e-mail
const formRecuperarEmail = document.getElementById('formRecuperarEmail');
if (formRecuperarEmail) {
    formRecuperarEmail.addEventListener('submit', async (e) => {
        e.preventDefault();  // Impede o envio tradicional do formulário

        const email = document.getElementById('email').value;

        if (email) {
            displayLoader(true);
            disableSubmitButton('submitButtonEmail', true);
            try {
                const response = await fetch(`https://api-buy-tech.onrender.com/emails/recuperar_email?email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.email) {
                        displayLoader(false);
                        disableSubmitButton('submitButtonEmail', false);
                        mostrarNotificacao("Email Recuperado!", {
                            cor: "#4CAF50",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                        setTimeout(() => {
                            window.location.href = `./logar.html`;
                        }, 3000);
                    }
                } else {
                    const result = await response.json();
                    displayLoader(false);
                    disableSubmitButton('submitButtonEmail', false);
                    if (result.detail) {
                        mostrarNotificacao(`${result.detail}`, {
                            cor: "#F44336",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                    }
                }
            } catch (error) {
                displayLoader(false);
                disableSubmitButton('submitButtonEmail', false);
                setTimeout(() => {
                    location.reload();
                }, 100);
            }
        }
    });
}

// Função para exibir/esconder o loader
const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = isLoading ? 'flex' : 'none';
    }
};

// Função para habilitar/desabilitar o botão de submit
const disableSubmitButton = (buttonId, isDisabled) => {
    const submitButton = document.getElementById(buttonId);
    if (submitButton) {
        submitButton.disabled = isDisabled;
    }
};
