//detalhesPedido.js

import * as config from '../consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');
var descontoAplicado = false;
var freteCalculado = false;
var precoFrete = 0;
var totalCarrinho = 0;

const opcoes_perfil = document.getElementById('opcoes_perfil');
const lista_itens = document.getElementById('lista_itens');
const verifica_cupom_de_desconto = document.getElementById('verifica_cupom_de_desconto');

const formCadastroPedido = document.getElementById('formCadastroPedido');
const totalPedido = document.getElementById('totalPedido');
const valor_cupom_desconto = document.getElementById('valor_cupom_desconto');
const campoCEP = document.getElementById('campoCEP');

document.getElementById('btnLogin').addEventListener('click', opcoes);

export async function authenticate() {
    try {
        const response = await fetch(`${config.API_URL}/clientes/autenticar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
            },
        });

        const result = await response.json();


        if (response.ok && result && result.cep) {
            const cepFormatado = typeof result.cep === 'string'
                ? result.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2")
                : String(result.cep).replace(/^(\d{5})(\d{3})$/, "$1-$2");

            campoCEP.innerHTML = cepFormatado;
            return result;
        } else {
            setTimeout(() => {
                authenticate();
            }, 100);
        }
    } catch (error) {
        setTimeout(() => {
            authenticate();
        }, 100);
    }
    return null;
}

export function opcoes(qtd) {
    if (!tokenCliente || !tokenClienteRefresh) {
        if (qtd === 0) {
            var voltar = '.';
            window.location.href = `${voltar}/logar.html`; // Redireciona para a página de login
        }
        else {
            var voltar = '';
            for (var i = 0; i < qtd; i++) {
                voltar += '../';
            }
            window.location.href = `${voltar}logar.html`; // Redireciona para a página de login       
        }
    }
    else {
        toggleDrawer();
    }
}
export function toggleDrawer() {

    if (tokenCliente || tokenClienteRefresh) {
        if (opcoes_perfil.style.display === 'block') {
            opcoes_perfil.style.display = 'none';
        } else {
            opcoes_perfil.style.display = 'block';
        }
    }
}

formCadastroPedido.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário
    const idAutenticado = await authenticate(); // Aguarda a autenticação

    if (precoFrete === 0) {
        mostrarNotificacao("Calcule o frete.", {
            cor: "#F44336",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
        return;
    }
    // Criação do objeto formData após a autenticação
    let formData = {
        cliente: idAutenticado.id, // Tipo inteiro
        frete: precoFrete,
        cupom_de_desconto: document.getElementById('cupom_de_desconto').value, // String
        opcao_de_pagamento: document.getElementById('opcao_de_pagamento').value // Boolean 
    };



    // Validação de campos obrigatórios
    if (!formData.cliente || formData.opcao_de_pagamento === "") {
        mostrarNotificacao("Todos os campos devem ser preenchidos.", {
            cor: "#F44336",
            duracao: 4000,
            posicao: "bottom-right"
        });
        return;
    }
    // Exibe o loader e desabilita o botão
    displayLoader(true);
    disableSubmitButton(true);
    // Envio do pedido para a API
    try {
        const response = await fetch(`${config.API_URL}/pedidos`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`
            }
        });

        const result = await response.json();
        // Esconde o loader e habilita o botão novamente
        displayLoader(false);
        disableSubmitButton(false);
        if (response.ok) {
            mostrarNotificacao("Pedido realizado com sucesso!", {
                cor: "#4CAF50",
                duracao: 4000,
                posicao: "bottom-right"
            });
            window.location.href = './pedidos.html';
        } else {
            mostrarNotificacao(`${result.detail}`, {
                cor: "#F44336",
                duracao: 4000,
                posicao: "bottom-right"
            });
        }
    } catch (error) {
        displayLoader(false);
        disableSubmitButton(false);
        setTimeout(() => {
            location.reload();
        }, 100);
    }
});

