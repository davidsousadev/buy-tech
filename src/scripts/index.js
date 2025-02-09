function listarProdutos() {
    const lista_produtos = document.getElementById("lista_produtos");

    async function listagem() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            let queryString = urlParams.toString(); // Obtém os parâmetros da URL

            const response = await fetch(`https://api-buy-tech.onrender.com/produtos?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const result = await response.json();

            lista_produtos.innerHTML = "";

            if (result && result.length > 0) {
                result.forEach((produto) => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                            <div class="card">
                                <img src="${produto.foto}" alt="${produto.nome}" class="card-img">
                                <div class="card-body">
                                    <h3 class="card-title">${produto.nome}</h3>
                                    <p class="card-brand">Marca: ${produto.marca}</p>
                                    <p class="card-price">R$ ${produto.preco}</p>
                                    <button class="btnDetalhes" onclick="verDetalhes(${produto.id})">Ver Detalhes</button>
                                </div>
                            </div>
                        `;

                    lista_produtos.appendChild(li);
                });
            } else {
                lista_produtos.innerHTML = '<p>Nenhum produto encontrado!</p>';
            }
        } catch (error) {
            console.error(error);
        }
    }

    listagem();
}

function verDetalhes(id) {
    window.location.href = `produto.html?id=${id}`;
}

// Função de logoutAdmin 
function logoutAdmin(qtd) {
    // Remove o cookie "authTokenAdmin"
    document.cookie = 'authTokenAdmin=; Max-Age=0; path=/;';
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
};