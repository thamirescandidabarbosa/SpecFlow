# Guia para Publicação no GitHub

Este guia fornece instruções passo a passo para publicar o projeto SpecFlow no GitHub de forma organizada.

## Pré-requisitos

1. Instale o Git, caso ainda não tenha: [Download Git](https://git-scm.com/downloads)
2. Crie uma conta no GitHub, se ainda não tiver: [GitHub](https://github.com/)
3. Configure seu nome de usuário e email no Git:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu.email@exemplo.com"
   ```

## Etapa 1: Criar um repositório no GitHub

1. Acesse [GitHub](https://github.com/) e faça login
2. Clique no botão "+" no canto superior direito e selecione "New repository"
3. Preencha as informações:
   - Nome do repositório: `SpecFlow`
   - Descrição: `Sistema de gerenciamento de Especificações Funcionais (EFs) para desenvolvimento de software`
   - Visibilidade: Pública ou Privada (conforme sua preferência)
   - **NÃO** inicialize com README, .gitignore ou license
4. Clique em "Create repository"

## Etapa 2: Inicializar o repositório loca

Abra um terminal na pasta raiz do projeto (`fullstack-project`) e execute:

```bash
# Inicializar repositório Git
git init

# Verificar o status atual
git status
```

## Etapa 3: Adicionar e commitar arquivos por partes

### 1. Arquivos de configuração

```bash
git add .gitignore docker-compose.yml
git commit -m "Adiciona arquivos de configuração inicial"
```

### 2. Documentação principal

```bash
git add README.md LICENSE.md SECURITY.md CODE_OF_CONDUCT.md CONTRIBUTING.md
git commit -m "Adiciona documentação principal"
```

### 3. Documentação técnica

```bash
git add ARQUITETURA.md ESTRUTURA_PROJETO.md CHANGELOG.md
git commit -m "Adiciona documentação de arquitetura e estrutura"

git add docs/
git commit -m "Adiciona documentação técnica detalhada"
```

### 4. Backend

```bash
# Configurações do backend
git add backend/package.json backend/tsconfig.json backend/nest-cli.json
git commit -m "Adiciona configurações do backend"

# Código do backend
git add backend/src/
git commit -m "Adiciona código-fonte do backend"

# Prisma (banco de dados)
git add backend/prisma/schema.prisma backend/prisma/migrations/ backend/prisma/seed.ts
git commit -m "Adiciona configuração do banco de dados (Prisma)"
```

### 5. Frontend

```bash
# Configurações do frontend
git add frontend/package.json frontend/tsconfig.json
git commit -m "Adiciona configurações do frontend"

# Arquivos estáticos
git add frontend/public/
git commit -m "Adiciona arquivos estáticos do frontend"

# Código do frontend
git add frontend/src/
git commit -m "Adiciona código-fonte do frontend"
```

### 6. Scripts e utilitários

```bash
git add *.bat *.ps1 _backup_scripts/
git commit -m "Adiciona scripts de automação"
```

## Etapa 4: Conectar e enviar para o GitHub

```bash
# Conectar com o repositório remoto (substitua SEU-USUARIO pelo seu nome de usuário)
git remote add origin https://github.com/SEU-USUARIO/SpecFlow.git

# Renomear branch para main (padrão atual do GitHub)
git branch -M main

# Enviar tudo para o GitHub
git push -u origin main
```

## Etapa 5: Verificação

Depois de fazer o push, acesse seu repositório no GitHub para verificar se tudo foi enviado corretamente:
https://github.com/SEU-USUARIO/SpecFlow

---

## Dicas para manutenção do repositório

- **Commits frequentes**: Faça commits pequenos e frequentes, cada um com um propósito claro
- **Mensagens descritivas**: Escreva mensagens de commit claras e descritivas
- **Branches**: Use branches para desenvolver novas funcionalidades
- **Pull Requests**: Para projetos com múltiplos colaboradores, use Pull Requests para revisão de código
- **Tags**: Marque versões estáveis com tags: `git tag -a v1.0.0 -m "Versão 1.0.0" && git push --tags`

---

© 2025 Thamires Candida Barbosa. Todos os direitos reservados.