verifica_cupom_de_desconto.addEventListener('click', async () => {
    if (descontoAplicado) return;
    if (tokenCliente || tokenClienteRefresh) {
        var cupom_de_desconto = document.getElementById('cupom_de_desconto').value;

        try {
            const response = await fetch(`${config.API_URL}/cupons/verificar-cupom?cupom_nome=${cupom_de_desconto}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                mostrarNotificacao("Erro ao buscar Cupom", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                return;
            }

            const resultado = await response.json();

            if (resultado.cupom) {
                let desconto = resultado.cupom["valor"];
                let tipoCupom = resultado.cupom["tipo"];

                if (valor_cupom_desconto) {
                    valor_cupom_desconto.innerHTML = `R$ ${desconto.toFixed(2)}`;



                    if (tipoCupom) {
                        // Valor fixo
                        totalCarrinho -= desconto;
                        valor_cupom_desconto.innerHTML = `R$ ${desconto.toFixed(2)}`;
                    } else {
                        // Porcentagem
                        totalCarrinho -= totalCarrinho * (desconto / 100);
                        valor_cupom_desconto.innerHTML = `${desconto.toFixed(2)} %`;
                    }
                }
                // Evita valores negativos
                totalCarrinho = Math.max(totalCarrinho, 0);

                descontoAplicado = true;
                atualizaTotalPedido();

                mostrarNotificacao("O cupom é válido!", {
                    cor: "#4CAF50",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
            else {
                valor_cupom_desconto.innerHTML = `R$ 00.00`;
                mostrarNotificacao("O cupom não é válido!", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            }
        } catch (error) {
            setTimeout(() => {
                location.reload();
            }, 100);
        }
    }
});

verifica_frete.addEventListener('click', async () => {
    if (freteCalculado) return;
    const cliente = await authenticate();
    var cep = cliente.cep;
    var clubeFidelidade = cliente.clube_fidelidade;
    if (clubeFidelidade === false) {
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

        try {
            const data = await fetchCepData(cep);
            const estado_para_calculo = data.uf || data.state || '';

            function calcularFrete(estado_para_calculo) {
                const estadosLimite = ["MA", "PI", "PA", "TO", "CE", "BA"];
                frete = 29; // Frete inicial

                if (!estadosLimite.includes(estado_para_calculo)) {
                    frete += 10 * (Math.abs("MA".charCodeAt(0) - estado_para_calculo.charCodeAt(0)));
                }

                totalCarrinho += frete;
                precoFrete = frete;
                freteCalculado = true;
                atualizaTotalPedido();
                mostrarNotificacao("Frete calculado com sucesso!", {
                    cor: "#4CAF50",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
                return frete.toFixed(2);
            }

            // Atualiza o valor do frete
            document.getElementById('valorFrete').innerText = calcularFrete(estado_para_calculo);
        } catch (error) {
            mostrarNotificacao("Frete padrão calculado CEP invalido", {
                cor: "#4CAF50",
                duracao: 4000,
                movimentoEntrada: "deslizar",
                movimentoSaida: "esvair",
                posicao: "bottom-right"
            });
            
            freteCalculado = true;
            totalCarrinho += 39.00;
            precoFrete = 39.00;
            document.getElementById('valorFrete').innerText = 39.00;
        }
    }
    else {
        freteCalculado = true;
        document.getElementById('valorFrete').innerText = 0.00;
        precoFrete = 0;
        atualizaTotalPedido();
        mostrarNotificacao("Cliente clube fidelidade paga zero de frete!", {
            cor: "#4CAF50",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
        return frete.toFixed(2);

    }
});

export async function listaItensCarrinho() {

    if (tokenCliente || tokenClienteRefresh) {
        try {
            const response = await fetch(`${config.API_URL}/carrinhos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
            });

            const resultadoItensCarrinho = await response.json();

            if (resultadoItensCarrinho.detail) {
                if (resultadoItensCarrinho.detail === "Token expirado!") {
                    window.location.href = './logar.html';
                }
                if (resultadoItensCarrinho.detail === "Carrinho vazio!") {
                    finalizar_pedido.style.display = "none";
                    lista_itens.innerHTML = `<p class="carrinho-vazio-texto">Seu carrinho está vazio.</p>`;
                }
                return;
            }

            lista_itens.innerHTML = "";

            var quantidadeDeProdutos = 0;
            for (const produto of resultadoItensCarrinho) {
                if (produto.codigo.length != 6) {
                    try {
                        const produtoResponse = await fetch(`${config.API_URL}/produtos/${produto.produto_codigo}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const produtoDetalhes = await produtoResponse.json();

                        const li = document.createElement("li");
                        var total_item = (produto.quantidade * produtoDetalhes.preco).toFixed(2);
                        totalCarrinho += parseFloat(total_item);

                        li.innerHTML = `
                        <div class="card-carrinho">
                            <img src="${produtoDetalhes.foto}" alt="${produtoDetalhes.nome}" class="card-carrinho-img">
                            <div class="card-body">
                                <h3 class="card-carrinho-title">${produtoDetalhes.nome}</h3>
                                <p class="card-carrinho-brand">Marca: ${produtoDetalhes.marca}</p>
                                <p class="card-carrinho-price">R$ ${produtoDetalhes.preco.toFixed(2)}</p>
                                <div class="card-carrinho-quantity">
                                    <strong>Quantidade: <input type="number" id="quantidade_${produto.produto_codigo}" value="${produto.quantidade}" min="0"></strong>
                                    
                                    <span>Total: R$ ${total_item}</span>
                                </div>
                                    <div id="btn-cart">
                                        <button class="btn-cart" onclick="verDetalhes(${produtoDetalhes.id})">Ver Detalhes</button>
                                        <button class="btn-cart" onclick="atualizarQuantidade(${produto.produto_codigo}, ${produto.id}, ${produto.cliente_id})">Atualizar</button>
                                    </div>
                            </div>
                        </div>
                    `;
                        quantidadeDeProdutos += 1;
                        lista_itens.appendChild(li);
                    } catch (error) {
                        setTimeout(() => {
                            listaItensCarrinho();
                        }, 1000);
                    }
                }
            }

            const total = document.createElement("li");
            total.innerHTML = `Total itens: R$: ${totalCarrinho.toFixed(2)}`;
            lista_itens.appendChild(total);
            if (quantidadeDeProdutos === 0) {
                lista_itens.innerHTML = `<p class="carrinho-vazio-texto">Seu carrinho está vazio.</p>`;
            }
            atualizaTotalPedido();

        } catch (error) {
            setTimeout(() => {
                listaItensCarrinho();
            }, 1000);
        }
    }
}

export async function atualizarQuantidade(produtoCodigo, codigoCarrinho, idCliente) {

    const novaQuantidade = document.getElementById(`quantidade_${produtoCodigo}`).value;
    if ((tokenCliente || tokenClienteRefresh) && novaQuantidade) {
        try {
            const response = await fetch(`${config.API_URL}/carrinhos/${codigoCarrinho}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenCliente || tokenClienteRefresh}`,
                },
                body: JSON.stringify({
                    id: codigoCarrinho,
                    produto_codigo: produtoCodigo,
                    cliente_id: idCliente,
                    quantidade: novaQuantidade,
                }),
            });

            const resultado = await response.json();
            if (resultado) {
                if (resultado.message) {
                    mostrarNotificacao("Produto Atualizado com sucesso!", {
                        cor: "#4CAF50",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                }
                if (resultado.detail === "Item removido do carrinho!") {
                    mostrarNotificacao(`${resultado.detail}`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 5000);
                }
                if (resultado.detail === "Token expirado!") {
                    mostrarNotificacao(`Token expirado!`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                    setTimeout(() => {
                        window.location.href = './logar.html';
                    }, 5000);
                }
                if (resultado.detail === "Pedido maior que estoque!") {
                    mostrarNotificacao(`Pedido maior que estoque!`, {
                        cor: "#F44336",
                        duracao: 4000,
                        movimentoEntrada: "deslizar",
                        movimentoSaida: "esvair",
                        posicao: "bottom-right"
                    });
                }
            }//

            // Atualizar a lista de itens após a alteração da quantidade
            listaItensCarrinho();

        } catch (error) {
            setTimeout(() => {
                atualizarQuantidade(produtoCodigo, codigoCarrinho, idCliente);
            }, 1000);
        }
    }
}

export function atualizaTotalPedido() {
    totalPedido.innerHTML = `${totalCarrinho.toFixed(2)}`;
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

// Chama a funções ao iniciar
listaItensCarrinho();

window.listaItensCarrinho = listaItensCarrinho;
