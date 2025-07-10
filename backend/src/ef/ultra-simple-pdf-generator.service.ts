import { Injectable } from '@nestjs/common';
import { FunctionalSpecification } from './entities/ef.entity';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class UltraSimplePdfGeneratorService {

    async generateEfPdf(ef: FunctionalSpecification): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                console.log('Iniciando geração de PDF para EF:', ef.cardNumber);

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
                    console.log(`PDF gerado com sucesso. Tamanho: ${finalBuffer.length} bytes`);
                    resolve(finalBuffer);
                });

                doc.on('error', (error) => {
                    console.error('Erro na geração do PDF:', error);
                    reject(error);
                });

                // Conteúdo simples e direto
                doc.fontSize(18).text('ESPECIFICAÇÃO FUNCIONAL', { align: 'center' });
                doc.moveDown(1);

                doc.fontSize(12).text(`Card: ${ef.cardNumber}`);
                doc.text(`Projeto: ${ef.projectName}`);
                doc.text(`Analista: ${ef.technicalAnalyst}`);
                doc.text(`Autor: ${ef.author}`);
                doc.text(`Status: ${ef.status}`);
                doc.text(`Data: ${new Date(ef.date).toLocaleDateString('pt-BR')}`);

                doc.moveDown(1);
                doc.fontSize(14).text('DESCRIÇÃO DO DESENVOLVIMENTO');
                doc.moveDown(0.5);
                doc.fontSize(10).text(ef.developmentDescription || 'Não informado');

                doc.moveDown(1);
                doc.fontSize(14).text('ESPECIFICAÇÃO FUNCIONAL');
                doc.moveDown(0.5);
                doc.fontSize(10).text(ef.functionalSpecification || 'Não informado');

                doc.moveDown(1);
                doc.fontSize(14).text('DESCRIÇÃO DA MUDANÇA');
                doc.moveDown(0.5);
                doc.fontSize(10).text(ef.changeDescription || 'Não informado');

                // Requests
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

                // Rodapé
                doc.moveDown(2);
                doc.fontSize(8).text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

                // Finalizar
                doc.end();

            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                reject(error);
            }
        });
    }
}
