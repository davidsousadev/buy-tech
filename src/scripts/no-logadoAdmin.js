 // Função para obter o valor do cookie "authTokenAdmin"
 const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const token = getCookie('authTokenAdmin');

if (token) {
    window.location.href = 'painel_administrativo.html'; 
}