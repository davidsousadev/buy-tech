import * as consts from './consts.js';
import { nomeValido } from './cadastro_cliente/nome.js';
import { validateEmail } from './cadastro_cliente/email.js';
import { configurarEventosCPF } from './cadastro_cliente/cpf.js';
import { validateAge } from './cadastro_cliente/idade.js';
import { handleCepValidation } from './cadastro_cliente/cep.js';
import { validatePasswordsMatch } from './cadastro_cliente/senha.js';
import { configurarEventosTelefone } from './cadastro_cliente/telefone.js';
import { validateComplement } from './cadastro_cliente/complemento.js';
import { handleFormSubmission } from './form.js';
document.addEventListener('DOMContentLoaded', () => {

    // Validação de Nome (mínimo de 10 caracteres)
    nomeValido();

    // Configurar eventos para o campo E-mail
    validateEmail();

    // Configurar eventos para o campo CPF
    configurarEventosCPF();

    // Chama a função de validação de Idade
    validateAge();

    // Configurar eventos para o campo de telefone
    configurarEventosTelefone();

    // Chama a função de validação de Senha
    validatePasswordsMatch();

    // Chama a função de validação do CEP
    handleCepValidation();

    // Chama a função de validação do Complemento
    validateComplement();

    // Chama a função de envio de formulário
    handleFormSubmission();

});
