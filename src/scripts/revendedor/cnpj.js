function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = 12;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = 13;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) {
        mostrarNotificacao("CNPJ inválido!", {
            cor: "#F44336",
            duracao: 4000,
            movimentoEntrada: "deslizar",
            movimentoSaida: "esvair",
            posicao: "bottom-right"
        });
    }

    return true;
}

// 🛠️ **Exemplo de uso**
console.log(validarCNPJ("11.222.333/0001-81")); // ✅ true
console.log(validarCNPJ("00.000.000/0000-00")); // ❌ false
console.log(validarCNPJ("12345678000195"));     // ✅ true
console.log(validarCNPJ("12345678000100"));     // ❌ false
