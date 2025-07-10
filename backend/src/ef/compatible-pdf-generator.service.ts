import { Injectable } from '@nestjs/common';
import { FunctionalSpecification } from './entities/ef.entity';

// Usar require para máxima compatibilidade
const PDFDocument = require('pdfkit');

@Injectable()
export class CompatiblePdfGeneratorService {

    async generateEfPdf(ef: FunctionalSpecification): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                console.log('Iniciando geração de PDF compatível para EF:', ef.cardNumber);

                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4'
                });

                const buffers: Buffer[] = [];

                doc.on('data', (buffer) => {
                    buffers.push(buffer);
                });

                doc.on('end', () => {
                    const finalBuffer = Buffer.concat(buffers);
                    console.log(`PDF compatível gerado com sucesso. Tamanho: ${finalBuffer.length} bytes`);
                    resolve(finalBuffer);
                });

                doc.on('error', (error) => {
                    console.error('Erro na geração do PDF compatível:', error);
                    reject(error);
                });

                // Cabeçalho básico
                doc.fontSize(18)
                    .text('ESPECIFICACAO FUNCIONAL', { align: 'center' });

                doc.moveDown(1);

                // Informações básicas
                doc.fontSize(12)
                    .text(`Card: ${ef.cardNumber}`)
                    .text(`Projeto: ${ef.projectName}`)
                    .text(`Analista: ${ef.technicalAnalyst}`)
                    .text(`Autor: ${ef.author}`)
                    .text(`Status: ${ef.status}`)
                    .text(`Data: ${new Date(ef.date).toLocaleDateString('pt-BR')}`)
                    .text(`Versao: ${ef.version}`)
                    .text(`Ambiente: ${ef.developmentEnvironment}`);

                doc.moveDown(1);

                // Seções principais com texto básico
                doc.fontSize(14).text('DESCRICAO DO DESENVOLVIMENTO');
                doc.moveDown(0.5);
                doc.fontSize(10).text(ef.developmentDescription || 'Nao informado');

                doc.moveDown(1);
                doc.fontSize(14).text('ESPECIFICACAO FUNCIONAL');
                doc.moveDown(0.5);
                doc.fontSize(10).text(ef.functionalSpecification || 'Nao informado');

                doc.moveDown(1);
                doc.fontSize(14).text('DESCRICAO DA MUDANCA');
                doc.moveDown(0.5);
                doc.fontSize(10).text(ef.changeDescription || 'Nao informado');

                // Requests simples
                if (ef.requests && ef.requests.length > 0) {
                    doc.moveDown(1);
                    doc.fontSize(14).text('REQUESTS');
                    doc.moveDown(0.5);

                    ef.requests.forEach((request, index) => {
                        doc.fontSize(10).text(`${index + 1}. ${request.description}`);
                        if (request.priority) {
                            doc.text(`   Prioridade: ${request.priority}`);
                        }
                        doc.moveDown(0.2);
                    });
                }

                // Cutover Plan se incluído
                if (ef.includeCutoverPlan) {
                    doc.moveDown(1);
                    doc.fontSize(14).text('PLANO DE CUTOVER');
                    doc.moveDown(0.5);

                    if (ef.cutoverObjective) {
                        doc.fontSize(10).text(`Objetivo: ${ef.cutoverObjective}`);
                    }
                    if (ef.cutoverTimeline) {
                        doc.text(`Timeline: ${ef.cutoverTimeline}`);
                    }
                    if (ef.cutoverDetailedActivities) {
                        doc.text(`Atividades: ${ef.cutoverDetailedActivities}`);
                    }
                }

                // Anexos se houver
                if (ef.files && ef.files.length > 0) {
                    doc.moveDown(1);
                    doc.fontSize(14).text('ANEXOS');
                    doc.moveDown(0.5);

                    ef.files.forEach((file, index) => {
                        // Gerar token público para o arquivo
                        const crypto = require('crypto');
                        const publicToken = crypto.createHash('md5').update(file.id + 'secret-key-pdf-access').digest('hex').substring(0, 16);
                        
                        doc.fontSize(10)
                            .text(`${index + 1}. ${file.originalName}`)
                            .text(`   Tipo: ${file.mimetype}`)
                            .text(`   Tamanho: ${(file.size / 1024).toFixed(1)} KB`)
                            .text(`   Link para download: http://localhost:3001/api/ef/public/file/${file.id}/${publicToken}`)
                            .text(`   Link para visualizar: http://localhost:3001/api/ef/public/file/${file.id}/${publicToken}/view`)
                            .moveDown(0.3);
                    });

                    // Adicionar nota sobre como acessar os anexos
                    doc.moveDown(0.5);
                    doc.fontSize(8)
                        .text('Nota: Os links acima permitem acesso direto aos anexos. Em caso de problemas,', { continued: true })
                        .text(' acesse o sistema web para visualizar e baixar os arquivos.');
                }

                // Rodapé simples
                doc.moveDown(2);
                doc.fontSize(8)
                    .text(`Gerado automaticamente em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

                // Finalizar documento
                doc.end();

            } catch (error) {
                console.error('Erro ao gerar PDF compatível:', error);
                reject(error);
            }
        });
    }
}
