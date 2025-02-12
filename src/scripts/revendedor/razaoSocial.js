export const razaoValida = () => {
    const razaoSocial = document.getElementById('razaoSocial');
    razaoSocial.addEventListener('blur', () => {
        const value = razaoSocial.value.trim();
        if (value === '') {
            razaoSocial.style.borderColor = '#ccc';
            return;
        }
        if (value.length < 8) {
            razaoSocial.style.borderColor = 'red';
            mostrarNotificacao('Razão social invalida!', {
                cor: "#F44336",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
        } else {
            razaoSocial.style.borderColor = 'green';
        }
    });
}