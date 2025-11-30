# 🖥️ Front-end do Projeto - BUY TECH - Seu Comércio de Eletrônicos

---

![Banner](https://raw.githubusercontent.com/davidsousadev/buy-tech/refs/heads/main/src/imagens/banner.png)

---

## Sumário

- 0 - [Descrição](#0----descrição)
- 1 - [Bibliotecas Utilizada](#1----bibliotecas-utilizadas)
- 2 - [O que foi implementado no Sistema](#2----o-que-foi-implementado-no-sistema)
- 3 - [O que está sendo implementado no Sistema](#3----o-que-está-sendo-implementado-no-sistema)
- 4 - [O que vai ser implementado no Sistema](#4----o-que-vai-ser-implementado-no-sistema)
- 5 - [Estrutura Inicial](#-5---estrutura-inicial)
- 6 - [Contribuições](#-6---contribuições)

---

## 0 - 📄 Descrição

Este projeto front-end foi construído com **HTML**, **CSS** e **JavaScript** para oferecer uma experiência completa de e-commerce. Alimentado pela [api-buy-tech](https://github.com/davidsousadev/api-buy-tech) e integração futura com [CUT ME](https://github.com/davidsousadev/cutme) e [Cash Bank.Me](https://github.com/davidsousadev/cashbankme).

---

## 1 - 📚 Bibliotecas Utilizadas

- [Notify](https://libsme.vercel.app/src/notify/v3/index.js)
- [Box Icons](https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css)
- [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) *Experimental

---

## 2 - ✅ O que foi implementado no Sistema

- 🏠 Página inicial com listagem de produtos  
- 🔍 Campo de busca por termo de produto  
- 🌙/☀️ Função Dark Mode & Light Mode (via Local Storage)  
- 🧭 Menu de navegação para usuários não logados  
- 📝 Página de cadastro de Cliente, Revendedor e Administrador  
- 🔐 Página de login de Cliente, Revendedor e Administrador  
- 🔄 Página de recuperação de e-mail e senha  
- 📋 Página de detalhes do produto  
- 🛒 Carrinho de cliente autenticado  
- ➕ Funcionalidade de adicionar itens ao carrinho  
- ✏️ Funcionalidade de atualizar itens no carrinho  
- 🔏 Autenticação via Cookies  
- ⚙️ Menu de opções para cliente autenticado  
- 🗂️ Página de lista de categorias  
- 🛠️ Página “Monte seu equipamento” para clientes logados  
- 🎉 Página de Promoções  
- 🛎️ Página de Suporte  
- 🚨 Página de aviso para confirmação de e-mail  
- ✅ Página de e-mail confirmado  
- 💻 Ajuste monte_seu_equipamento.html, não era possivel enviar por email

- Implementada responsividade para telas de até 720px
- Adicionados ícones para menu flutuante de clientes/revendedores
- Aumentada área clicável dos links no menu principal
- Barra de pesquisa ajustada para permitir acionamento com Enter
- Melhorias nos espaçamentos de listas e formulários
- Ajustes em textos de listagens vazias
- Correção de bug no banco: alterado tipo de cod_indicacao de int para string (local e remoto)
- Remoção de pastas de testes
- 🛡️ Minimização de erros com a API  
- Implementar responsividade para mobile de testes 980px wv / 1028px hv

**👤 Dashboard Administrativo de Cliente:**  
- 📊 Extrato  
- 💳 Créditos  
- 💸 Débitos  
- ⚠️ Pendências  
- 🛒 Criar Pedido  
- 📃 Listar Pedidos  
- 🔗 Link de Indicação  
- 🔄 Atualizar Perfil  

**🏬 Dashboard Administrativo de Revendedor:**  
- 📊 Extrato  
- 💳 Créditos  
- 💸 Débitos  
- ⚠️ Pendências  
- 📃 Listar Pedidos  
- 📦 Lista de Produtos  
- 🛒 Criar Pedido  
- 🔄 Atualizar Perfil  

**🛠️ Dashboard Administrativo de Administrador:**  
- 👥 Gerenciar Perfis: Listar perfis e atualizar status  
- 🏷️ Gerenciar Categorias: Listar, cadastrar e atualizar  
- 🛒 Gerenciar Produtos: Listar, cadastrar e atualizar  
- 📦 Gerenciar Pedidos: Listar pagos, cancelados e cancelar  
- 🎟️ Gerenciar Cupons: Listar, cadastrar e atualizar  
- 💰 Gerenciar Finanças: Gráfico de pizza, listar créditos e débitos  
- 👤 Atualizar Perfil  

---

# 3 - 🔄 O que está sendo implementado no Sistema

- 🔗 Ajustar URLs dos cadastros  
- 📦 Em pedidos de cliente logado  
- 🔧 Ajustes no fluxo de Revendedor  
- 🧪 Testes gerais  
- 🖌️ Melhorar o visual de produtos com desconto e demonstrar isso na finalização do pedido
- 🖌️ Melhotar o visual das listagens 
- 🖌️ Arredondamentos de alguns cantos
- Adição de alguns itens
- Ajustes gerais de layout com links do menu possivel adição de novos
- Adição de regras para indicações
- Ajustar distância do topo dos forms
- 🎨 Ajustes no layout do rodapé
- Apenas logados no monte seu equipamento

---

## 4 - 🚀 O que vai ser implementado no Sistema

- 🖌️ Tornar a plataforma mais agradevel ao mobile
- 🌘 Ajuste no icone do darkmode
- ✉️ Disparo de e-mail em massa  
- 🌐 Verificação de clientes online / Rastreabilidade  
- 🔔 Notificações de produtos novos e itens removidos do carrinho (remarketing)  
- 🛎️ Implementação de Dashboard de notificações  
- 🔗 Integração com outros projetos QR code at cutme.vercel.app
- 🎨 Ajustes no layout de detalhes de produtos 

- ℹ️ Melhorar os gráficos implementando Chart.js
- ⚠️ Remover ajustando com o backend todos os response.ok
- 🚩 Adicionar logica de banners

- ~~📦 Cálculo de frete integrado (Correios / transportadoras)~~
- 💳 Integração com gateways de pagamento (Pix, cartão, boleto)  (Simulado)
- 🧾 Emissão automática de nota fiscal via integração externa  (Simulado)
- 📧 Automação de e-mails transacionais (pedido criado, enviado, entregue, cancelado)  (Aumentar as atualizações)
- ⭐ Avaliações e comentários em produtos  
- 🗂️ Lista de desejos (wishlist)  
- 🔄 Histórico de produtos visualizados recentemente  
- 🤝 Programa de fidelidade (pontuação por compra e descontos)  (Avaliar as regras)
- 🛡️ Regras antifraude em pedidos  
- 📊 Dashboard de administrador com KPIs (vendas, clientes ativos, produtos mais vendidos)  (Aumentar os diagnosticos)
- 📲 Notificações push para usuários logados no mobile  (Ajustar e implementar o app mobile)

**Novas ideias**

- 📝 Criar página de FAQ / Perguntas Frequentes / Termos de Uso  
- 📬 Adicionar página de contato / créditos do desenvolvedor  
- 🔍 Ajustar detalhes da página de produto (melhorar apresentação e usabilidade)
  - ⭐ Sistema de avaliações por estrelas
  - 👁️ Visualizações - total e únicas
  - 💬 Comentários: permitir edição apenas uma vez; depois bloquear edição
  - 🔎 Lupa nas imagens para ver detalhes do produto
  - 🖼️ Grupo padrão de fotos: carrossel / galeria
  - 🛍️ Página de vendas personalizada para campanhas
  - 📝 Avaliação por texto e por imagens
- 🏷️ Banners personalizados para promoções com uso de cookies para evitar spam
- 🔖 Tags de produtos para melhor agrupamento e busca
- 💸 Desconto no Pix e integração com [Cash Bank.Me](https://github.com/davidsousadev/cashbankme) (token único)
- 📚 Atualizar a documentação e diagramas
- 🧭 Reestruturar os filtros da página inicial, criando filtros relacionados quando aplicável
- 🔗 Implementar estrutura de tags (metadados)
- 🎯 Página de vendas / pop-ups para lançamentos, controlados por cookies
- 🔗 Adicionar links de compartilhamento em redes sociais com mensagens personalizadas
- 🤖 Chatbot interativo
- 🚚 Avançado: criar projeto logístico para integrar status de pedidos/produtos
- 🛠️ Painel administrativo: aperfeiçoar fluxo de adição de produtos (mais fotos, vinculação a grupos)
- 🔁 Integrar corretamente paginação e interações com o [backend](https://github.com/davidsousadev/api-buy-tech)
- 🗂️ Notas de versão: definir política de versionamento (grupos de funcionalidades vs. correções isoladas), comunicar grandes atualizações e registrar versão ao atingir o MVP
- 📄 Adicionar paginação na área administrativa
- 🔍 Listar produtos mais buscados
- 🔗 Exibir produtos relacionados
- 🛣️ Criar rota alternativa na API
- 🎨 Adicionar filtros visuais com ícones, incluindo opção de filtro retrátil e visual mais limpo
- 💾 Usar LocalStorage para manter preferências e estados de filtros
- 🔧 Melhorar retorno da API em casos de cancelamento de pedido, evitando o bug onde o cancelamento devolve mais do que foi descontado
- 🔐 Tokenizar todas as operações, com tokens de no mínimo 20 caracteres para evitar repetições e garantir segurança
- 📊 Organizar os registros em tabelas para facilitar a visualização de dados
- ⏳ Adicionar feedback de carregamento (loader) sempre que dados forem buscados ou atualizados
  
---

## 📂 5 - Estrutura Inicial

```plaintext
buy-tech/
|
├── admin/                                                  # 🏢 Dashboard Administrativo
|   |
│   ├── admin/                                              # 🛠️ Área principal de administração
|   |   |
│   │   ├── categorias/                                     # 🏷️ Gerenciamento de Categorias
│   │   │   │
│   │   │   ├── atualizar_categorias.html                   # ✏️ Editar categorias
│   │   │   ├── cadastrar_categorias.html                   # ➕ Nova categoria
│   │   │   └── index.html                                  # 📋 Listagem de categorias
│   │   │
│   │   ├── cupons/                                         # 🎟️ Gerenciamento de Cupons
│   │   │   │
│   │   │   ├── atualizar_cupons.html                       # ✏️ Editar cupons
│   │   │   ├── cadastrar_cupons.html                       # ➕ Novo cupom
│   │   │   └── index.html                                  # 📋 Listagem de cupons
│   │   │
│   │   ├── financas/                                       # 💰 Gerenciamento Financeiro
│   │   │   │
│   │   │   ├── debitos_financas.html                       # 📉 Débitos
│   │   │   └── index.html                                  # 📊 Visão geral
│   │   │
│   │   ├── pedidos/                                        # 📦 Gerenciamento de Pedidos
│   │   │   │
│   │   │   ├── cancelar_pedidos.html                       # ❌ Cancelar pedidos
│   │   │   ├── index.html                                  # 📋 Pedidos
│   │   │   └── lista_pedidos_cancelados.html               # 🗑️ Pedidos cancelados
│   │   │
│   │   ├── perfis/                                         # 👥 Gerenciamento de Perfis
│   │   │   │
│   │   │   ├── atualizar_status_perfis.html                # ✏️ Alterar status
│   │   │   └── index.html                                  # 📋 Listagem de perfis
│   │   │
│   │   ├── produtos/                                       # 🛒 Gerenciamento de Produtos
│   │   │   │
│   │   │   ├── atualizar_produtos.html                     # ✏️ Editar produtos
│   │   │   ├── cadastrar_produtos.html                     # ➕ Novo produto
│   │   │   └── index.html                                  # 📋 Listagem de produtos
│   │   │
│   │   └── index.html                                      # 🏠 Dashboard Admin
│   │   
│   ├── cadastrar.html                                      # ✍️ Cadastro de Admin
│   ├── index.html                                          # 🏠 Módulo Administrativo
│   └── atualizarCadastro.html                              # 🔄 Atualizar cadastro Admin
│
├── cliente/                                                # 👤 Área do Cliente
│   │   
│   ├── index.html                                          # 🏠 Dashboard do Cliente
│   ├── atualizar_perfil.html                               # ✏️ Editar perfil
│   ├── creditos.html                                       # 💳 Créditos
│   ├── debitos.html                                        # 💸 Débitos
│   ├── extrato.html                                        # 📄 Extrato
│   ├── indicacoes.html                                     # 🔗 Indicações
│   ├── notificacoes.html                                   # 🔔 Notificações
│   ├── pedidos.html                                        # 📦 Meus pedidos
│   ├── pedido.html                                         # 📋 Detalhes do pedido
│   └── pendencias.html                                     # ⚠️ Pendências
│
├── emails/                                                 # ✉️ Páginas de E-mail
│   │   
│   └── confirmado/                                         # ✅ Confirmação de e-mail
│       │
│       └── index.html                                      # 📧 E-mail confirmado
│
├── src/                                                    # 📁 Recursos estáticos
│   │   
│   ├── imagens/                                            # 🖼️ Imagens do projeto
│   │   │
│   │   ├── banner.png                                      # 🌟 Banner principal
│   │   ├── gabinete.webp                                   # 🖥️ Imagem de gabinete
│   │   ├── loading.gif                                     # ⏳ Loader
│   │   └── pc-gamer.png                                    # 🎮 PC Gamer
│   │   
│   ├── scripts/                                            # 📜 Scripts JS
│   │   │
│   │   ├── admin/                                          # ⚙️ Lógica Admin
│   │   │   │
│   │   │   ├── adminCategorias.js                          # 🏷️ CRUD Categorias
│   │   │   ├── adminCupons.js                              # 🎟️ CRUD Cupons
│   │   │   ├── adminFinancas.js                            # 💰 Financeiro
│   │   │   ├── adminPedidos.js                             # 📦 Pedidos
│   │   │   ├── adminPerfis.js                              # 👥 Perfis
│   │   │   └── atualizarCadastroAdmin.js                   # 🔄 Atualizar Admin
│   │   │
│   │   ├── cliente/                                        # 👤 Lógica Cliente
│   │   │   │
│   │   │   ├── pedidos.js                                  # 📦 Meus pedidos
│   │   │   ├── extrato.js                                  # 📄 Extrato
│   │   │   └── pendencias.js                               # ⚠️ Pendências
│   │   │
│   │   └── geral/                                          # 🔄 Scripts gerais
│   │       │
│   │       ├── darkMode.js                                 # 🌙/☀️ Tema
│   │       ├── form.js                                     # 📝 Validação de formulários
│   │       └── menu.js                                     # 🔗 Menu dinâmico
│   │   
│   └── styles/                                             # 🎨 CSS
│       │
│       ├── admin.css                                       # 🏢 Dashboard Admin
│       ├── cliente.css                                     # 👤 Dashboard Cliente
│       ├── categorias.css                                  # 🏷️ Categorias
│       ├── detalhes.css                                    # 📋 Detalhes do produto
│       ├── index.css                                       # 🌐 Estilos globais
│       └── menu.css                                        # 🔗 Navegação
│
├── index.html                                              # 🏠 Home pública
├── produto.html                                            # 📦 Detalhes do produto
├── monte_seu_equipamento.html                              # 🛠️ Monte seu equipamento
├── categorias.html                                         # 🏷️ Página de categorias
├── cadastrar.html                                          # 📝 Cadastro geral
├── logar.html                                              # 🔐 Login geral
├── recuperar_senha_e_email.html                            # 🔄 Recuperar senha/e-mail
├── suporte.html                                            # 🛎️ Suporte ao usuário
├── LICENSE                                                 # 📄 Licença
├── favicon.ico                                             # 🔖 Ícone do site
└── README.md                                               # 📘 Documentação do projeto
```

* /*¹ Não fazem parte do projeto
* /*² Ainda está sendo atualizado

---

## 🤝 6 - Contribuições

🤝 Contribuições e ajuda no desenvolvimento são sempre bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---
