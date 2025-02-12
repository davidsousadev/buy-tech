const urlParams = new URLSearchParams(window.location.search);
const codigo = urlParams.get("codigo");
const confirmado = document.getElementById('confirmado');

if (codigo) {
    console.log(codigo)
        try {
            const response = await fetch(`https://api-buy-tech.onrender.com/emails/confirmado/?codigo=${codigo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();

            if (result.email===true) {
                confirmado.innerHTML = `E-mail Confirmado com sucesso!`;
            } else {
                console.log(result)
                confirmado.innerHTML = `Codigo invalido!`;
            }
        } catch (error) {
            console.error(error);
        }
}