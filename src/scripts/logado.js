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
    console.table(tokenData); 
    const avatar = document.getElementById('avatar');
    avatar.classList.remove('bx-user');
    avatar.classList.add('bxs-user-circle');
    console.log(token)
    try {
        const response = await fetch('https://api-buy-tech.onrender.com/clientes/autenticar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    
        if (!response.ok) {
            throw new Error(`Erro ao autenticar: ${response.statusText}`);
        }
        else{
            document.cookie = 'authToken=; Max-Age=0; path=/;';
            window.location.href = './index.html'; 
        }
        const result = await response.json();
        console.table(result);
        
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
    }
    
    
}