// adminFinancas.js

import * as config from '../consts.js';

const extratoCliente = document.getElementById("lista_debitos");

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');
async function grafico() {
    if (tokenAdmin || tokenAdminRefresh) {
        let dadosGrafico = [];

        async function buscarDados() {
            displayLoader(true);
            try {
                const resposta = await fetch(`${config.API_URL}/operacoes/vendas/cashback/admin`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    },
                });

                
                const dados = await resposta.json();
                setTimeout(() => {
                    displayLoader(false);
                }, 1000);
                // Criar os dados do gráfico
                dadosGrafico = [
                    { label: "Créditos", valor: dados.total_creditos, cor: "#004aad" },
                    { label: "Débitos", valor: dados.total_debitos, cor: "#ff6384" }
                ];

                desenharGraficoPizza(dadosGrafico);
                gerarLegenda(dadosGrafico);
            } catch (error) {
                setTimeout(() => {
                    buscarDados();
                }, 1000);
            }
        }

        function desenharGraficoPizza(dados) {
            const canvas = document.getElementById("grafico");
            const ctx = canvas.getContext("2d");
            const centroX = canvas.width / 2;
            const centroY = canvas.height / 2;
            const raio = Math.min(centroX, centroY);
            const total = dados.reduce((acc, item) => acc + item.valor, 0);

            if (total === 0) {
                ctx.fillStyle = "#ccc";
                ctx.font = "16px Arial";
                ctx.fillText("Nenhum dado disponível", centroX - 70, centroY);
                return;
            }

            let anguloInicio = 0;
            const fatias = [];

            dados.forEach(item => {
                if (item.valor > 0) {
                    const anguloFim = anguloInicio + (item.valor / total) * (2 * Math.PI);

                    // Salvar os dados da fatia para clique
                    fatias.push({ inicio: anguloInicio, fim: anguloFim, dado: item });

                    // Desenhar fatia
                    ctx.beginPath();
                    ctx.moveTo(centroX, centroY);
                    ctx.arc(centroX, centroY, raio, anguloInicio, anguloFim);
                    ctx.closePath();
                    ctx.fillStyle = item.cor;
                    ctx.fill();

                    // Adicionar rótulo com valor formatado
                    const meioAngulo = (anguloInicio + anguloFim) / 2;
                    const labelX = centroX + Math.cos(meioAngulo) * (raio * 0.6);
                    const labelY = centroY + Math.sin(meioAngulo) * (raio * 0.6);
                    ctx.fillStyle = "#000";
                    ctx.font = "bold 14px Arial";
                    ctx.fillText(`R$ ${item.valor.toFixed(2)}`, labelX, labelY);

                    anguloInicio = anguloFim;
                }
            });

            canvas.addEventListener("click", function (event) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left - centroX;
                const y = event.clientY - rect.top - centroY;
                const anguloClicado = Math.atan2(y, x);
                const anguloNormalizado = anguloClicado < 0 ? anguloClicado + 2 * Math.PI : anguloClicado;

                const fatiaClicada = fatias.find(fatia =>
                    anguloNormalizado >= fatia.inicio && anguloNormalizado <= fatia.fim
                );

                if (fatiaClicada) {
                    if (fatiaClicada.dado.label === "Créditos") {
                        window.location.href = "../pedidos/index.html";
                    } else if (fatiaClicada.dado.label === "Débitos") {
                        window.location.href = "./debitos_financas.html";
                    }
                }
            });

        }

        function gerarLegenda(dados) {
            const legenda = document.getElementById("legenda");
            legenda.innerHTML = ""; // Limpa a legenda antes de adicionar os itens

            dados.forEach(item => {
                if (item.valor > 0) {
                    const div = document.createElement("div");
                    div.classList.add("legenda-item");

                    const cor = document.createElement("div");
                    cor.classList.add("cor");
                    cor.style.backgroundColor = item.cor;

                    const texto = document.createElement("span");
                    texto.textContent = item.label; // Apenas o nome na legenda

                    div.appendChild(cor);
                    div.appendChild(texto);
                    legenda.appendChild(div);
                }
            });
        }

        buscarDados();
    }
}

async function listarDebitos() {
    if (tokenAdmin || tokenAdminRefresh) {
        displayLoader(true);
        try {
            const resposta = await fetch(`${config.API_URL}/operacoes/cashback/admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
                },
            });// motivoTexto
            const result = await resposta.json();
            extratoCliente.innerHTML = ""; // Limpa antes de exibir
            if (result && result.length > 0) {
                result.forEach((operacao) => {
                    const li = document.createElement("li");
                    li.classList.add("operacao-card");
                    li.innerHTML = `
                        <div class="operacao-body">
                            <span class="operacao-title">Operação #${operacao.id}</span>
                            <p><strong>Valor:</strong> R$ ${operacao.valor.toFixed(2)}</p>
                            <p><strong>Motivo:</strong> ${motivoTexto(operacao.motivo)}</p>
                            <p><strong class="${operacao.tipo === 0 ? "credito" : "debito"}">Tipo:</strong> ${operacao.tipo === 1 ? "Crédito" : "Débito"}</p>
                            <p><strong>Data:</strong> ${operacao.criacao_da_operacao}</p>
                        </div>
                    `;
                    extratoCliente.appendChild(li);
                });
                displayLoader(false);
            } else {
                displayLoader(false);
                extratoCliente.innerHTML = "<p>Nenhuma operação encontrada.</p>";
            }
        } catch (error) {
            setTimeout(() => {
                listarDebitos();
            }, 1000);
        }
    }
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

if (extratoCliente) {
    listarDebitos();
}

// Função para traduzir os motivos
function motivoTexto(motivo) {
    switch (motivo) {
        case 1: return "Referência";
        case 2: return "Cashback";
        case 3: return "Pagamento";
        default: return "Desconhecido";
    }
}



window.grafico = grafico;
window.listarDebitos = listarDebitos;
window.motivoTexto = motivoTexto;
window.disableSubmitButton = disableSubmitButton;
window.displayLoader = displayLoader;