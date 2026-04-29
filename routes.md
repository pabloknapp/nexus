# Rotas da Aplicação

## Rotas de Página (Page Routes)

### `/` (Home)
- **GET** - Página principal
- **Estados:**
  - Usuário não autenticado: Exibe landing page com CTA para login/signup
  - Usuário autenticado sem username: Exibe formulário para reivindicar username
  - Usuário autenticado com username: Exibe dashboard com lista de links e formulário para adicionar novos

### `/[username]` (Perfil Público)
- **GET** - Exibe a página pública do usuário com seus links
- **Parâmetro:** `username` (string)
- **Comportamento:**
  - Busca o usuário no banco por username
  - Exibe avatar, nome e lista de links ordenados por data (mais recente primeiro)
  - Retorna 404 se o usuário não existir

## Rotas de API (API Routes)

### `/api/users`
- **GET** - Retorna lista de todos os usuários
  - Status: 200
  - Response: Array de usuários
  - Erro: 500 se falhar a busca

- **POST** - Cria um novo usuário
  - Status: 201
  - Body: `{ email, username, clerkId, name }`
  - Response: Objeto do usuário criado
  - Erro: 500 se falhar a criação

## Server Actions

### `claimUsername(formData)`
- **Tipo:** Form Action (POST)
- **Requer:** Autenticação
- **Parâmetros:** 
  - `username` (FormData)
- **Validações:**
  - Mínimo 3 caracteres
  - Apenas letras, números e underline
  - Não pode duplicar
- **Comportamento:**
  - Cria novo usuário no banco de dados
  - Redireciona para `/` após sucesso

### `addLink(formData)`
- **Tipo:** Form Action (POST)
- **Requer:** Autenticação
- **Parâmetros:**
  - `title` (string, obrigatório)
  - `url` (string, obrigatório)
- **Comportamento:**
  - Cria novo link no banco associado ao usuário
  - Revalida a página `/` após sucesso

### `deleteLink(formData)`
- **Tipo:** Form Action (POST)
- **Requer:** Autenticação
- **Parâmetros:**
  - `linkId` (number, obrigatório)
- **Comportamento:**
  - Remove o link do banco de dados
  - Valida se o link pertence ao usuário autenticado
  - Revalida a página `/` após sucesso
