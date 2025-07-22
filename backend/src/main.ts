import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configurar CORS
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
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

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Backend rodando em http://localhost:${port}`);
}
bootstrap();
