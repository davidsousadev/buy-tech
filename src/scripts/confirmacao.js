// confirmação.js

const btnLogin = document.getElementById('btnLogin');
const btnCart = document.getElementById('btnCart');
if (btnCart) {
    btnCart.style.display = 'none';
}

if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        window.location.href = `logar.html`;
    });
}