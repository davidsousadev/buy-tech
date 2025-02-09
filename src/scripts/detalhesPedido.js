/* Não Concluido */
const opcoes_perfil = document.getElementById('opcoes_perfil');
const itens_carrinho = document.getElementById('itens_carrinho');
const verifica_cupom_de_desconto = document.getElementById('verifica_cupom_de_desconto');
const urlParams = new URLSearchParams(window.location.search);
const idCliente = urlParams.get("id");
const formCadastroPedido = document.getElementById('formCadastroPedido');

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// Autenticação antes de continuar
var token = getCookie('authTokenCliente');
async function authenticate() {
    try {
        const response = await fetch('https://api-buy-tech.onrender.com/clientes/autenticar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();
        if (response.ok) {
            return result;
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
    }
    return null;
}

async function calculoFrete() {
    const cliente = await authenticate();
    var cep = cliente.cep; // Obtém o CEP da autenticação

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
            let frete = 29; // Frete inicial

            if (!estadosLimite.includes(estado_para_calculo)) {
                frete += 10 * (Math.abs("MA".charCodeAt(0) - estado_para_calculo.charCodeAt(0)));
            }

            return frete;
        }

        // Atualiza o valor do frete
        document.getElementById('valorFrete').innerText = calcularFrete(estado_para_calculo);
    } catch (error) {
        console.error(error);
        // Se ocorrer erro, define o valor do frete como 39
        document.getElementById('valorFrete').innerText = 39;
    }
}

calculoFrete();


async function listaItensCarrinho() {
    var token = getCookie('authTokenCliente');
    if (token) {
        try {
            const response = await fetch('https://api-buy-tech.onrender.com/carrinhos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
            var valorTotalItens = 0;
            for (const produto of resultadoItensCarrinho) {
                try {
                    const produtoResponse = await fetch(`https://api-buy-tech.onrender.com/produtos/${produto.produto_codigo}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const produtoDetalhes = await produtoResponse.json();

                    const li = document.createElement("li");
                    var total_item = (produto.quantidade * produtoDetalhes.preco).toFixed(2);
                    valorTotalItens += parseFloat(total_item);

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
                                        <button class="btn-cart" onclick="atualizarQuantidade(${produto.produto_codigo})">Atualizar</button>
                                    </div>
                            </div>
                        </div>
                    `;

                    lista_itens.appendChild(li);
                } catch (error) {
                    console.error("Erro ao buscar detalhes do produto:", error);
                }
            }

            const total = document.createElement("li");
            total.innerHTML = `Total itens: R$: ${valorTotalItens.toFixed(2)}`;
            lista_itens.appendChild(total);

        } catch (error) {
            console.error("Erro ao carregar o carrinho:", error);
        }
    }
}

async function atualizarQuantidade(produtoCodigo) {
    var token = getCookie('authTokenCliente');
    const novaQuantidade = document.getElementById(`quantidade_${produtoCodigo}`).value;

    if (token && novaQuantidade) {
        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/carrinhos/${produtoCodigo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantidade: novaQuantidade,
                }),
            });

            const resultado = await response.json();
            if (resultado.detail === "Token expirado!") {

                window.location.href = './logar.html';
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
            // Atualizar a lista de itens após a alteração da quantidade
            listaItensCarrinho();

        } catch (error) {
            //console.error("Erro ao atualizar a quantidade:", error);
        }
    }
}


listaItensCarrinho();

function toggleDrawer() {
    var token = getCookie('authTokenCliente');
    if (token) {
        if (opcoes_perfil.style.display === 'block') {
            opcoes_perfil.style.display = 'none';
        } else {
            opcoes_perfil.style.display = 'block';
        }
    }
}

function logout(qtd) {
    // Remove o cookie "authToken"

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
};

function opcoes(qtd) {
    var token = getCookie('authTokenCliente');
    if (!token) {
        if (qtd === 0) {
            var voltar = '.';
            window.location.href = `${voltar}/index.html`; // Redireciona para a página de login
        }
        else {
            var voltar = '';
            for (var i = 0; i < qtd; i++) {
                voltar += '../';
            }
            window.location.href = `${voltar}index.html`; // Redireciona para a página de login       
        }
    }
    else {
        toggleDrawer();
    }
}

verifica_cupom_de_desconto.addEventListener('click', async () => {

    var token = getCookie('authTokenCliente');

    if (token) {
        var cupom_de_desconto = document.getElementById('cupom_de_desconto').value;

        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/cupons/verificar-cupom?cupom_nome=${cupom_de_desconto}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            }

            const resultado = await response.json();
            if (resultado) {
                console.log(resultado);
                mostrarNotificacao("O cupom é válido!", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });
            } else {
                mostrarNotificacao("O cupom não é válido!", {
                    cor: "#F44336",
                    duracao: 4000,
                    movimentoEntrada: "deslizar",
                    movimentoSaida: "esvair",
                    posicao: "bottom-right"
                });

            }
        } catch (error) {
            console.error('Erro:', error);

        }
    }
});

document.getElementById('formCadastroPedido').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário

    const idAutenticado = await authenticate(); // Aguarda a autenticação
    const idClienteNumero = Number(idCliente);

    // Verifica se o usuário está autenticado corretamente
    if (idAutenticado.id !== idClienteNumero) {
        mostrarNotificacao("Erro de autenticação.", {
            cor: "#F44336",
            duracao: 4000,
            posicao: "bottom-right"
        });
        return;
    }

    // Criação do objeto formData após a autenticação
    let formData = {
        cliente: idAutenticado.id, // Tipo inteiro
        cupom_de_desconto: document.getElementById('cupom_de_desconto').value, // String
        opcao_de_pagamento: document.getElementById('opcao_de_pagamento').checked ? "true" : "false" // Checkbox -> Booleano convertido para string
    };

    console.table(formData); // Verifica os valores

    // Validação de campos obrigatórios
    if (!formData.cliente || formData.opcao_de_pagamento === "") {
        mostrarNotificacao("Todos os campos devem ser preenchidos.", {
            cor: "#F44336",
            duracao: 4000,
            posicao: "bottom-right"
        });
        return;
    }

    // Envio do pedido para a API
    try {
        const response = await fetch('https://api-buy-tech.onrender.com/pedidos', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        console.log('Resposta da API:', result);

        if (response.ok) {
            mostrarNotificacao("Pedido realizado com sucesso!", {
                cor: "#4CAF50",
                duracao: 4000,
                posicao: "bottom-right"
            });
            window.location.href = './index.html';
        } else {
            mostrarNotificacao('Erro ao realizar o pedido.', {
                cor: "#F44336",
                duracao: 4000,
                posicao: "bottom-right"
            });
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        mostrarNotificacao("Erro ao enviar os dados. Tente novamente.", {
            cor: "#F44336",
            duracao: 4000,
            posicao: "bottom-right"
        });
    }
});

