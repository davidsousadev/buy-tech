// Formatar telefone no formato (XX) XXXXX-XXXX
export function formatarTelefone(telefoneInput) {
    let telefone = telefoneInput.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (telefone.length > 0) {
        telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (telefone.length >= 6) {
        telefone = telefone.replace(/(\d{1})(\d{4})(\d{4})$/, '$1.$2-$3');
    }

    telefoneInput.value = telefone;
}

// Permitir apenas números no campo de telefone
export function somenteNumeros(telefoneInput) {
    telefoneInput.value = telefoneInput.value.replace(/\D/g, ''); 
}

// Validar telefone com 11 dígitos (formato: (XX) XXXXX-XXXX)
export function validarTelefone11(telefone) {
    const somenteNumeros = telefone.replace(/\D/g, '');
    return somenteNumeros.length === 11;
}

// Adicionar eventos de input e blur ao telefone
export function configurarEventosTelefone() {
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', () => {
        somenteNumeros(telefoneInput); // Remove os caracteres não numéricos
        formatarTelefone(telefoneInput); // Aplica a formatação do telefone
    });

    telefoneInput.addEventListener('blur', () => {
        formatarTelefone(telefoneInput); // Aplica a formatação final quando o campo perde o foco

        // Validação do telefone
        if (!validarTelefone11(telefoneInput.value)) {
            telefoneInput.style.borderColor = 'red';
            mostrarNotificacao("Telefone inválido.", {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        } else {
            telefoneInput.style.borderColor = 'green';
            mostrarNotificacao("Telefone válido!", {
                cor: "#4CAF50",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        }
    });
}
