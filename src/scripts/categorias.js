function listarProdutos() {
    const lista_categorias_cliente = document.getElementById("lista_categorias_cliente");

    async function listagem() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            let queryString = urlParams.toString(); // Obtém os parâmetros da URL

            const response = await fetch(`https://api-buy-tech.onrender.com/categorias?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const result = await response.json();

            lista_categorias_cliente.innerHTML = "";

            if (result && result.length > 0) {
                result.forEach((categoria) => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                            <div class="categoria-card">
                                <div class="categoria-info">
                                    
                                    <a href="index.html?categoria=${categoria.id}"><span class="categoria-nome">Nome: ${categoria.nome}</span></a>
                                    
                                </div>
                            </div>
                        `;

                        lista_categorias_cliente.appendChild(li);
                });
            } else {
                lista_categorias_cliente.innerHTML = '<p>Nenhum produto encontrado!</p>';
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
    // Remove o cookie "authTokenAdmin e authTokenAdminRefresh"
    document.cookie = 'authTokenAdmin=; Max-Age=0; path=/;';
    document.cookie = 'authTokenAdminRefresh=; Max-Age=0; path=/;';
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