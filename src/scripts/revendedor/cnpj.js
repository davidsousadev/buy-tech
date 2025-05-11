// cnpj.js

import * as config from '../consts.js';

// Formatar CNPJ no formato 00.000.000/0000-00
export function formatarCNPJ(cnpjInput) {
    let cnpj = cnpjInput.value.replace(/\D/g, '');

    if (cnpj.length <= 2) {
        cnpj = cnpj;
    } else if (cnpj.length <= 5) {
        cnpj = cnpj.replace(/(\d{2})(\d{1,3})/, '$1.$2');
    } else if (cnpj.length <= 8) {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (cnpj.length <= 12) {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
    } else {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
    }

    cnpjInput.value = cnpj;
}

// Permitir apenas números no campo de CNPJ sem modificar diretamente o valor do campo
export function somenteNumerosCNPJ(cnpjInput) {
    return cnpjInput.value.replace(/\D/g, '');
}

// Validar CNPJ
export function validarCNPJ(cnpj) {

    if (!cnpj) {
        console.error("Erro: CNPJ está undefined ou vazio.");
        return false;
    }
    
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Erro ocorre aqui
    
    if (cnpj.length !== 14) {
        console.error("Erro: CNPJ inválido.");
        return false;
    }

    let tamanho = 12;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = 13;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado == digitos.charAt(1);
}

// Adicionar eventos de input e blur ao CNPJ
export function configurarEventosCNPJ() {
    const cnpjInput = document.getElementById('cnpj');

    // Evento de entrada (teclado)
    cnpjInput.addEventListener('input', () => {
        let valorFormatado = somenteNumerosCNPJ(cnpjInput);
        cnpjInput.value = valorFormatado; // Mantém apenas os números
        formatarCNPJ(cnpjInput); // Aplica a formatação
    });

    // Evento de perda de foco
    cnpjInput.addEventListener('blur', async () => {
        formatarCNPJ(cnpjInput); // Aplica a formatação final

        // Validação do CNPJ
        if (!validarCNPJ(cnpjInput.value) && cnpjInput.value !== '') {
            cnpjInput.style.borderColor = 'red';
            mostrarNotificacao("CNPJ inválido.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            return;
        }

        cnpjInput.style.borderColor = 'green';

        if (validarCNPJ(cnpjInput.value) && cnpjInput.value !== '') {
            // Verificação de duplicidade na API
            try {
                const response = await fetch(`${config.API_URL}/revendedores/verificar-cnpj?cnpj=${somenteNumerosCNPJ(cnpjInput)}`);
                if (response.ok) {
                    const result = await response.json();

                    if (result.cnpj === true) {
                        cnpjInput.style.borderColor = 'green';
                    } else {
                        cnpjInput.style.borderColor = 'red';
                        mostrarNotificacao("CNPJ já em uso.", {
                            cor: "#F44336",
                            duracao: 4000,
                            movimentoEntrada: "deslizar",
                            movimentoSaida: "esvair",
                            posicao: "bottom-right"
                        });
                    }
                }
            } catch (error) {
                cnpjInput.style.borderColor = 'red';
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
