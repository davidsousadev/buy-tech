const opcoes_perfil = document.getElementById('opcoes_perfil');
const itens_carrinho = document.getElementById('itens_carrinho');

function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};



function buyCart(){
    var token = getCookie('authToken');
    
    if (token) {
        if (opcoes_perfil.style.display==='block'){
            opcoes_perfil.style.display = 'none';
        }
        if (itens_carrinho.style.display==='block'){
            itens_carrinho.style.display = 'none';
        } 
        else{
            itens_carrinho.style.display = 'block';
        }     
        
            // Função assíncrona para fazer a requisição à API
        async function authenticate() {
            //console.log(token);
            try {
                const response = await fetch('https://api-buy-tech.onrender.com/carrinhos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (result.detail){
                    const lista_itens = document.getElementById("lista_itens");
                    const finalizar_pedido = document.getElementById("finalizar_pedido");
                    lista_itens.innerHTML = result.detail;
                    finalizar_pedido.style.display = 'none';
                }
                else{
                    // Listar itens do carrinho
                    finalizar_pedido.style.display = 'block';
                }
                
            } catch (error) {
                console.error(error);
            }
            
        }
        // Chama a função de autenticação
        authenticate();
        
             
    }

}

function toggleDrawer() {
    console.log(opcoes_perfil.style.display)
    var token = getCookie('authToken');
    if (token) {
        if (itens_carrinho.style.display==='block'){
            itens_carrinho.style.display = 'none';
        }
        if (opcoes_perfil.style.display==='block'){
            opcoes_perfil.style.display = 'none';
        }
        else{
            opcoes_perfil.style.display = 'block';
        }
    }
}
// Função de logout
function logout() {
    // Remove o cookie "authToken"
    document.cookie = 'authToken=; Max-Age=0; path=/;';
    window.location.href = './logar.html'; // Redireciona para a página de login
};

// Função de logoutAdmin
function logoutAdmin(qtd) {
    // Remove o cookie "authTokenAdmin"
    document.cookie = 'authTokenAdmin=; Max-Age=0; path=/;';
    if (qtd===0){
        var voltar = '.';
        window.location.href = `${voltar}/index.html`; // Redireciona para a página de login
    }
    else{
        var voltar = '';
        for (var i = 0; i < qtd; i++) {
            voltar += '../';  
        }  
        window.location.href = `${voltar}index.html`; // Redireciona para a página de login       
    }
};


function opcoes(){
    var token = getCookie('authToken');
    if (!token) {
    window.location.href = 'logar.html';
    }
    else{
        toggleDrawer();
    }
}

function pedido(){
    var token = getCookie('authToken');
    if (!token) {
        window.location.href = 'logar.html';
    }
    else{
        window.location.href = 'pedido.html';
    }
}

function listarProdutos() {
    const lista_produtos = document.getElementById("lista_produtos");

    /*lista_produtos.innerHTML = `
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
    `;*/

    async function listagem() {
        try {
            const response = await fetch('https://api-buy-tech.onrender.com/produtos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();

            // Remover skeletons
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
                                    <button class="btn">Ver Detalhes</button>
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
