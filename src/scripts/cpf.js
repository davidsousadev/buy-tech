// Formatar CPF no formato 000.000.000-00
export function formatarCPF(cpfInput) {
    let cpf = cpfInput.value.replace(/\D/g, '');

    if (cpf.length <= 3) {
        cpfInput.value = cpf;
    } else if (cpf.length <= 6) {
        cpfInput.value = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (cpf.length <= 9) {
        cpfInput.value = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
        cpfInput.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }
}

// Permitir apenas números no campo de CPF
export function somenteNumerosCPF(cpfInput) {
    cpfInput.value = cpfInput.value.replace(/\D/g, '');
}

// Validar CPF
export function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false; // Verifica se tem 11 dígitos ou se são todos iguais
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let primeiroDigito = resto < 2 ? 0 : 11 - resto;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let segundoDigito = resto < 2 ? 0 : 11 - resto;

    // Verifica se os dígitos calculados coincidem
    return cpf.charAt(9) == primeiroDigito && cpf.charAt(10) == segundoDigito;
}

// Adicionar eventos de input e blur ao CPF
export function configurarEventosCPF() {
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', () => {
        somenteNumerosCPF(cpfInput); // Remove os caracteres não numéricos
        formatarCPF(cpfInput); // Aplica a formatação do CPF
    });

    cpfInput.addEventListener('blur', async () => {
        formatarCPF(cpfInput); // Aplica a formatação final quando o campo perde o foco

        // Validação do CPF
        if (!validarCPF(cpfInput.value)) {
            cpfInput.style.borderColor = 'red';
            mostrarNotificacao("CPF inválido.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        } else {
            cpfInput.style.borderColor = 'green';

            // Verificação de duplicidade na API
            try {
                const response = await fetch(`https://api-buy-tech.onrender.com/clientes/verificar-cpf?cpf=${cpfInput.value}`);
                if (response.ok) {
                    cpfInput.style.borderColor = 'green';
                    mostrarNotificacao("CPF válido!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                } else {
                    const result = await response.json();
                    cpfInput.style.borderColor = 'red';
                    mostrarNotificacao(result.detail || "Valor inválido.", {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                }
            } catch (error) {
                cpfInput.style.borderColor = 'red';
                mostrarNotificacao('Erro na validação. Tente novamente.', {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
        }
    });
}
