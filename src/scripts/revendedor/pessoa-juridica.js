// pessoa-juridica.js

import * as config from '../consts.js';

import { razaoValida } from './razaoSocial.js';
import { validateEmail } from '../cadastro_cliente/email.js';
import { validatePasswordsMatch } from '../cadastro_cliente/senha.js';
import { configurarEventosTelefone } from '../cadastro_cliente/telefone.js';
import { handleFormSubmission } from './form-juridica.js';

document.addEventListener('DOMContentLoaded', () => {
    razaoValida(); // Validação de Razão Social
    validateEmail(); // Configurar eventos para o campo E-mail
    configurarEventosTelefone(); // Configurar eventos para o campo de telefone
    validatePasswordsMatch(); // Validação de Senha
    handleFormSubmission(); // Envio de formulário

    configurarEventosCNPJ(); // Configurar eventos de CNPJ
    configurarEventosInscricaoEstadual(); // Configurar eventos de Inscrição Estadual
});

// Configurar eventos do CNPJ
function configurarEventosCNPJ() {
    const cnpjInput = document.getElementById('cnpj');
    if (!cnpjInput) {
        console.error("Erro: Campo de CNPJ não encontrado.");
        return;
    }
    
    cnpjInput.addEventListener('input', () => {
        cnpjInput.value = formatarCNPJ(somenteNumerosCNPJ(cnpjInput));
    });

    cnpjInput.addEventListener('blur', async () => {
        formatarCNPJ(cnpjInput);
        
        if (!validarCNPJ(cnpjInput.value) && cnpjInput.value !== '') {
            cnpjInput.style.borderColor = 'red';
            mostrarNotificacao("CNPJ inválido.", notificacaoErroConfig());
            return;
        }

        cnpjInput.style.borderColor = 'green';
        await verificarCNPJNaAPI(cnpjInput);
    });
}

// Formatar CNPJ
function formatarCNPJ(cnpj) {
    return cnpj.replace(/\D/g, '')
        .replace(/(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, (match, p1, p2, p3, p4, p5) => {
            return [p1, p2, p3, p4, p5].filter(Boolean).join('.').replace(/\.(\d{3})\.(\d{3})\.(\d{4})/, '/$1.$2-$3');
        });
}

// Permitir apenas números no CNPJ
function somenteNumerosCNPJ(cnpjInput) {
    return cnpjInput.value.replace(/\D/g, '');
}

// Validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = somenteNumerosCNPJ({ value: cnpj });
    if (cnpj.length !== 14) return false;

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

// Verificar CNPJ na API
async function verificarCNPJNaAPI(cnpjInput) {
    try {
        const response = await fetch(`${config.API_URL}/revendedores/verificar-cnpj?cnpj=${somenteNumerosCNPJ(cnpjInput)}`);
        if (response.ok) {
            const result = await response.json();
            cnpjInput.style.borderColor = result.cnpj ? 'green' : 'red';
            if (!result.cnpj) {
                mostrarNotificacao("CNPJ já em uso.", notificacaoErroConfig());
            }
        }
    } catch (error) {
        cnpjInput.style.borderColor = 'red';
        mostrarNotificacao('Erro na validação. Tente novamente.', notificacaoErroConfig());
    }
}

// Configurar eventos para Inscrição Estadual
function configurarEventosInscricaoEstadual() {
    const inputInscricaoEstadual = document.getElementById("inscricao_estadual");
    if (!inputInscricaoEstadual) {
        console.error("Erro: Campo de Inscrição Estadual não encontrado.");
        return;
    }
    inputInscricaoEstadual.addEventListener("input", () => {
        validarInscricaoEstadual(inputInscricaoEstadual);
    });
}

// Validar Inscrição Estadual
function validarInscricaoEstadual(input) {
    const valor = input.value.replace(/\D/g, "");
    input.setCustomValidity(valor.length === 9 ? "" : "A Inscrição Estadual deve ter exatamente 9 dígitos.");
}

// Configuração para notificações de erro
function notificacaoErroConfig() {
    return {
        cor: "#F44336",
        duracao: 4000,
        movimentoEntrada: "deslizar",
        movimentoSaida: "esvair",
        posicao: "bottom-right"
    };
}
