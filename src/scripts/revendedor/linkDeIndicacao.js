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
            
        mostrarNotificacao("Erro ao copiar o link!", {
            cor: "#F44336",
            duracao: 4000,
            posicao: "bottom-right"
        });
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
                const result = await response.json();
                if (result.detail) {
                    mostrarNotificacao("Token inválido!", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                } else {
                    mostrarNotificacao("Erro ao autenticar!", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
            }
        } catch (error) {
            setTimeout(() => {
                authenticate();
            }
            , 1000);
        }
    }

    // Chama a função de autenticação
    authenticate();
} 