export const validateAge = () => {
    const birthDateInput = document.getElementById('dataNascimento').value;

    if (!birthDateInput) {
        document.getElementById('dataNascimento').style.borderColor = '#ccc';
        return;
    }

    const birthDate = new Date(birthDateInput);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear(); // Alterado para 'let'
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Ajusta a idade se o mês atual for antes do mês de nascimento
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age >= 18) {
        document.getElementById('dataNascimento').style.borderColor = 'green';
        mostrarNotificacao("Você tem mais de 18 anos!", {
            cor: "#4CAF50",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
    } else {
        document.getElementById('dataNascimento').style.borderColor = 'red';
        mostrarNotificacao("Você precisa ter mais de 18 anos.", {
            cor: "#F44336",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
    }
};

// Adiciona o evento 'blur' ao campo de data de nascimento
document.getElementById('dataNascimento').addEventListener('blur', validateAge);
