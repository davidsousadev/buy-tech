export const nomeValido = () => {
    const nomeInput = document.getElementById('nome');
    nomeInput.addEventListener('blur', () => {
            const value = nomeInput.value.trim();
        if (value === '') {
            nomeInput.style.borderColor = '#ccc';
            return;
        }
            if (value.length < 8) {
                nomeInput.style.borderColor = 'red';
                mostrarNotificacao('Nome invalido!', {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            } else {
                nomeInput.style.borderColor = 'green';
            }
        });
    }