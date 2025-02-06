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

const token = getCookie('authTokenAdmin');

if (token) {
    const tokenData = decodeToken(token);
    //console.table(tokenData); 
    const exit = document.getElementById('exit');
    exit.classList.add('bx-exit');
    // Função assíncrona para fazer a requisição à API
    async function authenticate() {
        /*try {
            const response = await fetch('https://api-buy-tech.onrender.com//admins/autenticar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                document.cookie = 'authTokenAdmin=; Max-Age=0; path=/;';
                throw new Error(`Erro ao autenticar: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(result.id);
            
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }*/
    }

    // Chama a função de autenticação
    authenticate();
}
else{
    window.location.href = 'index.html'; 
}