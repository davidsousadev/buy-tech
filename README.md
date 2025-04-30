# Buy Tech - Seu Comércio de Eletrônicos
![Banner]([/src/imagens/banner.png](https://raw.githubusercontent.com/davidsousadev/buy-tech/refs/heads/main/src/imagens/banner.png))
## O que foi implementado no Sistema

- > Página inicial com a Listagem de produtos
- > Campo de busca Busca por termo de produto
- > Função Dark Mode e Light Mode via Local Storage
- > Menu de navegação para usuários não logados
- > Página de cadastro de Cliente, Revendedor e Administrador
- > Página de login de Cliente, Revendedor e Administrador
- > Página de recuperação de e-mail e senha
- > Página de detalhes do produto
- > Carrinho de cliente autenticado
- > Funcionalidade de adicionar itens ao carrinho
- > Funcionalidade de atualizar itens no carrinho
- > Autenticação via Cookies
- > Menu de opções para cliente autenticado
- > Página de lista de categorias
- > Página de "Monte seu equipamento" para clientes logados
- > Página de Promoções
- > Página de Suporte
- > Página de aviso para confirmação de e-mail
- > Página de e-mail confirmado
- > Painel Administrativo de Cliente:
- > - > Funcionalidades: Extrato, Créditos, Débitos, Pendências, Criar Pedido, Listar Pedidos, Link de Indicação, Atualizar Perfil
- > Painel Administrativo de Revendedor:
- > - > Funcionalidades: Extrato, Créditos, Débitos, Pendências, Listar Pedidos, Lista de Produtos, Criar Pedido, Atualizar Perfil
- > Painel Administrativo de Administrador: 
- > - > Funcionalidade: Gerenciar Perfis: Listar Perfis e Atualizar Status dos Perfis 
- > - > Funcionalidade: Gerenciar Categorias: Listar Categorias, Cadastrar Categorias e Atualizar Categorias
- > - > Funcionalidade: Gerenciar Produtos: Listar Produtos, Cadastrar Produtos e Atualizar Produtos
- > - > Funcionalidade: Gerenciar Pedidos: Listar Pedidos Pagos, Pedidos Cancelados e Cancelar Pedidos
- > - > Funcionalidade: Gerenciar Cupons: Listar Cupons, Cadastrar Cupons e Atualizar Cupons
- > - > Funcionalidade: Gerenciar Finanças: Gráfico das Finanças (Pizza) e Listar Créditos, Listar Débitos
- > - > Funcionalidade: Atualizar Perfil

## Estrutura inicial sujeita a alterações (Ajustar)

```plaintext
buy-tech/
├── admin/                                    # Diretório para gerenciamento administrativo da aplicação
│   │                                          
│   ├── admin/                                # Subdiretório principal de administração
│   │   |                                     
│   │   ├── cards/                            # Páginas relacionadas à administração de cartões
│   │   |   ├── atualizar_cards.html          # Página para atualizar informações dos cartões
│   │   |   ├── cadastrar_cards.html          # Página para cadastrar novos cartões
│   │   |   └── index.html                    # Página inicial da seção de cartões
│   │   |                                      
│   │   ├── financas/                         # Páginas relacionadas à administração de finanças
│   │   |   ├── atualizar_financas.html       # Página para atualizar dados financeiros
│   │   |   ├── cadastrar_financas.html       # Página para cadastrar novas informações financeiras
│   │   |   └── index.html                    # Página inicial da seção financeira
│   │   |                                     
│   │   ├── perfis/                           # Páginas para gerenciamento de perfis
│   │   |   ├── atualizar_status_perfis.html  # Página para atualizar status dos perfis
│   │   |   ├── cadastrar_perfis.html         # Página para cadastrar novos perfis
│   │   |   └── index.html                    # Página inicial da seção de perfis
│   │   |                                     
│   │   ├── promocoes/                        # Páginas para gerenciar promoções
│   │   |   ├── atualizar_promocoes.html      # Página para atualizar promoções existentes
│   │   |   ├── cadastrar_promocoes.html      # Página para cadastrar novas promoções
│   │   |   └── index.html                    # Página inicial da seção de promoções
│   │   |                                     
│   │   ├── categorias/                       # Páginas para gerenciar categorias de produtos
│   │   |   ├── atualizar_categorias.html     # Página para atualizar categorias
│   │   |   ├── cadastrar_categorias.html     # Página para cadastrar novas categorias
│   │   |   └── index.html                    # Página inicial da seção de categorias
│   │   |                                     
│   │   ├── gerenciar_cards.html              # Página para gerenciar cartões
│   │   ├── gerenciar_categorias.html         # Página para gerenciar categorias
│   │   ├── gerenciar_financas.html           # Página para gerenciar finanças
│   │   ├── gerenciar_pedidos.html            # Página para gerenciar pedidos
│   │   ├── gerenciar_perfis.html             # Página para gerenciar perfis
│   │   ├── gerenciar_produtos.html           # Página para gerenciar produtos
│   │   ├── gerenciar_cupons.html          # Página para gerenciar promoções
│   │   ├── index.html                        # Página inicial do painel administrativo
│   │   |                                     
│   │   ├── pedidos/                          # Páginas para gerenciar pedidos
│   │   |   ├── lista_pedidos_cancelados.html        # Página para atualizar pedidos
│   │   |   ├── cadastrar_pedidos.html        # Página para cadastrar novos pedidos
│   │   |   └── index.html                    # Página inicial da seção de pedidos
│   │   |                                     
│   │   └── produtos/                         # Páginas para gerenciar produtos
│   │       ├── atualizar_produtos.html       # Página para atualizar produtos
│   │       ├── cadastrar_produtos.html       # Página para cadastrar novos produtos
│   │       └── index.html                    # Página inicial da seção de produtos
│   │                                         
│   └── index.html                            # Página principal do módulo administrativo
|                                             
├── cliente/                                  # Diretório para páginas do cliente
|   |                                         
│   ├── atualizar-perfil.html                 # Página para atualizar o perfil do cliente
│   ├── index.html                  # Página para gerenciar conta do cliente
│   ├── index.html                            # Página inicial do cliente
│   ├── notificacoes.html                     # Página de notificações
│   ├── pedido.html                           # Página de um pedido específico
│   └── pedidos.html                          # Página para listar pedidos do cliente
|                                              
├── exemplos_documentacao/                    # Diretório para exemplos e documentação
|                                              
├── revendedor/                               # Diretório para páginas do revendedor
|   ├── cadastrar-pessoa-juridica.html        # Página para cadastrar revendedores (pessoa jurídica)
|   └── index.html                            # Página inicial do módulo revendedor
|                                              
├── src/                                      # Diretório com recursos da aplicação
|   |                                          
|   ├── imagens/                              # Diretório de imagens
|   |   └── loading.gif                       # Imagem de carregamento
|   |                                          
|   ├── scripts/                              # Diretório de scripts JavaScript
|   |   ├── admin/                            # Scripts para funcionalidades do painel admin
│   │   |   ├── adminCards.js                 # Script para gerenciamento de cartões
│   │   |   ├── adminCategorias.js            # Script para gerenciamento de categorias
│   │   |   ├── adminFinancas.js              # Script para gerenciamento financeiro
│   │   |   ├── adminPedidos.js               # Script para gerenciamento de pedidos
│   │   |   ├── adminPerfis.js                # Script para gerenciamento de perfis
│   │   |   ├── adminProdutos.js              # Script para gerenciamento de produtos
│   │   |   └── adminCupons.js                # Script para gerenciamento de Cupons
|   |   |                                      
│   │   ├── cadastro_cliente/                 # Scripts para validação de cadastro do cliente
│   │   |   ├── cep.js                        # Validação de CEP
│   │   |   ├── complemento.js                # Validação de complemento de endereço
│   │   |   ├── cpf.js                        # Validação de CPF
│   │   |   ├── email.js                      # Validação de email
│   │   |   ├── idade.js                      # Validação de idade
│   │   |   ├── nome.js                       # Validação de nome
│   │   |   ├── senha.js                      # Validação de senha
│   │   |   └── telefone.js                   # Validação de telefone
|   |   |                                      
│   │   ├── detalhesProduto.js                # Script para exibição de detalhes do produto
│   │   ├── form.js                           # Script para formulários
│   │   ├── index.js                          # Script principal
│   │   ├── logadoAdmin.js                    # Script para autenticação do admin
│   │   ├── logadoCliente.js                  # Script para autenticação do cliente
│   │   ├── loginAdmin.js                     # Script de login do admin
│   │   ├── login.js                   # Script de login do cliente
│   │   ├── main.js                           # Script principal da aplicação
│   │   ├── menu.js                           # Script do menu da aplicação
│   │   ├── no-logadoAdmin.js                 # Script para usuários não autenticados (admin)
│   │   └── no-logadoCliente.js               # Script para usuários não autenticados (cliente)
|   |                                          
|   └── styles/                               # Diretório de estilos CSS
│       ├── detalhes.css                      # Estilos para a página de detalhes
│       ├── index.css                         # Estilos gerais
│       ├── menu.css                          # Estilos do menu
│       └── style.css                         # Estilos principais
|                                             
├── teste/*                                    
├── testes/*                                  
├── cadastrar.html                            # Página de cadastro
├── confirmacao.html                          # Página de confirmação
├── favicon.ico                               # Ícone do site
├── index.html                                # Página inicial do site
├── LICENSE                                   # Licença do projeto
├── logar.html                                # Página de login
├── produto.html                              # Página do produto
└── README.md                                 # Documentação do projeto

``` 

* /* Não fazem parte do projeto
