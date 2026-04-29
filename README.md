# Nexus

Uma aplicação para criar sua página pessoal e centralizar todos os seus links em um único lugar.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Conta Clerk (para autenticação)

### Instalação

1. Clone o repositório e instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (criar `.env.local`):
```
DATABASE_URL=postgresql://exemplo
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=seu_clerk_key
CLERK_SECRET_KEY=seu_clerk_secret
```

3. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Outros Comandos

- `npm run build` - Build para produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Verifica linting
- `npm run db:studio` - Abre Prisma Studio para gerenciar dados
- `npm run db:test` - Testa conexão com banco de dados

### Estrutura do Projeto

```
app/
├── page.tsx                 # Home + Dashboard (Estados baseados em autenticação)
├── actions.ts               # Server Actions (claimUsername, addLink, deleteLink)
├── [username]/page.tsx      # Página pública de perfil
├── api/users/route.ts       # API REST para gerenciar usuários
├── components/
│   └── copy-button.tsx      # Botão para copiar links
├── generated/prisma/        # Cliente Prisma gerado automaticamente
└── globals.css              # Estilos globais

lib/
└── prisma.ts               # Singleton Prisma Client

prisma/
└── schema.prisma            # Definição do banco de dados
```

## Documentação

- [routes.md](./routes.md) - Todas as rotas da aplicação
- [PROJETO.md](./PROJETO.md) - Arquitetura técnica e próximos passos
