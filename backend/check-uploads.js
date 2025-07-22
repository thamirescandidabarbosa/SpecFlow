// Script Node.js para listar os arquivos do banco e checar se existem fisicamente na pasta uploads/ef
// Salve este arquivo como check-uploads.js na pasta backend e execute com: node check-uploads.js

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const uploadDir = path.join(__dirname, 'uploads', 'ef');

async function main() {
    const files = await prisma.fileUpload.findMany();
    let missing = 0;
    for (const file of files) {
        const filePath = path.join(uploadDir, file.filename);
        if (!fs.existsSync(filePath)) {
            console.log(`Arquivo ausente: ${file.filename} (original: ${file.originalName})`);
            missing++;
        }
    }
    if (missing === 0) {
        console.log('Todos os arquivos do banco existem na pasta uploads/ef.');
    } else {
        console.log(`Total de arquivos ausentes: ${missing}`);
    }
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
