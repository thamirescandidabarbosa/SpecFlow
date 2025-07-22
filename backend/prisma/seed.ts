import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Criar usuário admin padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@sistema.com' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@sistema.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Criar alguns usuários analistas para teste
    const analystPassword = await bcrypt.hash('analyst123', 10);

    const analyst1 = await prisma.user.upsert({
        where: { email: 'analyst1@sistema.com' },
        update: {},
        create: {
            username: 'João Silva',
            email: 'analyst1@sistema.com',
            password: analystPassword,
            role: 'ANALYST',
        },
    });

    const analyst2 = await prisma.user.upsert({
        where: { email: 'analyst2@sistema.com' },
        update: {},
        create: {
            username: 'Maria Santos',
            email: 'analyst2@sistema.com',
            password: analystPassword,
            role: 'ANALYST',
        },
    });

    // Criar usuário tcbarbosa
    const tcbarbosaPassword = await bcrypt.hash('senha123', 10);
    const tcbarbosa = await prisma.user.upsert({
        where: { username: 'tcbarbosa' },
        update: {},
        create: {
            username: 'tcbarbosa',
            email: 'tcbarbosa@sistema.com',
            password: tcbarbosaPassword,
            role: 'ANALYST',
        },
    });

    // Criar 4 especificações funcionais para o usuário tcbarbosa
    const efData = [1, 2, 3, 4].map((n) => ({
        cardNumber: `CARD-00${n}`,
        projectName: `Projeto Exemplo ${n}`,
        technicalAnalyst: 'tcbarbosa',
        gmud: `GMUD-2025-0${n}`,
        date: new Date(),
        version: `v1.0.${n}`,
        developmentEnvironment: 'EQ0',
        author: 'tcbarbosa',
        comment: `Comentário de exemplo ${n}`,
        developmentDescription: `Descrição de desenvolvimento ${n}`,
        functionalSpecification: `Especificação funcional ${n}`,
        changeDescription: `Descrição da mudança ${n}`,
        order: `ORD-00${n}`,
        status: 'Em andamento',
        startDateTime: new Date(),
        endDateTime: null,
        includeCutoverPlan: false,
        authorId: tcbarbosa.id,
    }));

    const efCreated = [];
    for (const ef of efData) {
        const created = await prisma.functionalSpecification.create({ data: ef });
        efCreated.push(created);
    }

    console.log('Seed executado com sucesso!');
    console.log({ adminUser, analyst1, analyst2, tcbarbosa, efCreated });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
