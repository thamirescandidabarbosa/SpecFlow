# SpecFlow - Sistema de Gerenciamento de Especificações Funcionais

*Desenvolvido por Thamires Candida Barbosa*

## Descrição do Projeto

SpecFlow é um sistema full stack completo para gerenciamento de Especificações Funcionais (EF), permitindo o controle completo do ciclo de vida de documentos técnicos para desenvolvimento de software. O sistema conta com:

- **Frontend**: React com TypeScript
- **Backend**: Node.js com NestJS
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: Sistema de login com JWT (nome do usuário usado como "Analista Técnico")
- **Upload de Arquivos**: Suporte para imagens e PDFs

## Estrutura do Projeto

```
fullstack-project/
├── frontend/           # Aplicação React com TypeScript
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Context API (Auth)
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços de API
│   │   └── types/         # Tipagens TypeScript
│   ├── public/
│   └── package.json
├── backend/            # API NestJS
│   ├── src/
│   │   ├── auth/          # Módulo de autenticação
│   │   ├── users/         # Módulo de usuários
│   │   ├── documents/     # Módulo de documentos
│   │   ├── files/         # Módulo de upload de arquivos
│   │   └── prisma/        # Configuração do Prisma
│   ├── prisma/
│   │   ├── schema.prisma  # Schema do banco de dados
│   │   └── seed.ts        # Dados iniciais
│   ├── uploads/           # Diretório de arquivos enviados
│   └── package.json
├── docker-compose.yml  # Configuração do PostgreSQL
└── README.md
```

## Como executar

### 🚀 **Método Rápido (Windows)**

Execute o script de configuração automática:

```bash
# Configura todo o projeto de uma vez
setup.bat

# Inicia o sistema
start.bat
```

### 🛠️ **Método Manual**

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Git

### 1. Clonar o repositório e navegar para o diretório

```bash
git clone <url-do-repositorio>
cd fullstack-project
```

### 2. Configurar e executar o Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

### 3. Configurar e executar o Frontend

```bash
cd frontend
npm install
npm start
```

## Acesso

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **Banco de Dados**: SQLite (arquivo `backend/dev.db`)

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **PostgreSQL**: localhost:5432

## Credenciais de Teste

Após executar o seed, você pode usar estas credenciais:

**Administrador:**

- Email: <admin@sistema.com>
- Senha: admin123

**Analista Técnico 1:**

- Email: <analyst1@sistema.com>  
- Senha: analyst123
- Nome: João Silva

**Analista Técnico 2:**

- Email: <analyst2@sistema.com>
- Senha: analyst123
- Nome: Maria Santos

## Funcionalidades

### ✅ Autenticação

- Login e cadastro de usuários
- JWT para autenticação
- Diferentes níveis de usuário (Admin, Analista, Usuário)
- Nome do usuário usado como "Analista Técnico"

### ✅ Gerenciamento de Documentos

- Criar, editar, listar e excluir documentos
- Associação de documentos com usuários
- Histórico de criação e modificação

### ✅ Upload de Arquivos

- Suporte para imagens (JPG, PNG, GIF)
- Suporte para PDFs
- Limite de 10MB por arquivo
- Visualização e download de arquivos
- Associação opcional com documentos

### ✅ Interface Moderna

- Design responsivo
- Interface intuitiva com ícones
- Feedback visual (toasts)
- Loading states
- Navegação clara

### ✅ Dashboard

- Estatísticas do sistema
- Documentos recentes
- Arquivos recentes
- Informações do usuário logado

## Tecnologias Utilizadas

### Backend

- **NestJS**: Framework Node.js
- **Prisma**: ORM para banco de dados
- **PostgreSQL**: Banco de dados
- **JWT**: Autenticação
- **Multer**: Upload de arquivos
- **bcryptjs**: Hash de senhas

### Frontend

- **React**: Biblioteca de interface
- **TypeScript**: Tipagem estática
- **React Router**: Roteamento
- **React Query**: Gerenciamento de estado servidor
- **Axios**: Cliente HTTP
- **React Hook Form**: Formulários
- **React Toastify**: Notificações
- **Lucide React**: Ícones

## Estrutura da API

### Endpoints de Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Cadastro

### Endpoints de Usuários

- `GET /api/users` - Listar usuários

### Endpoints de Documentos

- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Criar documento
- `GET /api/documents/:id` - Buscar documento
- `PATCH /api/documents/:id` - Atualizar documento
- `DELETE /api/documents/:id` - Excluir documento

### Endpoints de Arquivos

- `GET /api/files` - Listar arquivos
- `POST /api/files/upload` - Upload de arquivo
- `GET /api/files/:id` - Buscar arquivo
- `DELETE /api/files/:id` - Excluir arquivo

## Banco de Dados

### Tabelas Principais

- **users**: Usuários do sistema
- **documents**: Documentos criados
- **file_uploads**: Arquivos enviados

### Relacionamentos

- Um usuário pode ter vários documentos
- Um usuário pode fazer vários uploads
- Um documento pode ter vários arquivos
- Um arquivo pode pertencer a um documento (opcional)

## Scripts Disponíveis

### Backend

- `npm run start:dev` - Executar em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run prisma:migrate` - Executar migrações
- `npm run prisma:generate` - Gerar cliente Prisma
- `npm run prisma:seed` - Executar seed

### Frontend

- `npm start` - Executar em desenvolvimento
- `npm run build` - Build para produção
- `npm test` - Executar testes

## Próximos Passos (Melhorias Futuras)

- [ ] Testes unitários e de integração
- [ ] Sistema de permissões mais granular
- [ ] Paginação para listas grandes
- [ ] Preview de imagens na interface
- [ ] Sistema de notificações em tempo real
- [ ] Logs de auditoria
- [ ] Backup automático
- [ ] Deploy automatizado

## Aviso Legal

Este projeto foi idealizado e desenvolvido por Thamires Candida Barbosa. Todos os direitos reservados. Proibido o uso, cópia ou redistribuição não autorizada.

## Contato

Para questões técnicas ou comerciais, entre em contato:

- **Email**: thamirescandidabarbosa@gmail.com
- **LinkedIn**: [linkedin.com/in/thamirescandida](https://linkedin.com/in/thamiresbarbosa)

---
© 2025 Thamires Candida Barbosa. Todos os direitos reservados.
