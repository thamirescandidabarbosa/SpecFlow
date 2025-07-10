import { Injectable } from '@nestjs/common';
import { FunctionalSpecification } from './entities/ef.entity';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class SimplePdfGeneratorService {

    async generateEfPdf(ef: FunctionalSpecification): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4',
                    info: {
                        Title: `EF-${ef.cardNumber}`,
                        Author: ef.author,
                        Subject: 'Especificação Funcional',
                        Keywords: 'EF, Especificação, Funcional'
                    }
                });

                const buffers: Buffer[] = [];

                doc.on('data', (buffer) => buffers.push(buffer));
                doc.on('end', () => {
                    const finalBuffer = Buffer.concat(buffers);
                    console.log(`PDF gerado com sucesso. Tamanho: ${finalBuffer.length} bytes`);
                    resolve(finalBuffer);
                });
                doc.on('error', (error) => {
                    console.error('Erro na geração do PDF:', error);
                    reject(error);
                });

                // Cabeçalho
                doc.fontSize(20)
                    .text('ESPECIFICAÇÃO FUNCIONAL', { align: 'center' });

                doc.moveDown(0.5);
                doc.fontSize(14)
                    .text(`Card: ${ef.cardNumber} | Projeto: ${ef.projectName}`, { align: 'center' });

                doc.moveDown(0.5);
                doc.fontSize(10)
                    .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, { align: 'center' });

                // Linha separadora
                doc.moveDown(1);
                doc.moveTo(50, doc.y)
                    .lineTo(545, doc.y)
                    .stroke();
                doc.moveDown(1);

                // Informações básicas
                this.addSection(doc, 'INFORMAÇÕES BÁSICAS');
                this.addKeyValue(doc, 'Número do Card', ef.cardNumber);
                this.addKeyValue(doc, 'Nome do Projeto', ef.projectName);
                this.addKeyValue(doc, 'Analista Técnico', ef.technicalAnalyst);
                this.addKeyValue(doc, 'GMUD', ef.gmud || 'N/A');
                this.addKeyValue(doc, 'Data', new Date(ef.date).toLocaleDateString('pt-BR'));
                this.addKeyValue(doc, 'Versão', ef.version);
                this.addKeyValue(doc, 'Ambiente', ef.developmentEnvironment);
                this.addKeyValue(doc, 'Status', ef.status);
                this.addKeyValue(doc, 'Autor', ef.author);

                // Datas de início e fim
                if (ef.startDateTime) {
                    this.addKeyValue(doc, 'Data de Início', new Date(ef.startDateTime).toLocaleString('pt-BR'));
                }
                if (ef.endDateTime) {
                    this.addKeyValue(doc, 'Data de Fim', new Date(ef.endDateTime).toLocaleString('pt-BR'));
                }

                // Seções principais
                this.addSection(doc, 'DESCRIÇÃO DO DESENVOLVIMENTO');
                this.addTextContent(doc, ef.developmentDescription);

                this.addSection(doc, 'ESPECIFICAÇÃO FUNCIONAL');
                this.addTextContent(doc, ef.functionalSpecification);

                this.addSection(doc, 'DESCRIÇÃO DA MUDANÇA');
                this.addTextContent(doc, ef.changeDescription);

                // Requests
                if (ef.requests && ef.requests.length > 0) {
                    this.addSection(doc, 'REQUESTS');
                    ef.requests.forEach((request, index) => {
                        doc.fontSize(10)
                            .text(`Request ${index + 1}: ${request.description}`);
                        if (request.priority) {
                            doc.fontSize(9)
                                .text(`Prioridade: ${request.priority}`);
                        }
                        doc.moveDown(0.3);
                    });
                }

                // Cutover Plan
                if (ef.includeCutoverPlan) {
                    this.addSection(doc, 'PLANO DE CUTOVER');
                    if (ef.cutoverObjective) {
                        this.addKeyValue(doc, 'Objetivo', ef.cutoverObjective);
                    }
                    if (ef.cutoverTimeline) {
                        this.addKeyValue(doc, 'Timeline', ef.cutoverTimeline);
                    }
                    if (ef.cutoverDetailedActivities) {
                        this.addKeyValue(doc, 'Atividades Detalhadas', ef.cutoverDetailedActivities);
                    }
                }

                // Rodapé
                doc.moveDown(2);
                doc.moveTo(50, doc.y)
                    .lineTo(545, doc.y)
                    .stroke();
                doc.moveDown(0.5);
                doc.fontSize(8)
                    .text('Documento gerado automaticamente pelo Sistema SpecFlow', { align: 'center' });
                doc.text(`Data de criação: ${new Date(ef.createdAt).toLocaleDateString('pt-BR')}`, { align: 'center' });

                // Finalizar o documento
                doc.end();

            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                reject(error);
            }
        });
    }

    private addSection(doc: any, title: string) {
        doc.moveDown(1);
        doc.fontSize(12)
            .text(title);
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y)
            .lineTo(200, doc.y)
            .stroke();
        doc.moveDown(0.5);
    }

    private addKeyValue(doc: any, key: string, value: string) {
        doc.fontSize(9)
            .text(`${key}: ${value}`);
        doc.moveDown(0.2);
    }

    private addTextContent(doc: any, content: string) {
        doc.fontSize(10)
            .text(content, {
                align: 'justify',
                lineGap: 2
            });
        doc.moveDown(0.5);
    }
}