export const validateComplement = () => {
    const complementoInput = document.getElementById('complemento');
    complementoInput.addEventListener('blur', () => {
        const value = complementoInput.value.trim();
        if (value === '') {
            complementoInput.style.borderColor = '#ccc';
            return;
        }
        if (value.length < 5) {
            complementoInput.style.borderColor = 'red';
            mostrarNotificacao('Complemento invalido! O complemento deve ter pelo menos 5 caracteres.', {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        } else {
            complementoInput.style.borderColor = 'green';
        }
    });
}