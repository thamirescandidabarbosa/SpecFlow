# Guia de Contribuição

*Documento elaborado por Thamires Candida Barbosa*

Este documento descreve as diretrizes para contribuir com o projeto SpecFlow. Seguir estas orientações ajuda a manter a consistência e qualidade do código.

## Fluxo de Trabalho

1. **Fork do repositório**
2. **Clone do seu fork**
   ```bash
   git clone https://github.com/seu-usuario/specflow.git
   cd specflow
   ```
3. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nome-da-feature
   ```
4. **Faça suas alterações seguindo as convenções de código**
5. **Commit das alterações**
   ```bash
   git commit -m "feat: descrição clara da alteração"
   ```
6. **Push para seu fork**
   ```bash
   git push origin feature/nome-da-feature
   ```
7. **Abra um Pull Request**

## Convenções de Codificação

### Estilo de Código

- **Frontend**: Seguimos o padrão do Prettier e ESLint configurado no projeto
- **Backend**: Seguimos as convenções de estilo do NestJS

### Nomenclatura

- **Variáveis e funções**: camelCase
- **Classes**: PascalCase
- **Constantes**: UPPER_SNAKE_CASE
- **Arquivos de componentes**: PascalCase.tsx
- **Arquivos de serviços e utilitários**: camelCase.ts

### Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Formatação, ponto e vírgula, etc; sem alteração de código
- `refactor`: Refatoração de código sem alteração de comportamento
- `test`: Adição ou correção de testes
- `chore`: Alterações no processo de build, ferramentas, etc

Exemplo:
```
feat(auth): adiciona validação de token JWT expirado
```

## Testes

- Todos os novos recursos devem vir com testes apropriados
- Mantenha a cobertura de testes acima de 80%
- Execute `npm run test` antes de submeter PRs

## Revisão de Código

- Todo código será revisado antes de ser mesclado
- Responda a feedback construtivo de maneira oportuna
- Seja respeitoso e profissional nas discussões

## Reportando Bugs

Ao reportar bugs, inclua:

1. Descrição clara do problema
2. Passos para reproduzir
3. Comportamento esperado vs. observado
4. Screenshots (se aplicável)
5. Detalhes do ambiente (navegador, SO, etc.)

---

© 2025 Thamires Candida Barbosa. Todos os direitos reservados.
