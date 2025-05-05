// atualizarCadastroRevendedor.js

import * as config from '../consts.js';

if (tokenRevendedor || tokenRevendedorRefresh) {
    // Função assíncrona para fazer a requisição à API
    async function authenticate() {
        try {
            const response = await fetch(`${config.API_URL}/revendedores/autenticar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                // Preenche os campos do formulário
                document.getElementById('razaoSocial').value = result.razao_social;
                document.getElementById('email').value = result.email;

                let cnpjNumerico = parseInt(result.cnpj, 10); // Converte para número
                let cnpjString = cnpjNumerico.toString().padStart(14, '0'); // Garante 14 dígitos
                document.getElementById('cnpj').value = cnpjString.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

                document.getElementById('inscricao_estadual').value = result.inscricao_estadual;
                document.getElementById('telefone').value = result.telefone;
            }

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
    }

    // Chama a função de autenticação
    authenticate();
}

