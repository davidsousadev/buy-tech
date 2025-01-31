 // Função para obter o valor do cookie "authToken"
 const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const token = getCookie('authToken');

if (token) {
    window.location.href = './index.html'; 
}