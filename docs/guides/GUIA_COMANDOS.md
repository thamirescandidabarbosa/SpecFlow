# 🚀 Fullstack Project - Guia de Comandos

## ⚡ Scripts Principais

### Iniciar o Projeto

```bash
# Iniciar ambos os servidores
start-fullstack.bat

# Ou manualmente:
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend  
cd frontend && npm start
```

### Parar os Servidores

```bash
stop-servers.bat
```

### Limpeza e Manutenção

```bash
# Limpar cache TypeScript
limpar-cache-typescript.bat

# Limpar arquivos desnecessários
cleanup-files.bat
```

## 🌐 URLs dos Serviços

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | <http://localhost:3001> | Interface React |
| Backend API | <http://localhost:3000/api> | API NestJS |
| Uploads | <http://localhost:3000/uploads> | Arquivos estáticos |

## 📋 APIs Disponíveis

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

### Usuários

- `GET /api/users` - Listar usuários

### Arquivos

- `POST /api/files/upload` - Upload de arquivo
- `GET /api/files` - Listar arquivos
- `GET /api/files/:id` - Obter arquivo
- `DELETE /api/files/:id` - Excluir arquivo

### Especificações Funcionais

- `POST /api/ef` - Criar especificação
- `GET /api/ef` - Listar especificações
- `GET /api/ef/:id` - Obter especificação
- `PATCH /api/ef/:id` - Atualizar especificação
- `DELETE /api/ef/:id` - Excluir especificação
- `GET /api/ef/:id/generate-pdf` - Gerar PDF
- `POST /api/ef/:id/upload/process-diagram` - Upload diagrama
- `POST /api/ef/:id/upload/unit-tests` - Upload testes

## 🛠️ Comandos de Desenvolvimento

### Backend (NestJS)

```bash
cd backend
npm run start:dev    # Desenvolvimento
npm run build        # Build
npm run test         # Testes
npm run lint         # Linting
```

### Frontend (React)

```bash
cd frontend
npm start            # Desenvolvimento
npm run build        # Build para produção
npm test             # Testes
npm run eject        # Ejetar configuração (cuidado!)
```

## 🔧 Solução de Problemas

### Erro de Cache TypeScript

```bash
limpar-cache-typescript.bat
# Ou no VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Erro de Dependências

```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend  
rm -rf node_modules package-lock.json
npm install
```

### Conflito de Portas

```bash
# Verificar processos nas portas
netstat -an | findstr ":3000"
netstat -an | findstr ":3001"

# Parar processos específicos
stop-servers.bat
```

## 📦 Estrutura do Projeto

```
fullstack-project/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── auth/     # Autenticação
│   │   ├── users/    # Usuários
│   │   ├── files/    # Arquivos
│   │   ├── ef/       # Especificações Funcionais
│   │   └── prisma/   # Banco de dados
│   └── uploads/      # Arquivos enviados
├── frontend/         # Interface React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── contexts/
└── scripts/          # Scripts de automação
```

## 🎯 Funcionalidades Principais

- ✅ Sistema de autenticação (JWT)
- ✅ Criação/edição de especificações funcionais
- ✅ Upload de arquivos (diagramas, testes)
- ✅ Geração de PDF das especificações
- ✅ Interface moderna com React + TypeScript
- ✅ Validação de formulários (React Hook Form + Yup)
- ✅ Ícones profissionais (Lucide React)
- ✅ Banco de dados SQLite (Prisma ORM)

## 💡 Dicas

1. **Sempre use os scripts .bat** para maior conveniência
2. **Reinicie o VS Code** se houver problemas de cache
3. **Verifique as portas** antes de iniciar os servidores
4. **Use o cleanup-files.bat** regularmente para manter o projeto limpo
5. **Faça backup** antes de grandes mudanças

## 🆘 Suporte

Se encontrar problemas:

1. Execute `cleanup-files.bat`
2. Execute `limpar-cache-typescript.bat`  
3. Reinicie o VS Code
4. Execute `start-fullstack.bat`

---
**Projeto criado e otimizado para desenvolvimento fullstack com NestJS + React + TypeScript**
