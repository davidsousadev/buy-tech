// cpf.js

import * as config from '../consts.js';

// Formatar CPF no formato 000.000.000-00
export function formatarCPF(cpfInput) {
    let cpf = cpfInput.value.replace(/\D/g, '');

    if (cpf.length <= 3) {
        cpf = cpf;
    } else if (cpf.length <= 6) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (cpf.length <= 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    cpfInput.value = cpf; // Apenas aqui alteramos o valor do campo
}

// Permitir apenas números no campo de CPF sem modificar diretamente o valor do campo
export function somenteNumerosCPF(cpfInput) {
    return cpfInput.value.replace(/\D/g, '');
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

    // Evento de entrada (teclado)
    cpfInput.addEventListener('input', () => {
        let valorFormatado = somenteNumerosCPF(cpfInput);
        cpfInput.value = valorFormatado; // Mantém apenas os números
        formatarCPF(cpfInput); // Aplica a formatação
    });

    // Evento de perda de foco
    cpfInput.addEventListener('blur', async () => {
        formatarCPF(cpfInput); // Aplica a formatação final

        // Validação do CPF
        if (!validarCPF(cpfInput.value) && cpfInput.value !== '') {
            cpfInput.style.borderColor = 'red';
            mostrarNotificacao("CPF inválido.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            return;
        }

        cpfInput.style.borderColor = 'green';


        if (validarCPF(cpfInput.value) && cpfInput.value !== '') {
            // Verificação de duplicidade na API
            try {

                const response = await fetch(`${config.API_URL}/clientes/verificar-cpf?cpf=${somenteNumerosCPF(cpfInput)}`);
                if (response.ok) {
                    const result = await response.json();

                    if (result.detail === true) {
                        cpfInput.style.borderColor = 'green';
                    } else {
                        cpfInput.style.borderColor = 'red';
                        mostrarNotificacao(result.detail, {
                            cor: "#F44336",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                    }
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
