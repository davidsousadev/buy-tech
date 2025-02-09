// Função para validar senha forte
const isStrongPassword = (password) => {
    // Expressão regular para validar:
    // - Pelo menos 8 caracteres
    // - Pelo menos uma letra
    // - Pelo menos um número
    // - Pelo menos um símbolo
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}\[\]|\\:;"'<>,.?/~`])[A-Za-z\d!@#$%^&*()\-_=+{}\[\]|\\:;"'<>,.?/~`]{8,}$/;
    return regex.test(password);
};

export const validatePasswordsMatch = () => {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Se o campo de confirmação estiver vazio, reseta a borda
    if (confirmPassword === '') {
        document.getElementById('password').style.borderColor = '#ccc';
        document.getElementById('confirmPassword').style.borderColor = '#ccc';
        return;
    }

    // Verifica se a senha é forte
    if (!isStrongPassword(password)) {
        document.getElementById('password').style.borderColor = 'red';
        mostrarNotificacao("Senha deve ter letras, números e símbolos.", {
            cor: "#F44336",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
        return;
    }

    // Verifica se as senhas coincidem
    if (password === confirmPassword) {
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('confirmPassword').style.borderColor = 'green';
    } else {
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('confirmPassword').style.borderColor = 'red';
        mostrarNotificacao("Senhas não coincidem.", {
            cor: "#F44336",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
    }
};

// Adiciona eventos 'blur' nos campos de senha
document.getElementById('password').addEventListener('blur', validatePasswordsMatch);
document.getElementById('confirmPassword').addEventListener('blur', validatePasswordsMatch);
