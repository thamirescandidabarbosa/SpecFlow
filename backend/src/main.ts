import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configurar CORS explicitamente para Surge e Railway
    const corsOrigin = process.env.CORS_ORIGIN || 'https://specflow-app.surge.sh';
    console.log('🌐 CORS configurado para:', corsOrigin);
    
    app.enableCors({
        origin: function (origin, callback) {
            // Permitir requests sem origin (ex: mobile apps)
            if (!origin) return callback(null, true);
            
            // Lista de origins permitidas
            const allowedOrigins = [
                'http://localhost:3000',
                'https://specflow-app.surge.sh',
                corsOrigin
            ];
            
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log('❌ CORS bloqueado para origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        preflightContinue: false,
        optionsSuccessStatus: 204
    });

    // Configurar validação global
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false, // Temporário para debug
        disableErrorMessages: false,
        validationError: {
            target: true,
            value: true
        }
    }));

    // Prefixo global para API
    app.setGlobalPrefix('api');

    // Configuração de porta para Railway/Render
    const port = process.env.PORT || process.env.RAILWAY_PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    console.log(`🌐 Iniciando servidor na porta ${port}...`);
    
    await app.listen(port, host);

    console.log(`🚀 Backend rodando em http://${host}:${port}`);
}
bootstrap();
