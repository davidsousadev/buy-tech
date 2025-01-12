// Função de validação do CEP
export const isCepValid = (cep) => {
    return /^[0-9]{5}-[0-9]{3}$/.test(cep);
};

// Aplicar máscara de CEP dinamicamente
const applyCepMask = (input) => {
    input.value = input.value
        .replace(/\D/g, '') // Remove tudo que não for dígito
        .replace(/^(\d{5})(\d)/, '$1-$2') // Aplica a máscara no formato 00000-000
        .substring(0, 9); // Limita a quantidade de caracteres a 9
};

// Consulta de CEP com fallback dinâmico
const fetchCepData = async (cep) => {
    try {
        // Primeira tentativa: ViaCEP
        let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.ok) {
            const data = await response.json();
            if (!data.erro) return data;
        }

        // Segunda tentativa: BrasilAPI
        response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        if (response.ok) {
            return await response.json();
        }

        throw new Error('CEP não encontrado em nenhum serviço.');
    } catch (error) {
        throw new Error('Erro ao buscar o CEP.');
    }
};

// Função para lidar com a validação e consulta do CEP
export const handleCepValidation = () => {
    const btnCep = document.getElementById('btnCep');
    if (btnCep) {
        btnCep.addEventListener('click', async () => {
            const cepInput = document.getElementById('cep');
            const cep = cepInput.value.trim();

            // Validação do CEP
            if (!isCepValid(cep)) {
                cepInput.style.borderColor = 'red';
                mostrarNotificacao("CEP inválido. Deve estar no formato 00000-000.", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                return;
            }

            try {
                const data = await fetchCepData(cep);

                // Preenchimento dos campos de endereço
                document.getElementById('estado').value = data.uf || data.state || '';
                document.getElementById('cidade').value = data.localidade || data.city || '';
                document.getElementById('bairro').value = data.bairro || data.neighborhood || '';
                document.getElementById('rua').value = data.logradouro || data.street || '';

                cepInput.style.borderColor = 'green';
                mostrarNotificacao('Endereço encontrado!', {
                    cor: "#4CAF50",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            } catch (error) {
                cepInput.style.borderColor = 'red';
                mostrarNotificacao(error.message, {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
        });

        // Adiciona a máscara de CEP ao campo de input
        document.getElementById('cep').addEventListener('input', (e) => applyCepMask(e.target));
    }
};
