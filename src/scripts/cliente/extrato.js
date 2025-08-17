// extrato.js

import * as config from '../consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');

const extratoCliente = document.getElementById("extratoCliente");

async function extrato() {
    if (tokenCliente || tokenClienteRefresh) {
        displayLoader(true);
        disableSubmitButton(true);
        try {
            const response = await fetch(`${config.API_URL}/operacoes/extrato`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar extrato: ${response.status}`);
            }

            const result = await response.json();

            // ======== 1️⃣ Preparar dados para gráfico de linha ========
            const agrupadoPorDataTipoMotivo = {};
            result.forEach(item => {
                const tipoTexto = item.tipo === 1 ? 'credito' : 'debito';
                const motivoTexto = (() => {
                    switch (item.motivo) {
                        case 1: return 'referencia';
                        case 2: return 'cashback';
                        case 3: return 'pagamento';
                        default: return 'desconhecido';
                    }
                })();
                const key = `${tipoTexto}-${motivoTexto}`;
                const data = item.criacao_da_operacao;

                if (!agrupadoPorDataTipoMotivo[key]) agrupadoPorDataTipoMotivo[key] = {};
                if (!agrupadoPorDataTipoMotivo[key][data]) agrupadoPorDataTipoMotivo[key][data] = 0;

                agrupadoPorDataTipoMotivo[key][data] += item.valor;
            });

            const datas = [...new Set(result.map(r => r.criacao_da_operacao))].sort();

            const cores = {
                "credito-pagamento": "rgb(75, 192, 192)",
                "debito-cashback": "rgb(255, 99, 132)",
                "credito-cashback": "rgb(54, 162, 235)",
                "debito-pagamento": "rgb(255, 205, 86)",
                "credito-referencia": "rgb(153, 102, 255)",
                "debito-referencia": "rgb(255, 159, 64)",
                "debito-desconhecido": "#999",
                "credito-desconhecido": "#666"
            };

            const datasets = Object.keys(agrupadoPorDataTipoMotivo).map(key => ({
                label: key,
                data: datas.map(data => agrupadoPorDataTipoMotivo[key][data] || 0),
                fill: false,
                borderColor: cores[key] || "#000",
                backgroundColor: cores[key] || "#000",
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 7
            }));

            const ctxLinha = document.getElementById('graficoLinha').getContext('2d');
            new Chart(ctxLinha, {
                type: 'line',
                data: { labels: datas, datasets: datasets },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Operações por Data e Tipo/Motivo' },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `R$ ${context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Valor Total' },
                            ticks: {
                                callback: function (value) {
                                    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                            }
                        },
                        x: { title: { display: true, text: 'Data' } }
                    }
                }
            });

            // ======== 2️⃣ Gráfico de pizza ========
            const totalPorTipoMotivo = {};
            result.forEach(item => {
                const tipoTexto = item.tipo === 1 ? 'credito' : 'debito';
                const motivoTexto = (() => {
                    switch (item.motivo) {
                        case 1: return 'referencia';
                        case 2: return 'cashback';
                        case 3: return 'pagamento';
                        default: return 'desconhecido';
                    }
                })();
                const key = `${tipoTexto}-${motivoTexto}`;
                if (!totalPorTipoMotivo[key]) totalPorTipoMotivo[key] = 0;
                totalPorTipoMotivo[key] += item.valor;
            });

            const ctxPizza = document.getElementById('graficoPizza').getContext('2d');
            new Chart(ctxPizza, {
                type: 'pie',
                data: {
                    labels: Object.keys(totalPorTipoMotivo),
                    datasets: [{
                        data: Object.values(totalPorTipoMotivo),
                        backgroundColor: Object.keys(totalPorTipoMotivo).map(k => cores[k] || "#ccc"),
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Distribuição Total por Tipo/Motivo' },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const valor = context.raw;
                                    return `${context.label}: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                            }
                        }
                    }
                }
            });

            // ======== 3️⃣ Montar tabela ========
            extratoCliente.innerHTML = "";
            let tabelaHTML = `
                <table class="operacao-tabela">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Valor</th>
                            <th>Motivo</th>
                            <th>Tipo</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            if (result && result.length > 0) {
                result.forEach((operacao) => {
                    tabelaHTML += `
                        <tr class="${operacao.tipo === 1 ? 'credito' : 'debito'}">
                            <td>#${operacao.id}</td>
                            <td>R$ ${operacao.valor.toFixed(2)}</td>
                            <td>${motivoTexto(operacao.motivo)}</td>
                            <td>${operacao.tipo === 1 ? 'Crédito' : 'Débito'}</td>
                            <td>${operacao.criacao_da_operacao}</td>
                        </tr>
                    `;
                });

                tabelaHTML += `</tbody></table>`;
                extratoCliente.innerHTML += tabelaHTML;
            } else {
                extratoCliente.innerHTML = "<p>Nenhuma operação encontrada.</p>";
            }

            displayLoader(false);
            disableSubmitButton(false);
        } catch (error) {
            console.error(error);
            setTimeout(() => { extrato(); }, 1000);
        }
    }
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

// Loader
const displayLoader = (isLoading) => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = isLoading ? 'flex' : 'none';
};

// Botão submit
const disableSubmitButton = (isDisabled) => {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) submitButton.disabled = isDisabled;
};

// Executa ao carregar
extrato();
