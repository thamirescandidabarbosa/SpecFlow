# 🛠️ Soluções de Problemas com Backend

*Documento Consolidado - Soluções para problemas relacionados ao Backend*

## Índice
1. [Problemas com NestJS e Dependências](#problemas-com-nestjs-e-dependências)
2. [Soluções para Erros Internos do Servidor](#soluções-para-erros-internos-do-servidor)
3. [Docker e Ambiente de Desenvolvimento](#docker-e-ambiente-de-desenvolvimento)

---

## Problemas com NestJS e Dependências

### ⚠️ Sintomas
- Erros de inicialização do NestJS
- Módulos não carregando corretamente
- Dependências circulares

### 🔍 Diagnóstico
Problemas comuns com dependências do NestJS e configuração incorreta de módulos.

### ✅ Solução

1. **Reorganização de Módulos**
   ```typescript
   // Correto: Evite dependências circulares
   @Module({
     imports: [
       PrismaModule,
       UsersModule,
     ],
     controllers: [AuthController],
     providers: [AuthService, JwtStrategy],
     exports: [AuthService],
   })
   export class AuthModule {}
   ```

2. **Atualização de Dependências**
   ```bash
   cd backend
   npm update @nestjs/core @nestjs/common @nestjs/jwt
   npm install class-validator class-transformer
   ```

3. **Correção de Injeção de Dependências**
   ```typescript
   // Errado
   constructor(private authService, private userService) {}
   
   // Correto
   constructor(
     private readonly authService: AuthService,
     private readonly userService: UserService,
   ) {}
   ```

---

## Soluções para Erros Internos do Servidor

### ⚠️ Problema
Erros 500 (Internal Server Error) em várias endpoints da API.

### 🔍 Análise
Os erros internos geralmente são causados por exceções não tratadas, problemas com o banco de dados ou validação incorreta.

### ✅ Correção

1. **Implementação de filtro de exceções global**
   ```typescript
   // src/filters/http-exception.filter.ts
   import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
   import { Request, Response } from 'express';
   
   @Catch()
   export class GlobalExceptionFilter implements ExceptionFilter {
     catch(exception: any, host: ArgumentsHost) {
       const ctx = host.switchToHttp();
       const response = ctx.getResponse<Response>();
       const request = ctx.getRequest<Request>();
       
       const status = 
         exception instanceof HttpException
           ? exception.getStatus()
           : HttpStatus.INTERNAL_SERVER_ERROR;
           
       console.error(`Error: ${exception.message}`, exception.stack);
       
       response.status(status).json({
         statusCode: status,
         timestamp: new Date().toISOString(),
         path: request.url,
         message: exception.message || 'Internal server error',
       });
     }
   }
   ```

2. **Validação robusta de parâmetros**
   ```typescript
   // Use ValidationPipe do NestJS
   app.useGlobalPipes(
     new ValidationPipe({
       transform: true,
       whitelist: true,
       forbidNonWhitelisted: true,
     }),
   );
   ```

3. **Tratamento correto de erros do Prisma**
   ```typescript
   try {
     return await this.prisma.functionalSpec.create({
       data: createFunctionalSpecDto,
     });
   } catch (error) {
     if (error.code === 'P2002') {
       throw new ConflictException('Já existe uma especificação com este título');
     }
     throw new InternalServerErrorException('Erro ao criar especificação');
   }
   ```

---

## Docker e Ambiente de Desenvolvimento

### ⚠️ Sintomas
- Containers Docker não iniciam ou param inesperadamente
- Problemas com volumes e persistência de dados
- Variáveis de ambiente incorretas

### 🔍 Diagnóstico
Configuração incorreta do Docker ou problemas de compatibilidade com o ambiente de desenvolvimento.

### ✅ Solução

1. **Docker Compose otimizado**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       container_name: fullstack_postgres
       environment:
         POSTGRES_USER: admin
         POSTGRES_PASSWORD: password
         POSTGRES_DB: fullstack_db
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "pg_isready", "-U", "admin"]
         interval: 10s
         timeout: 5s
         retries: 5
   
     backend:
       build: ./backend
       container_name: fullstack_backend
       depends_on:
         postgres:
           condition: service_healthy
       environment:
         DATABASE_URL: postgresql://admin:password@postgres:5432/fullstack_db
         JWT_SECRET: your_jwt_secret
       ports:
         - "3000:3000"
       volumes:
         - ./backend:/app
         - /app/node_modules
       restart: unless-stopped
   
   volumes:
     postgres_data:
   ```

2. **Correção de permissões de arquivos**
   ```bash
   # Windows: Corrigir permissões no WSL
   icacls "uploads" /grant Everyone:F /T
   
   # Linux/Mac
   chmod -R 777 uploads
   ```

3. **Configuração de variáveis de ambiente**
   - Criar um arquivo `.env.example` para documentar variáveis necessárias
   - Garantir que o `.env` está no `.gitignore`
   - Usar `dotenv-cli` para carregar variáveis de ambiente corretamente

---

© 2025 Thamires Candida Barbosa. Todos os direitos reservados.
