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

    console.log('Seed executado com sucesso!');
    console.log({ adminUser, analyst1, analyst2 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
