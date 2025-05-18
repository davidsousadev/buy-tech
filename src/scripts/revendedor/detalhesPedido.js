//detalhesPedidos.js

import * as config from '../consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenRevendedor= getCookie('authTokenRevendedor');
const tokenRevendedorRefresh = getCookie('authTokenRevendedorRefresh');


var descontoAplicado = false;
var freteCalculado = false;
var precoFrete = 0;

const opcoes_perfil = document.getElementById('opcoes_perfil');
const itens_carrinho = document.getElementById('itens_carrinho');
const verifica_cupom_de_desconto = document.getElementById('verifica_cupom_de_desconto');

const formCadastroPedido = document.getElementById('formCadastroPedido');
const totalPedido = document.getElementById('totalPedido');
const valor_cupom_desconto = document.getElementById('valor_cupom_desconto');
const campoCEP = document.getElementById('campoCEP');

async function authenticate() {
    try {
        const response = await fetch(`${config.API_URL}/revendedores/autenticar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`,
            },
        });

        const result = await response.json();

        if (response.ok && result) {

            return result;
        } 
    } catch (error) {
        
        setTimeout(() => {
            authenticate();
        }, 1000);
    }
    return null;
}

document.getElementById('formCadastroPedido').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário

    const idAutenticado = await authenticate(); // Aguarda a autenticação

    // Criação do objeto formData após a autenticação
    let formData = {
        revendedor_id: idAutenticado.id, // Tipo inteiro
        opcao_de_pagamento: document.getElementById('opcao_de_pagamento').value // Boolean 
    };

    

    // Validação de campos obrigatórios
    if (!formData.revendedor_id || formData.opcao_de_pagamento === "") {
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
        const response = await fetch(`${config.API_URL}/pedidos_revendedor`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`
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
            window.location.href = './pedidosRevendedor.html';
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
            
        mostrarNotificacao("Erro ao enviar os dados. Tente novamente.", {
            cor: "#F44336",
            duracao: 4000,
            posicao: "bottom-right"
        });
    }
});

async function listaItensCarrinho() {

    if (tokenRevendedor || tokenRevendedorRefresh) {
        try {
            const response = await fetch(`${config.API_URL}/carrinhos_revendedor`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`,
                },
            });

            const resultadoItensCarrinho = await response.json();
            if (resultadoItensCarrinho.detail) {
                if (resultadoItensCarrinho.detail === "Token expirado!") {
                    //window.location.href = './logar.html';
                }
                if (resultadoItensCarrinho.detail === "Carrinho vazio!") {
                    //finalizar_pedido.style.display = "none";
                    lista_itens.innerHTML = `<p class="carrinho-vazio-texto">Seu carrinho está vazio.</p>`;
                }
                return;
            }

            lista_itens.innerHTML = "";
            totalCarrinho = 0; // Reinicia o total do carrinho
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
                        }
                        , 1000);
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
            
        }
    }
}

async function atualizarQuantidade(produtoCodigo, codigoCarrinho, idCliente) {

    const novaQuantidade = document.getElementById(`quantidade_${produtoCodigo}`).value;
    if ((tokenRevendedor || tokenRevendedorRefresh) && novaQuantidade) {
        try {
            const response = await fetch(`${config.API_URL}/carrinhos_revendedor/${codigoCarrinho}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenRevendedor || tokenRevendedorRefresh}`,
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
                        window.location.href = 'index.html';
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
                
        }
    }
}

function atualizaTotalPedido() {
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

window.logoutCliente = logoutCliente;