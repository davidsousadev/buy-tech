const URL = "https://davidsousaplay.pythonanywhere.com/items";

async function listar(){
    request = await fetch(URL);
    dados = await request.json();
    
    
    for (x=0; x<dados.length; x++)
    lista.innerHTML += `
    <table>
    <tr>
    <td>
    ${dados[0].id}
    </td>
    </tr>
    <tr>
    <td>
    ${dados[0].item}
    </td>
    </tr>
    </table>
    `;
    lista = "";
}

var lista = document.getElementById("dados");
// https://www.youtube.com/watch?v=efr1xbwFlKU
// Função para adicionar um cliente
function adicionarCliente() {
    event.preventDefault()

    const nome = document.getElementById('nomePessoa').value;
    const pessoa = { nome };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pessoa)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').innerText = `Pessoa adicionada: ${JSON.stringify(data, null, 2)}`;
    })
    .catch(error => document.getElementById('response').innerText = `Erro: ${error}`);
}