// Função de validação assíncrona para campos de formulário
export const validateEmail = async () => {
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', async () => {
        const value = emailInput.value.trim();

        // Validação simples do formato do email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            emailInput.style.borderColor = 'red';
            mostrarNotificacao("E-mail inválido. O e-mail deve conter '@' e pelo menos um ponto.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            return;
        }

        if (value === '') {
            emailInput.style.borderColor = '#ccc';
            return;
        }

        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/clientes/verificar-email?${emailInput.name}=${value}`);
            if (response.ok) {
                emailInput.style.borderColor = 'green';
            } else {
                const result = await response.json();
                emailInput.style.borderColor = 'red';
                mostrarNotificacao(result.detail || "Valor inválido.", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
        } catch (error) {
            emailInput.style.borderColor = 'red';
            mostrarNotificacao('Erro na validação. Tente novamente.', {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        }
    });
};
