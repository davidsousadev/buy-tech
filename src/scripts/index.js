function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

function toggleDrawer() {
    var token = getCookie('authToken');
    if (token) {
        const opcoes_perfil = document.getElementById('opcoes_perfil');
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

function verificaLogin(){
    var token = getCookie('authToken');
    if (!token) {
    window.location.href = 'logar.html';
    }
}
