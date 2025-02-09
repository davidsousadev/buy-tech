# Buy Tech -  [! WARNING] (Arquivo para minha organização não copie e cole na documentação!)

### O que Falta implementar [! WARNING] (Ainda vou Fazer não fazer não copie e cole na documentação!)

- > Criar logins individuais falta revendedor
- > Criar cadastro de admin (implementar autenticação de admin master)
- > Criar paineis de controle de cliente e revendedor
- > Gerenciar Pedidos
- > Gerenciar Promoções
- > Gerenciar Cards
- > Gerenciar Finanças

### O que foi implementado [! WARNING] (O que fiz listei só para minha organização não copie e cole na documentação!)

- > Listagem de produtos
- > Busca por termo de produto
- > Pagina de detalhes de produto
- > Funcionalidade de Adicionar itens ao carrinho
- > Funcionalidade de Atualizar itens no carrinho
- > Menu de opções cliente autenticado
- > Carrinho de cliente autenticado
- > Implementação de atualização de itens no carrinho
- > Pagina de cadastro de cliente com diversas validações
- > Pagina de login de clientes
- > Pagina de aviso para confirmação de e-mail
- > Pagina de login do admin
- > Função Dark and Ligth Mode
- > Painel administrativo
- > Roteamento de painel administrativo
- > Autenticação de rotas
- > Implementação de funcionalidades:
- > Gerenciamento de perfis - Listagem e Atualização de status
- > Gerenciamento de categorias - Criação, listagem e Atualização
- > Gerenciamento de produtos - Criação, listagem e Atualização

### Estrutura inicial sujeita a alterações [! WARNING] (Não copie e cole na documentação!)

```plaintext
buy-tech/
├── admin/ 
│   │ 
│   ├── admin/ 
│   │   |                       
│   │   ├── cards/ 
│   │   |   |
│   │   |   ├── 
│   │   |   ├──
│   │   |   └── index.html
│   │   |  
│   │   ├── financas/
│   │   |   |
│   │   |   ├── atualizar_financas.html
│   │   |   ├── cadastrar_financas.html
│   │   |   └── index.html
│   │   |             
│   │   ├── gerenciar_categorias.html  
│   │   ├── gerenciar_pedidos.html  
│   │   ├── gerenciar_produtos.html   
│   │   ├── index.html  
│   │   | 
│   │   ├── perfis/
│   │   |   |
│   │   |   ├── atualizar_status_perfis.html
│   │   |   ├── cadastrar_perfis.html
│   │   |   └── index.html 
│   │   |    
│   │   ├── promocoes/
│   │   |   |
│   │   |   ├── atualizar_promocoes.html
│   │   |   ├── cadastrar_promocoes.html
│   │   |   └── index.html 
│   │   |
│   │   ├── categorias/
│   │   |   |
│   │   |   ├── atualizar_categorias.html
│   │   |   ├── cadastrar_categorias.html
│   │   |   └── index.html 
│   │   |  
│   │   ├── gerenciar_cards.html  
│   │   ├── gerenciar_financas.html    
│   │   ├── gerenciar_perfis.html   
│   │   ├── gerenciar_promocoes.html 
│   │   |  
│   │   ├── pedidos/
│   │   |   |
│   │   |   ├── atualizar_pedidos.html
│   │   |   ├── cadastrar_pedidos.html
│   │   |   └── index.html 
│   │   |       
│   │   └── produtos/
│   │       |
│   │       ├── atualizar_produtos.html
│   │       ├── cadastrar_produtos.html
│   │       └── index.html 
│   │   
│   └── index.html
|
├── cadastrar.html 
| 
├── cliente/
|   |
│   ├──atualizar-perfil.html  
│   ├──gerenciar-conta.html  
│   ├──index.html
│   ├──notificacoes.html  
│   ├──pedido.html  
│   └──pedidos.html
| 
├── confirmacao.html 
| 
├── exemplos_documentacao/*  
|
├── index.html  
├── LICENSE  
├── logar.html  
├── produto.html  
├── README.md 
| 
├── revendedor/ 
|   |
|   ├── cadastrar-pessoa-juridica.html
|   └── index.html
|
├── src/ 
|   |
|   ├── imagens/
|   |   |        
|   |   └──loading.gif
|   |
|   ├── scripts/
|   |   |
│   │   ├── admin/ 
|   |   |   |
│   │   |   ├──adminCards.js  
│   │   |   ├──adminCategorias.js  
│   │   |   ├──adminFinancas.js  
│   │   |   ├──adminPedidos.js  
│   │   |   ├──adminPerfis.js  
│   │   |   ├──adminProdutos.js  
│   │   |   └──adminPromocoes.js
|   |   |
│   │   ├── cadastro_cliente/  
|   |   |   |
│   │   |   ├── cep.js  
│   │   |   ├── complemento.js  
│   │   |   ├── cpf.js  
│   │   |   ├── email.js  
│   │   |   ├── idade.js  n
│   │   |   ├── ome.js  
│   │   |   ├── senha.js  
│   │   |   ├── telefone.js
│   │   |   └── adminPromocoes.js
|   |   |
│   │   ├── detalhesProduto.js  
│   │   ├── form.js  
│   │   ├── index.js  
│   │   ├── logadoAdmin.js  
│   │   ├── logadoCliente.js  
│   │   ├── loginAdmin.js  
│   │   ├── loginCliente.js  
│   │   ├── main.js  
│   │   ├── menu.js  
│   │   ├── no-logadoAdmin.js  
│   │   └── no-logadoCliente.js
|   |
|   └── styles/
|       |
│       ├── detalhes.css  
│       ├── index.css  
│       ├── menu.css  
│       └── style.css
|
├── teste/*  
└── testes/*

```

* /* Não fazem parte do projeto