# Documentação da Estrutura do Projeto SpecFlow

*Documento elaborado por Thamires Candida Barbosa*

## Visão Geral

Este documento detalha a estrutura de pastas e arquivos do projeto SpecFlow, um sistema de gerenciamento de Especificações Funcionais (EFs) para desenvolvimento de software. O sistema foi desenvolvido com uma arquitetura moderna, baseada em microserviços, utilizando React no frontend e NestJS no backend.

## Estrutura de Diretórios

### Raiz do Projeto

```
fullstack-project/
├── frontend/           # Aplicação React (Cliente)
├── backend/            # API NestJS (Servidor)
├── docker-compose.yml  # Configuração do ambiente Docker
├── README.md           # Documentação principal
└── scripts/            # Scripts de automação e suporte
```

### Frontend (React + TypeScript)

```
frontend/
├── public/             # Arquivos estáticos públicos
│   ├── index.html      # Template HTML principal
│   ├── favicon.ico     # Ícone do site
│   └── assets/         # Recursos estáticos (imagens, fontes, etc.)
│
├── src/                # Código-fonte do frontend
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── common/     # Componentes genéricos (Button, Input, etc.)
│   │   ├── layout/     # Componentes de layout (Header, Sidebar, etc.)
│   │   └── domain/     # Componentes específicos de domínio
│   │
│   ├── contexts/       # Contextos do React (Auth, Theme, etc.)
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   │
│   ├── hooks/          # Custom hooks
│   │   ├── useAuth.ts  # Hook para autenticação
│   │   └── useForm.ts  # Hook para formulários
│   │
│   ├── pages/          # Páginas da aplicação
│   │   ├── auth/       # Páginas de autenticação
│   │   ├── dashboard/  # Dashboard principal
│   │   ├── ef/         # Páginas de Especificações Funcionais
│   │   └── settings/   # Configurações do usuário
│   │
│   ├── services/       # Serviços e APIs
│   │   ├── api.ts      # Cliente HTTP configurado (Axios)
│   │   └── functionalSpecificationService.ts  # Serviço para EFs
│   │
│   ├── types/          # Tipagens TypeScript
│   │   └── index.ts    # Definições de tipos
│   │
│   ├── utils/          # Utilitários e helpers
│   │   ├── fileUtils.ts  # Manipulação de arquivos
│   │   └── dateUtils.ts  # Formatação de datas
│   │
│   ├── App.tsx         # Componente raiz da aplicação
│   └── index.tsx       # Ponto de entrada da aplicação
│
├── package.json        # Dependências do projeto
├── tsconfig.json       # Configuração do TypeScript
└── .env.example        # Template para variáveis de ambiente
```

### Backend (NestJS + TypeScript)

```
backend/
├── src/                # Código-fonte do backend
│   ├── main.ts         # Ponto de entrada da aplicação
│   ├── app.module.ts   # Módulo principal
│   │
│   ├── auth/           # Módulo de autenticação
│   │   ├── auth.controller.ts   # Controlador de autenticação
│   │   ├── auth.service.ts      # Serviço de autenticação
│   │   └── jwt.strategy.ts      # Estratégia JWT
│   │
│   ├── users/          # Módulo de usuários
│   │   ├── users.controller.ts  # Controlador de usuários
│   │   └── users.service.ts     # Serviço de usuários
│   │
│   ├── ef/             # Módulo de Especificações Funcionais
│   │   ├── ef.controller.ts     # Controlador de EFs
│   │   ├── ef.service.ts        # Serviço de EFs
│   │   └── entities/           # Entidades relacionadas
│   │
│   ├── files/          # Módulo de arquivos
│   │   ├── files.controller.ts  # Controlador de arquivos
│   │   └── files.service.ts     # Serviço de arquivos
│   │
│   ├── common/         # Código compartilhado
│   │   ├── decorators/  # Decorators personalizados
│   │   ├── filters/     # Filtros de exceção
│   │   ├── guards/      # Guards de autenticação
│   │   └── interceptors/ # Interceptores
│   │
│   └── prisma/         # Integração com Prisma ORM
│       └── prisma.service.ts # Serviço do Prisma
│
├── prisma/             # Configuração do Prisma ORM
│   ├── schema.prisma   # Definição do esquema do banco de dados
│   └── seed.ts         # Script de população inicial do banco
│
├── uploads/            # Diretório para arquivos enviados
│   ├── diagrams/       # Diagramas de processo
│   └── attachments/    # Anexos gerais
│
├── test/               # Testes automatizados
│   ├── e2e/            # Testes end-to-end
│   └── unit/           # Testes unitários
│
├── package.json        # Dependências do projeto
├── nest-cli.json       # Configuração do NestJS CLI
└── .env.example        # Template para variáveis de ambiente
```

## Arquitetura

O sistema segue uma arquitetura em camadas:

1. **Frontend**:
   - **Apresentação**: Componentes React e páginas
   - **Estado**: React Hooks e Context API
   - **Serviços**: Chamadas à API e lógica de negócios do cliente

2. **Backend**:
   - **API**: Controladores NestJS (rotas e requisições)
   - **Lógica de Negócio**: Serviços NestJS
   - **Acesso a Dados**: Prisma ORM e repositórios
   - **Banco de Dados**: PostgreSQL

## Fluxo de Dados

1. O usuário interage com a interface React
2. O frontend chama os serviços apropriados via Axios
3. As requisições HTTP são processadas pelos controladores NestJS
4. Os serviços no backend aplicam a lógica de negócio
5. O Prisma ORM manipula o acesso ao banco de dados
6. Os resultados são retornados pela API para o frontend
7. O React atualiza a interface do usuário

## Segurança

- **Autenticação**: JWT (JSON Web Tokens)
- **Autorização**: Guards NestJS e Context API no frontend
- **Validação**: Class-validator no backend e Yup no frontend
- **Proteção contra CSRF**: Tokens CSRF incluídos nas requisições
- **Sanitização**: Sanitização de inputs para prevenir XSS

---

© 2025 Thamires Candida Barbosa. Todos os direitos reservados.
