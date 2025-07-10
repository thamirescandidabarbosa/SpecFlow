# Módulo EF (Especificação Funcional) - NestJS

## 📋 Descrição

O módulo EF (Especificação Funcional) é responsável por gerenciar todas as especificações funcionais do sistema, incluindo upload de arquivos, validação de dados e geração de documentos.

## 🏗️ Estrutura

```
src/ef/
├── dto/
│   ├── create-ef.dto.ts          # DTO para criação de EF
│   └── update-ef.dto.ts          # DTO para atualização de EF
├── entities/
│   └── ef.entity.ts              # Entidades TypeScript
├── ef.controller.ts              # Controlador REST
├── ef.service.ts                 # Serviço de negócio
└── ef.module.ts                  # Módulo NestJS
```

## 🗄️ Modelos do Banco (Prisma)

### FunctionalSpecification

- Contém todos os campos do formulário
- Relacionamento 1:N com FunctionalRequest
- Relacionamento 1:N with FileUpload
- Campos do Cutover Plan incluídos

### FunctionalRequest

- Requests relacionadas a uma EF
- Campos: description, priority

## 📡 Endpoints API

### Especificações Funcionais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/ef` | Criar nova EF |
| GET | `/ef` | Listar todas as EFs |
| GET | `/ef/:id` | Buscar EF por ID |
| PATCH | `/ef/:id` | Atualizar EF |
| DELETE | `/ef/:id` | Deletar EF |

### Uploads

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/ef/:id/upload/process-diagram` | Upload de diagrama de processo |
| POST | `/ef/:id/upload/unit-tests` | Upload de testes unitários |

### Documentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/ef/:id/generate-pdf` | Gerar documento PDF/JSON da EF |

## 🔧 Funcionalidades Implementadas

### ✅ CRUD Completo

- Criar, ler, atualizar e deletar especificações funcionais
- Validação com class-validator
- Relacionamentos automáticos (requests, arquivos)

### ✅ Upload de Arquivos

- Configuração Multer para upload seguro
- Suporte a múltiplos tipos de arquivo
- Limite de tamanho (10MB)
- Organização em pasta específica (`uploads/ef/`)

### ✅ Cutover Plan

- Campos opcionais ativados por checkbox
- Validação condicional
- Persistência no banco de dados
- Inclusão na geração de documentos

### ✅ Validação Robusta

- DTOs com class-validator
- Validação de tipos e formatos
- Mensagens de erro personalizadas
- Validação condicional para Cutover Plan

### ✅ Segurança

- Autenticação JWT obrigatória
- Validação de tipos de arquivo
- Sanitização de nomes de arquivo
- Controle de acesso por usuário

## 📤 Exemplos de Uso

### Criar EF

```json
POST /ef
Content-Type: application/json
Authorization: Bearer <token>

{
  "cardNumber": "CARD-2025-001",
  "projectName": "Sistema de EF",
  "date": "2025-06-27",
  "version": "1.0",
  "developmentEnvironment": "EQ0",
  "developmentDescription": "Desenvolvimento do sistema...",
  "functionalSpecification": "Especificação completa...",
  "changeDescription": "Implementação de nova funcionalidade...",
  "requests": [
    {
      "description": "Request de exemplo",
      "priority": "Alta"
    }
  ],
  "status": "Em andamento",
  "startDateTime": "2025-06-27T10:00:00Z",
  "includeCutoverPlan": true,
  "cutoverPlan": {
    "objective": "Objetivo do cutover...",
    "timeline": "Timeline detalhado...",
    "detailedActivities": "Atividades específicas...",
    "preChecklistActivities": "Checklist pré-cutover...",
    "communicationPlan": "Plano de comunicação...",
    "teamsAndResponsibilities": "Equipes envolvidas...",
    "contingencyPlan": "Plano de contingência...",
    "successCriteria": "Critérios de sucesso...",
    "postGoLiveSupport": "Suporte pós go-live..."
  }
}
```

### Upload de Arquivos

```bash
# Upload de diagrama de processo
POST /ef/{id}/upload/process-diagram
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: [arquivo]

# Upload de testes unitários
POST /ef/{id}/upload/unit-tests
Content-Type: multipart/form-data
Authorization: Bearer <token>

files: [arquivo1, arquivo2, ...]
```

## 🔄 Integração com Frontend

O módulo está completamente integrado com o frontend React:

1. **Tipos TypeScript**: Compatíveis entre frontend e backend
2. **Validação**: Mesmas regras aplicadas em ambos os lados  
3. **Upload**: Suporte a múltiplos arquivos
4. **Cutover Plan**: Validação e persistência completas

## 🚀 Próximos Passos

### Geração de PDF

- Implementar biblioteca de PDF (puppeteer, jsPDF, etc.)
- Templates profissionais para documentos
- Inclusão de imagens e anexos

### Notificações

- Email automático na criação/atualização
- Notificações de status
- Lembretes de deadline

### Relatórios

- Dashboard de especificações
- Métricas de produtividade
- Relatórios por período/projeto

## 🏁 Status: IMPLEMENTADO COM SUCESSO ✅

O módulo EF está completamente funcional e pronto para uso em produção, com todas as funcionalidades solicitadas implementadas:

- ✅ Entidades EF e Request
- ✅ Upload de arquivos com Multer
- ✅ DTOs com validação class-validator
- ✅ Serviço com Prisma
- ✅ Endpoint para geração de documento
- ✅ Cutover Plan completo
- ✅ CRUD completo
- ✅ Segurança e validação
