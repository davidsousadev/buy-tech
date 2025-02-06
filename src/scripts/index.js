function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

function buyCart(){
    const itens_carrinho = document.getElementById('itens_carrinho');
    var token = getCookie('authToken');
    if (token) {
        if (opcoes_perfil.style.display==='block'){
            opcoes_perfil.style.display = 'none';
        }
        if (itens_carrinho.style.display==='block'){
            itens_carrinho.style.display = 'none';
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
                    finalizar_pedido
                    lista_itens.innerHTML = result.detail;
                    finalizar_pedido.style.display = 'none';
                }
                else{
                    // Listar itens do carrinho
                }
                
            } catch (error) {
                console.error(error);
            }
            
        }
        // Chama a função de autenticação
        authenticate();
        itens_carrinho.style.display = 'block';      
    }

}

function toggleDrawer() {
    const opcoes_perfil = document.getElementById('opcoes_perfil');
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