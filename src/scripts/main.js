import { nomeValido } from './nome.js';
import { validateEmail } from './email.js';
import { configurarEventosCPF } from './cpf.js';
import { validateAge } from './idade.js';
import { handleCepValidation } from './cep.js';
import { validatePasswordsMatch } from './senha.js';
import { configurarEventosTelefone } from './telefone.js';
import { validateComplement } from './complemento.js';
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
