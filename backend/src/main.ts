import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const corsOrigin = process.env.CORS_ORIGIN || 'https://specflow-app.surge.sh';
    const allowedOrigins = [
        'http://localhost:3000',
        'https://specflow-app.surge.sh',
        'https://thamirescandidabarbosa.github.io',
        ...corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean),
    ];

    console.log('CORS configurado para:', allowedOrigins.join(', '));

    app.enableCors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log('CORS bloqueado para origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        preflightContinue: false,
        optionsSuccessStatus: 204
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        disableErrorMessages: false,
        validationError: {
            target: true,
            value: true
        }
    }));

    app.setGlobalPrefix('api');

    const port = process.env.PORT || process.env.RAILWAY_PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';

    console.log(`Iniciando servidor na porta ${port}...`);

    await app.listen(port, host);

    console.log(`Backend rodando em http://${host}:${port}`);
}
bootstrap();
