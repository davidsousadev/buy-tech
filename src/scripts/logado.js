const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const decodeToken = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = atob(payloadBase64);
        return JSON.parse(payloadDecoded);
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
};

const token = getCookie('authToken');

if (token) {
    const tokenData = decodeToken(token);
    //console.table(tokenData); 
    const avatar = document.getElementById('avatar');
    avatar.classList.remove('bx-user');
    avatar.classList.add('bxs-user-circle');
}