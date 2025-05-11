// linkDeIndicacao.js

import * as config from '../consts.js';

const linkDeIndicacaoTexto = document.getElementById('link_de_indicacao_texto');
const copiarLinkBtn = document.getElementById('copiar_link');
const notificacao = document.getElementById('notificacao');

// Função para copiar o código do link
function copiarCodigo() {
    const codigo = linkDeIndicacaoTexto.innerText;
    navigator.clipboard.writeText(codigo).then(() => {
        mostrarNotificacao("Link copiado com sucesso!", {
            cor: "#4CAF50",
            duracao: 4000,
            posicao: "bottom-right"
        });
    }).catch(err => {
        console.error("Erro ao copiar o código: ", err);
    });
}

// Verificando se o token existe
if (tokenCliente || tokenClienteRefresh) {
    async function authenticate() {
        try {
            // Fazendo a requisição para autenticar o cliente
            const response = await fetch(`${config.API_URL}/clientes/autenticar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                const clienteId = result.id;

                // Atualizando o texto do link de indicação
                const link = `${config.FRONT_URL}/cadastrar.html?ref=${clienteId}`;
                linkDeIndicacaoTexto.textContent = link;
            } else {
                console.error('Erro na autenticação');
            }
        } catch (error) {
            console.error('Erro ao autenticar:', error);
        }
    }

    // Chama a função de autenticação
    authenticate();
} 