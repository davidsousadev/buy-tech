const urlParams = new URLSearchParams(window.location.search);
const idCupom = urlParams.get("id");
const formCadastroCupons = document.getElementById('formCadastroCupons');


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenAdmin = getCookie('authTokenAdmin');
const tokenAdminRefresh = getCookie('authTokenAdminRefresh');

async function listarCupons(editar = false) {
    if (!tokenAdmin && !tokenAdminRefresh) return;

    displayLoader(true); // Exibir loader enquanto carrega

    try {
        const response = await fetch('https://api-buy-tech.onrender.com/cupons/admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin || tokenAdminRefresh}`
            },
        });

        const result = await response.json();
        const lista_de_cupons = document.getElementById("lista_de_cupons");
        lista_de_cupons.innerHTML = "";

        if (result && result.length > 0) {
            result.forEach((cupom) => {
                const li = document.createElement("li");
                li.classList.add("cupom-item");
                const valorFormatado = cupom.tipo
                    ? `R$ ${cupom.valor.toFixed(2)}`
                    : `${cupom.valor.toFixed(2)}%`;

                // Status do cupom (resgatado ou não)
                const status = cupom.resgatado ? "✅ Resgatado" : "❌ Não resgatado";

                // Estrutura do cupom na lista
                li.innerHTML = `
                    <strong>Code: ${cupom.nome}</strong> <br>
                    Valor: ${valorFormatado} <br>
                    Quantidade: ${cupom.quantidade_de_ultilizacao} usos <br>
                    Status: ${status} <br>
                    Criado em: ${new Date(cupom.criacao).toLocaleDateString()} 
                `;

                // Adicionar botão "Editar" apenas para cupons não resgatados
                if (editar && !cupom.resgatado) {
                    const btnEditar = document.createElement("button");
                    btnEditar.textContent = "Editar";
                    btnEditar.onclick = () => editarCupom(cupom.id);
                    li.appendChild(btnEditar);
                }

                lista_de_cupons.appendChild(li);
            });
        } else {
            lista_de_cupons.innerHTML = "<p>Nenhum cupom encontrado.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar cupons:", error);
    } finally {
        displayLoader(false); // Esconder loader após carregar
    }
}

function editarCupom(id) {
    window.location.href = `cadastrar_promocoes.html?id=${id}`;
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

if (formCadastroCupons) {
    (async function () {
        const nomeInput = document.getElementById("nome");
        const valorInput = document.getElementById("valor");
        const tipoInput = document.getElementById("tipo");
        const quantidadeInput = document.getElementById("quantidade");

        function validarFormulario() {
            const nomeValido = /^[a-zA-Z0-9-]{3,20}$/.test(nomeInput.value);
            const valorValido = parseFloat(valorInput.value) > 0;
            const tipoValido = tipoInput.value !== "";
            const quantidadeValida = parseInt(quantidadeInput.value) >= 1 && parseInt(quantidadeInput.value) <= 1000;
            console.log({
                "nome": nomeInput.value,
                "valor": valorInput.value,
                "tipo": tipoInput.value,
                "quantidade": quantidadeInput.value
            })
            return nomeValido && valorValido && tipoValido && quantidadeValida;
        }

        if (idCupom) {
            async function carregarCupom() {
                try {
                    const response = await fetch(`https://api-buy-tech.onrender.com/cupons/admin/${idCupom}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${tokenAdmin || tokenAdminRefresh}`
                        }
                    });

                    if (!response.ok) throw new Error("Erro ao carregar cupom.");

                    const cupom = await response.json();

                    nomeInput.value = cupom.nome;
                    valorInput.value = cupom.valor;
                    tipoInput.value = cupom.tipo.toString();
                    quantidadeInput.value = cupom.quantidade_de_ultilizacao;
                } catch (error) {
                    console.error("Erro ao carregar cupom:", error);
                    mostrarNotificacao("Erro ao carregar os dados do cupom.", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
            }
            await carregarCupom();
        }

        formCadastroCupons.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!validarFormulario()) {
                mostrarNotificacao('Preencha todos os campos corretamente.', {
                    cor: "#F44336",
                    duracao: 4000,
                    posicao: "bottom-right"
                });
                return;
            }

            displayLoader(true);
            disableSubmitButton(true);

            const cupomData = {
                nome: nomeInput.value,
                valor: parseFloat(valorInput.value),
                tipo: tipoInput.value === "true",
                quantidade_de_ultilizacao: parseInt(quantidadeInput.value),
            };

            try {
                const url = idCupom
                    ? `https://api-buy-tech.onrender.com/cupons/${idCupom}`
                    : "https://api-buy-tech.onrender.com/cupons";

                const method = idCupom ? "PATCH" : "POST";

                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenAdmin || tokenAdminRefresh}`
                    },
                    body: JSON.stringify(cupomData)
                });

                if (response.ok) {
                    console.log(response)
                    mostrarNotificacao(
                        idCupom ? "Cupom atualizado com sucesso!" : "Cadastro realizado com sucesso!",
                        { cor: "#4CAF50", duracao: 4000, posicao: "bottom-right" }
                    );
                    setTimeout(() => (window.location.href = "./index.html"), 5000);
                } else {
                    mostrarNotificacao(idCupom ? "Erro ao atualizar o cupom." : "Erro ao cadastrar o cupom!", {
                        cor: "#F44336",
                        duracao: 4000,
                        posicao: "bottom-right"
                    });
                }
            } catch (error) {
                console.error("Erro ao conectar ao servidor:", error);
                mostrarNotificacao("Erro ao conectar ao servidor.", {
                    cor: "#F44336",
                    duracao: 4000,
                    posicao: "bottom-right"
                });
            } finally {
                displayLoader(false);
                disableSubmitButton(false);
            }
        });

        nomeInput.addEventListener("input", validarFormulario);
        valorInput.addEventListener("input", validarFormulario);
        tipoInput.addEventListener("change", validarFormulario);
        quantidadeInput.addEventListener("input", validarFormulario);
    })();
}
