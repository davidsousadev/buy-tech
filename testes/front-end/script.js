// Função para validar campos de email e CPF através de uma API
const validateFieldAsync = async (input, endpoint, errorSpanId) => {
    input.addEventListener('blur', async () => {
        const value = input.value.trim();
        const errorSpan = document.getElementById(errorSpanId);

        // Se o campo estiver vazio, limpa os erros e restaura o estilo padrão
        if (value === '') {
            errorSpan.textContent = '';
            input.style.borderColor = '#ccc';
            return;
        }

        try {
            // Faz a requisição para a API
            const response = await fetch(`https://api-buy-tech.onrender.com//clientes/${endpoint}?${input.name}=${value}`);

            if (response.ok) {
                // Campo válido
                errorSpan.textContent = '';
                input.style.borderColor = 'green';
            } else {
                // Exibe a mensagem de erro retornada pela API
                const result = await response.json();
                errorSpan.textContent = result.detail;
                input.style.borderColor = 'red';
            }
        } catch (error) {
            // Erro na requisição
            console.error('Erro na validação:', error);
            errorSpan.textContent = 'Erro na validação. Tente novamente.';
            input.style.borderColor = 'red';
        }
    });
};

// Validação de email e CPF
validateFieldAsync(document.getElementById('email'), 'verificar-email', 'emailError');
validateFieldAsync(document.getElementById('cpf'), 'verificar-cpf', 'cpfError');

// Seleciona o formulário e elementos relevantes
const form = document.getElementById('formCadastro');
const btnCep = document.getElementById('btnCep');
const responseMessage = document.getElementById('responseMessage');

// Função para exibir mensagens de resposta
const displayMessage = (message, type = 'error') => {
    responseMessage.textContent = message;
    responseMessage.style.color = type === 'success' ? 'green' : 'red';
};

// Função para validação ao sair do campo
const validateField = (input, validationFn) => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = validationFn(input.value) ? 'green' : 'red';
        } else {
            input.style.borderColor = '#ccc';
        }
    });
};

// Funções de validação específicas
const isNameValid = (name) => name.trim().split(' ').length > 1 && name.length >= 10;
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isCpfValid = (cpf) => /^\d{11}$/.test(cpf);
const isPhoneValid = (phone) => /^\d{9}$/.test(phone);
const isCepValid = (cep) => /^\d{5}-?\d{3}$/.test(cep);
const isPasswordValid = (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

// Aplicar validação a cada campo
validateField(document.getElementById('nome'), isNameValid);
validateField(document.getElementById('email'), isEmailValid);
validateField(document.getElementById('cpf'), isCpfValid);
validateField(document.getElementById('telefone'), isPhoneValid);
validateField(document.getElementById('cep'), isCepValid);
validateField(document.getElementById('password'), isPasswordValid);

// Validação de Data de Nascimento
const validateDateOfBirth = (dateInput) => {
    dateInput.addEventListener('blur', () => {
        const errorSpan = document.getElementById('dataNascimentoError');
        const birthDate = new Date(dateInput.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (isNaN(birthDate.getTime())) {
            errorSpan.textContent = 'Data inválida.';
            dateInput.style.borderColor = 'red';
        } else if (age < 18 || (age === 18 && today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()))) {
            errorSpan.textContent = 'Idade mínima de 18 anos.';
            dateInput.style.borderColor = 'red';
        } else {
            errorSpan.textContent = '';
            dateInput.style.borderColor = 'green';
        }
    });
};

// Chamar a função de validação de Data de Nascimento
validateDateOfBirth(document.getElementById('dataNascimento'));

// Consulta CEP na API BrasilAPI
btnCep.addEventListener('click', async () => {
    const cep = document.getElementById('cep').value.trim();
    const errorSpan = document.getElementById('cepError');

    if (!isCepValid(cep)) {
        errorSpan.textContent = 'CEP inválido. Deve conter 8 dígitos.';
        document.getElementById('cep').style.borderColor = 'red';
        return;
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('estado').value = data.state || '';
            document.getElementById('cidade').value = data.city || '';
            document.getElementById('bairro').value = data.neighborhood || '';
            document.getElementById('rua').value = data.street || '';
            errorSpan.textContent = '';
            document.getElementById('cep').style.borderColor = 'green';
            displayMessage('Endereço encontrado!', 'success');
        } else {
            errorSpan.textContent = 'CEP não encontrado.';
            document.getElementById('cep').style.borderColor = 'red';
        }
    } catch (error) {
        errorSpan.textContent = '';
        document.getElementById('cep').style.borderColor = 'red';
    }
});

// Envio do formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        displayMessage('As senhas não coincidem.');
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await fetch('https://api-buy-tech.onrender.com//clientes/cadastrar', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (response.ok) {
            displayMessage('Cadastro realizado com sucesso!', 'success');
            window.location.href = './confirmacao.html';
        } else {
            displayMessage(result.detail || 'Erro ao realizar o cadastro.');
        }
    } catch (error) {
        displayMessage('Erro ao enviar os dados. Tente novamente.');
    }
});

// Máscara para o campo de telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 3)}.${value.slice(3, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else {
        e.target.value = value;
    }
});

// Máscara para o campo de CEP
const cepInput = document.getElementById('cep');
cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 5) {
        e.target.value = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else {
        e.target.value = value;
    }
});

// Validação de senhas em tempo real
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordErrorSpan = document.getElementById('passwordError');

const validatePasswordsMatch = () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword === '') {
        passwordErrorSpan.textContent = '';
        confirmPasswordInput.style.borderColor = '#ccc';
        return;
    }

    if (password === confirmPassword) {
        passwordErrorSpan.textContent = '✅ Senhas coincidem!';
        passwordErrorSpan.style.color = 'green';
        passwordInput.style.borderColor = 'green';
        confirmPasswordInput.style.borderColor = 'green';
    } else {
        passwordErrorSpan.textContent = '❌ Senhas não coincidem.';
        passwordErrorSpan.style.color = 'red';
        passwordInput.style.borderColor = 'red';
        confirmPasswordInput.style.borderColor = 'red';
    }
};