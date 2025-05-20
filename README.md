# Buy Tech - Seu Comércio de Eletrônicos

![Banner](https://raw.githubusercontent.com/davidsousadev/buy-tech/refs/heads/main/src/imagens/banner.png)

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

## O que está sendo implementado no Sistema

- > Ajustar url dos cadastros
- > Minimização de erros com a api 
- > - > Em pedido de cliente logado
- > Ajuste de revendedor
- > Testes gerais

## O que vai ser implementado no Sistema

- > Disparo de e-mail em massa
- > Verificação de clientes online
- > Notificação de produtos novos e removidos do carrinho para remarketing
- > Implementação de painel de notificações
- > Integração com meus outros projetos
- > Ajuste no layout de detalhes de produtos

## Estrutura inicial sujeita a alterações (Ajustar*)

```plaintext
buy-tech/
├── admin/                                    # Diretório para gerenciamento administrativo da aplicação
│   │                                          
│   ├── admin/                                # Subdiretório principal de administração
│   │   |                                     
│   │   ├── categorias/                       # Páginas relacionadas à administração de categorias
│   │   |   |
│   │   |   ├── atualizar_categorias.html     # Página para atualizar informações dos categorias
│   │   |   ├── cadastrar_categorias.html     # Página para cadastrar novos categorias
│   │   |   └── index.html                    # Página inicial da seção de categorias
│   │   |                                     
│   │   ├── cupons/                           # Páginas relacionadas à administração de cupons
│   │   |   |
│   │   |   ├── atualizar_cupons.html         # Página para atualizar informações dos cupons
│   │   |   ├── cadastrar_cupons.html         # Página para cadastrar novos cupons
│   │   |   └── index.html                    # Página inicial da seção de cupons
│   │   |                                     
│   │   ├── financas/                         # Páginas relacionadas à administração de finanças
│   │   |   |
│   │   |   ├── debitos_financas.html         # Página para vizualizar debitos
│   │   |   └── index.html                    # Página inicial da seção financeira
│   │   |                                     
│   │   ├── pedidos/                          # Páginas para gerenciamento de pedidos
│   │   |   |
│   │   |   ├── cancelar_pedidos.html         # Página para cancelar pedidos
│   │   |   ├── index.html                    # Página inicial da seção de pedidos
│   │   |   └── lista_pedidos_cancelados.html # Página para listar pedidos cancelados
│   │   |                                     
│   │   ├── perfis/                           # Páginas para gerenciamento de perfis
│   │   |   |
│   │   |   ├── atualizar_status_perfis.html  # Página para atualizar status dos perfis
│   │   |   └── index.html                    # Página inicial da seção de perfis
│   │   |                                     
│   │   ├── produtos/                         # Páginas para gerenciar produtos
│   │   |   |
│   │   |   ├── atualizar_produtos.html       # Página para atualizar produtos existentes
│   │   |   ├── cadastrar_promocoes.html      # Página para cadastrar novas produtos
│   │   |   └── index.html                    # Página inicial da seção de produtos
│   │   |                                     
│   │   ├── gerenciar_categorias.html         # Página para gerenciar categorias
│   │   ├── gerenciar_cupons.html             # Página para gerenciar cupons
│   │   ├── gerenciar_financas.html           # Página para gerenciar finanças
│   │   ├── gerenciar_pedidos.html            # Página para gerenciar pedidos
│   │   ├── gerenciar_perfis.html             # Página para gerenciar perfis
│   │   ├── gerenciar_produtos.html           # Página para gerenciar produtos
│   │   └── index.html                        # Página inicial do painel administrativo 
│   │  
│   ├── atualizarCadastro.html                # Atualização de cadastro de administradores
│   ├── cadastrar.html                        # Cadastro de administradores
│   └── index.html                            # Página principal do módulo administrativo
|                                             
├── cliente/                                  # Diretório para páginas do cliente
|   |                                         
│   ├── atualizar-perfil.html                 # Página para atualizar o perfil do cliente
│   ├── creditos.html                         # Página para listar os creditos do cliente 
│   ├── debitos.html                          # Página para listar os debitos do cliente 
│   ├── extrato.html                          # Página para mostrar o extrato do cliente 
│   ├── index.html                            # Página inicial do cliente
│   ├── indicacoes.html                       # Página para mostrar o link de indicacao
│   ├── notificacoes.html                     # Página de notificações
│   ├── pedido.html                           # Página de um pedido específico
│   ├── pedidos.html                          # Página para listar pedidos do cliente
│   └── pendencias.html                       # Página para mostrar as pendências do cliente 
|
├── emails/                                   # Diretório para páginas de e-mail
|   |                                         
│   └── confirmado/                           # Páginas de confirmação de e-mail
|       |
│       └── index.html                        # Página inicial de confirmação
|                                              
├── exemplos_documentacao/*¹
|                                              
├── revendedor/*²
|                                              
├── src/                                      # Diretório com recursos da aplicação
|   |                                          
|   ├── imagens/                              # Diretório de imagens
|   |   ├── banner.png                        # Banner conceitual do projeto
|   |   ├── gabinete.webp                     # Imagem inlustrativa de gabinete
|   |   ├── loading.gif                       # Imagem de carregamento
|   |   └── pc-gamer.png                      # Imagem inlustrativa de PC Gamer
|   |                                          
|   ├── scripts/                              # Diretório de scripts JavaScript
│   │   |
|   |   ├── admin/                            # Scripts para funcionalidades do painel do admin
│   │   |   |
│   │   |   ├── adminCategorias.js            # Script para gerenciamento de categorias
│   │   |   ├── adminCupons.js                # Script para gerenciamento de cupons
│   │   |   ├── adminFinancas.js              # Script para gerenciamento financeiro
│   │   |   ├── adminPedidos.js               # Script para gerenciamento de pedidos
│   │   |   ├── adminPerfis.js                # Script para gerenciamento de perfis
│   │   |   ├── adminPerfisAtualizar.js       # Script para atualização de perfis
│   │   |   ├── adminProdutos.js              # Script para gerenciamento de produtos
│   │   |   └── atualizarCadastroAdmin.js     # Script para atualização de cadastro de admin
|   |   |                                      
│   │   ├── cadastro_cliente/                 # Scripts para validação de cadastro do cliente
│   │   |   |
│   │   |   ├── atualizarCadastroCliente.js   # Script de atualização de cadastro de cliente
│   │   |   ├── cep.js                        # Validação de CEP
│   │   |   ├── complemento.js                # Validação de complemento de endereço
│   │   |   ├── cpf.js                        # Validação de CPF
│   │   |   ├── email.js                      # Validação de email
│   │   |   ├── idade.js                      # Validação de idade
│   │   |   ├── nome.js                       # Validação de nome
│   │   |   ├── senha.js                      # Validação de senha
│   │   |   └── telefone.js                   # Validação de telefone
|   |   |                                      
│   │   ├── cliente/                          # Scripts funcionalidades do painel do cliente
│   │   |   |
│   │   |   ├── creditos.js                   # Script de gerenciar creditos de cliente
│   │   |   ├── debitos.js                    # Script de gerenciar debitos de cliente
│   │   |   ├── detalhesPedido.js             # Script de gerenciar detalhes de pedido de cliente
│   │   |   ├── extrato.js                    # Script de gerenciar extrato de cliente
│   │   |   ├── linkDeIndicacao.js            # Script de gerenciar link de indicacao de cliente
│   │   |   ├── pedidos.js                    # Script de gerenciar pedidos de cliente
│   │   |   └── pendencias.js                 # Script de gerenciar pendencias de cliente
|   |   |                                      
│   │   ├── revendedor/*²
|   |   |                                      
│   │   ├── authCliente.js                    # Script para autenticar o cliente
│   │   ├── cadastro_cliente.js               # Script para cadastro de novos clientes
│   │   ├── categorias.js                     # Script para exibir e gerenciar categorias de produtos
│   │   ├── confirmacao.js                    # Script para tela de confirmação de e-mail
│   │   ├── consts.js                         # Script contendo constantes globais do projeto
│   │   ├── detalhesProduto.js                # Script para exibir os detalhes de um produto selecionado
│   │   ├── emailConfimado.js                 # Script para exibir mensagem após confirmação de e-mail
│   │   ├── form.js                           # Script para controlar formulários
│   │   ├── index.js                          # Script principal da página inicial
│   │   ├── logadoAdmin.js                    # Script para lógica quando o admin está logado
│   │   ├── logadoCliente.js                  # Script para lógica quando o cliente está logado
│   │   ├── logadoRevendedor.js               # Script para lógica quando o revendedor está logado
│   │   ├── logadoUser.js                     # Script para lógica genérica quando qualquer usuário está logado
│   │   ├── loginAdmin.js                     # Script para tela e processo de login do administrador
│   │   ├── login.js                          # Script para tela e processo de login geral
│   │   ├── loginRevendedor.js                # Script para tela e processo de login do revendedor
│   │   ├── main.js                           # Script principal com lógica global
│   │   ├── menu.js                           # Script para exibição e controle do menu de navegação
│   │   ├── monte-seu-equipamento.js          # Script para ferramenta de montagem personalizada de equipamentos
│   │   ├── no-logadoAdmin.js                 # Script para lógica quando o admin não está logado
│   │   ├── no-logadoCliente.js               # Script para lógica quando o cliente não está logado
│   │   ├── no-logadoRevendedor.js            # Script para lógica quando o revendedor não está logado
│   │   ├── recuperar_senha_e_email.js        # Script para recuperação de senha e confirmação de e-mail
│   │   └── suporte.js                        # Script para interações com a seção de suporte
|   |                                          
|   └── styles/                               # Diretório de estilos CSS
│       |
│       ├── admin/                            # Estilos para painel administrativo
│       |   |
│       |   ├── gragicos.js                   # Estilo para grafico em pizza
│       |   └── lista-conteudo.js             # Estilo para lista de icones
|       |
│       ├── cliente/                          # Estilos para painel de clientes
|       |   |
│       |   └── extrato.js                    # Estilo para lista de extrato de operações
|       |
│       ├── categorias.css                    # Estilos para a página de categorias
│       ├── detalhes.css                      # Estilos para a página de detalhes
│       ├── index.css                         # Estilos gerais
│       ├── menu.css                          # Estilos do menu
│       ├── monte-seu-pc.css                  # Estilos para a página de montar seu PC
│       ├── pedido.css                        # Estilos para a página de pedido
│       ├── pedidos.css                       # Estilos para a página de pedidos
│       └── style.css                         # Estilos principais
|                                             
├── teste/*¹ 
|                                  
├── testes/*¹  
|                                
├── cadastrar.html                            # Página de cadastro
├── categorias.html                           # Página de listagem de categorias
├── confirmacao.html                          # Página de confirmação de cadastro
├── favicon.ico                               # Ícone do site
├── index.html                                # Página inicial do site
├── LICENSE                                   # Licença do projeto
├── logar.html                                # Página de login
├── monte-seu-equipamento.html                # Página de monte seu equipamento
├── produto.html                              # Página do produto
├── README.md                                 # Documentação do projeto
├── recuperar_senha_e_email.html              # Página para recuperação de e-mail e senha
└── suporte.html                              # Página de suporte

``` 

* /*¹ Não fazem parte do projeto
* /*² Ainda está sendo atualizado

















































