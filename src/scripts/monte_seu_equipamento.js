//monte_seu_equipamento.js

import * as config from './consts.js';


// Função para obter o cookie pelo nome
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



const formPC = document.getElementById('formPC');
const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenCliente');

function verificaLogin() {
    if (!tokenCliente && !tokenClienteRefresh) {
        // Exibe o loader e desabilita o botão
        displayLoader(true);
        disableSubmitButton(true);
        setTimeout(() => {
            mostrarNotificacao("Apenas Clientes logados podem fazer pedido!", {
                cor: "#F44336",
                duracao: 2000,
                posicao: "bottom-right"
            });
        }, 1000);
        setTimeout(() => {
            window.location.href = 'logar.html';
            }, 3000);
                return;
        }
}


    if (formPC) {

        formPC.addEventListener('submit', async (event) => {
            event.preventDefault();

            const gabinete = document.getElementById('gabinete').value;
            const placaMae = document.getElementById('placaMae').value;
            const processador = document.getElementById('processador').value;
            const ram = document.getElementById('ram').value;
            const ssd = document.getElementById('ssd').value;
            const fonte = document.getElementById('fonte').value;
            const observacoes = document.getElementById('observacoes').value;

            if (!gabinete || !placaMae || !processador || !ram || !ssd || !fonte) {
                mostrarNotificacao("Por favor, preencha todos os campos obrigatórios", {
                    cor: "#F44336",
                    duracao: 4000,
                    posicao: "bottom-right"
                });
                return;
            }

            try {
                const authResponse = await fetch(`${config.API_URL}/clientes/autenticar`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                    },
                });

                if (!authResponse.ok) {
                    throw new Error("Erro na autenticação");
                }

                const authResult = await authResponse.json();
                const userId = authResult.id;
                // Exibe o loader e desabilita o botão
                displayLoader(true);
                disableSubmitButton(true);

                const response = await fetch(`${config.API_URL}/emails/monteSeuEquipamento/${userId}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        gabinete: gabinete,
                        placaMae: placaMae,
                        processador: processador,
                        ram: ram,
                        ssd: ssd,
                        fonte: fonte,
                        observacoes: observacoes
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao enviar os dados de personalização.');
                }

                displayLoader(false);
                disableSubmitButton(false);
                mostrarNotificacao("Pedido enviado para produção!", {
                    cor: "#4CAF50",
                    duracao: 4000,
                    posicao: "bottom-right"
                });

                setTimeout(() => {
                    location.reload();
                }, 5000);

            } catch (error) {
                displayLoader(false);
                disableSubmitButton(false);
                setTimeout(() => {
                    //location.reload();
                }, 1000);
            }
        });
    }

    // Função para exibir/esconder o loader
    const displayLoader = (isLoading) => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = isLoading ? 'flex' : 'none';
        }
    };

    // Função para habilitar/desabilitar o botão de submit
    const disableSubmitButton = (isDisabled) => {
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            submitButton.disabled = isDisabled;
        }
    };

    verificaLogin();