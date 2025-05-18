// authCliente.js

import * as config from './consts.js';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const tokenCliente = getCookie('authTokenCliente');
const tokenClienteRefresh = getCookie('authTokenClienteRefresh');

if (!tokenCliente || !tokenClienteRefresh) {
    window.location.href = `${config.FRONT_URL}/logar.html`;
}