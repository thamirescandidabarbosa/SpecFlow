# Opções de Configuração do Banco de Dados

## Opção 1: PostgreSQL com Docker (Recomendado)

```bash
# Certifique-se que o Docker Desktop está rodando
docker-compose up -d
```

## Opção 2: PostgreSQL Local (Alternativa)

### 1. Instalar PostgreSQL

- Baixe e instale o PostgreSQL: <https://www.postgresql.org/download/windows/>
- Durante a instalação, defina uma senha para o usuário 'postgres'

### 2. Criar o banco de dados

Abra o pgAdmin ou psql e execute:

```sql
CREATE DATABASE fullstack_db;
CREATE USER admin WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE fullstack_db TO admin;
```

### 3. Atualizar o arquivo .env

No arquivo `backend/.env`, altere a DATABASE_URL:

```env
# Para PostgreSQL local (substitua 'sua_senha' pela senha do postgres)
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/fullstack_db"

# OU se criou o usuário admin como mostrado acima:
DATABASE_URL="postgresql://admin:password@localhost:5432/fullstack_db"
```

## Opção 3: SQLite (Mais simples para desenvolvimento)

### 1. Atualizar o Prisma Schema

No arquivo `backend/prisma/schema.prisma`, altere:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Atualizar o arquivo .env

```env
DATABASE_URL="file:./dev.db"
```

### 3. Executar as migrações

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```
