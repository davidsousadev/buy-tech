function listarCategorias(){
    var token = getCookie('authTokenAdmin');
    if (token) {
        // Função assíncrona para fazer a requisição à API
        async function authenticate() {
            try {
                const response = await fetch('https://api-buy-tech.onrender.com/categorias', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const result = await response.json();
                if (result){
                    const listar_de_categorias = document.getElementById("listar_de_categorias");
                    console.table(result[0])
                    listar_de_categorias.innerHTML += result[0].nome;
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
    }

}