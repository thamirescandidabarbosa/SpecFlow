import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { FunctionalSpecification } from './entities/ef.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfGeneratorService {
    private readonly logoPath = path.join(process.cwd(), 'assets', 'logo.png');

    async generateEfPdf(ef: FunctionalSpecification): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 50,
                    info: {
                        Title: `Especificação Funcional - ${ef.cardNumber}`,
                        Author: ef.author_user?.username || ef.author,
                        Subject: 'Especificação Funcional',
                        Creator: 'SpecFlow System',
                        Producer: 'SpecFlow System',
                    }
                });

                const buffers: Buffer[] = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                // Cabeçalho do documento
                this.addHeader(doc, ef);

                // Seções do documento
                this.addBasicInfo(doc, ef);
                this.addSpecifications(doc, ef);
                this.addRequests(doc, ef);
                this.addSchedule(doc, ef);

                // Cutover Plan se incluído
                if (ef.includeCutoverPlan) {
                    this.addCutoverPlan(doc, ef);
                }

                // Arquivos anexados
                this.addAttachedFiles(doc, ef);

                // Rodapé
                this.addFooter(doc, ef);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private addHeader(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        // Título principal
        doc.fontSize(20)
            .font('Helvetica-Bold')
            .fillColor('#2c3e50')
            .text('ESPECIFICAÇÃO FUNCIONAL', 50, 50, { align: 'center' });

        // Linha divisória
        doc.moveTo(50, 85)
            .lineTo(545, 85)
            .strokeColor('#3498db')
            .lineWidth(2)
            .stroke();

        // Informações do cabeçalho
        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('#34495e')
            .text(`Card: ${ef.cardNumber}`, 50, 100)
            .text(`Projeto: ${ef.projectName}`, 300, 100)
            .text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 50, 115)
            .text(`Versão: ${ef.version}`, 300, 115);

        doc.moveDown(2);
    }

    private addBasicInfo(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        const startY = doc.y;

        // Título da seção
        this.addSectionTitle(doc, '📋 INFORMAÇÕES BÁSICAS');

        // Tabela de informações básicas
        const basicInfo = [
            ['N° do Card:', ef.cardNumber],
            ['Nome do Projeto:', ef.projectName],
            ['Analista Técnico:', ef.technicalAnalyst],
            ['GMUD:', ef.gmud || 'N/A'],
            ['Data:', new Date(ef.date).toLocaleDateString('pt-BR')],
            ['Versão:', ef.version],
            ['Ambiente de Desenvolvimento:', ef.developmentEnvironment],
            ['Autor:', ef.author],
            ['Status:', ef.status],
            ['Comentário:', ef.comment || 'N/A'],
        ];

        this.addTable(doc, basicInfo);
        doc.moveDown(1);
    }

    private addSpecifications(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        this.addSectionTitle(doc, '📝 ESPECIFICAÇÕES');

        // Descrição do Desenvolvimento
        this.addField(doc, 'Descrição do Desenvolvimento:', ef.developmentDescription);

        // Especificação Funcional
        this.addField(doc, 'Especificação Funcional:', ef.functionalSpecification);

        // Descrição da Mudança
        this.addField(doc, 'Descrição da Mudança:', ef.changeDescription);

        // Ordem (se houver)
        if (ef.order) {
            this.addField(doc, 'Ordem:', ef.order);
        }

        doc.moveDown(1);
    }

    private addRequests(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        this.addSectionTitle(doc, '🔧 REQUESTS');

        if (ef.requests && ef.requests.length > 0) {
            // Cabeçalho da tabela
            const tableHeaders = ['Descrição', 'Prioridade'];
            const tableData = ef.requests.map(req => [
                req.description,
                req.priority || 'N/A'
            ]);

            this.addTableWithHeaders(doc, tableHeaders, tableData);
        } else {
            doc.fontSize(10)
                .fillColor('#7f8c8d')
                .text('Nenhuma request cadastrada.', 70);
        }

        doc.moveDown(1);
    }

    private addSchedule(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        this.addSectionTitle(doc, '📅 CRONOGRAMA');

        const scheduleInfo = [
            ['Data/Horário de Início:', new Date(ef.startDateTime).toLocaleString('pt-BR')],
            ['Data/Horário de Fim:', ef.endDateTime ? new Date(ef.endDateTime).toLocaleString('pt-BR') : 'N/A'],
        ];

        this.addTable(doc, scheduleInfo);
        doc.moveDown(1);
    }

    private addCutoverPlan(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        this.addSectionTitle(doc, '🚀 PLANO DE CUTOVER');

        const cutoverFields = [
            ['Objetivo do Cutover:', ef.cutoverObjective],
            ['Timeline e Cronograma:', ef.cutoverTimeline],
            ['Atividades Detalhadas:', ef.cutoverDetailedActivities],
            ['Checklist de Pré-Cutover:', ef.cutoverPreChecklistActivities],
            ['Plano de Comunicação:', ef.cutoverCommunicationPlan],
            ['Equipes e Responsabilidades:', ef.cutoverTeamsAndResponsibilities],
            ['Plano de Contingência:', ef.cutoverContingencyPlan],
            ['Critérios de Sucesso / Go-Live:', ef.cutoverSuccessCriteria],
            ['Suporte Pós-Go-Live:', ef.cutoverPostGoLiveSupport],
        ];

        cutoverFields.forEach(([label, value]) => {
            if (value) {
                this.addField(doc, label, value);
            }
        });

        doc.moveDown(1);
    }

    private addAttachedFiles(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        this.addSectionTitle(doc, '📎 ARQUIVOS ANEXADOS');

        if (ef.files && ef.files.length > 0) {
            ef.files.forEach((file, index) => {
                doc.fontSize(10)
                    .fillColor('#2c3e50')
                    .text(`${index + 1}. ${file.originalName}`, 70)
                    .fontSize(9)
                    .fillColor('#7f8c8d')
                    .text(`   Tipo: ${file.mimetype} | Tamanho: ${this.formatFileSize(file.size)}`, 70);
                doc.moveDown(0.3);
            });
        } else {
            doc.fontSize(10)
                .fillColor('#7f8c8d')
                .text('Nenhum arquivo anexado.', 70);
        }

        doc.moveDown(1);
    }

    private addFooter(doc: PDFKit.PDFDocument, ef: FunctionalSpecification) {
        const pageHeight = doc.page.height;

        doc.fontSize(8)
            .fillColor('#95a5a6')
            .text(
                `Documento gerado automaticamente pelo Sistema SpecFlow em ${new Date().toLocaleString('pt-BR')}`,
                50,
                pageHeight - 40,
                { align: 'center' }
            );
    }

    private addSectionTitle(doc: PDFKit.PDFDocument, title: string) {
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .fillColor('#2980b9')
            .text(title, 50);

        // Linha decorativa
        doc.moveTo(50, doc.y + 5)
            .lineTo(200, doc.y + 5)
            .strokeColor('#3498db')
            .lineWidth(1)
            .stroke();

        doc.moveDown(0.8);
    }

    private addField(doc: PDFKit.PDFDocument, label: string, value: string) {
        const maxWidth = 500;
        const lineHeight = 12;

        // Label
        doc.fontSize(10)
            .font('Helvetica-Bold')
            .fillColor('#2c3e50')
            .text(label, 70);

        // Value (com quebra de linha automática)
        doc.fontSize(9)
            .font('Helvetica')
            .fillColor('#34495e')
            .text(value, 70, doc.y + 2, {
                width: maxWidth,
                align: 'justify'
            });

        doc.moveDown(0.8);
    }

    private addTable(doc: PDFKit.PDFDocument, data: string[][]) {
        const startX = 70;
        const startY = doc.y;
        const rowHeight = 20;
        const col1Width = 150;
        const col2Width = 300;

        data.forEach((row, index) => {
            const currentY = startY + (index * rowHeight);

            // Fundo alternado
            if (index % 2 === 0) {
                doc.rect(startX - 10, currentY - 2, col1Width + col2Width + 20, rowHeight)
                    .fillColor('#f8f9fa')
                    .fill();
            }

            // Coluna 1 (Label)
            doc.fontSize(9)
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text(row[0], startX, currentY + 5, { width: col1Width });

            // Coluna 2 (Value)
            doc.fontSize(9)
                .font('Helvetica')
                .fillColor('#34495e')
                .text(row[1], startX + col1Width + 10, currentY + 5, { width: col2Width });
        });

        doc.y = startY + (data.length * rowHeight) + 10;
    }

    private addTableWithHeaders(doc: PDFKit.PDFDocument, headers: string[], data: string[][]) {
        const startX = 70;
        const startY = doc.y;
        const rowHeight = 18;
        const colWidth = 200;

        // Cabeçalho
        doc.rect(startX - 5, startY, colWidth * headers.length + 10, rowHeight)
            .fillColor('#3498db')
            .fill();

        headers.forEach((header, index) => {
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('white')
                .text(header, startX + (index * colWidth), startY + 5, { width: colWidth - 10 });
        });

        // Dados
        data.forEach((row, rowIndex) => {
            const currentY = startY + ((rowIndex + 1) * rowHeight);

            if (rowIndex % 2 === 0) {
                doc.rect(startX - 5, currentY, colWidth * headers.length + 10, rowHeight)
                    .fillColor('#f8f9fa')
                    .fill();
            }

            row.forEach((cell, colIndex) => {
                doc.fontSize(9)
                    .font('Helvetica')
                    .fillColor('#2c3e50')
                    .text(cell, startX + (colIndex * colWidth), currentY + 5, { width: colWidth - 10 });
            });
        });

        doc.y = startY + ((data.length + 1) * rowHeight) + 10;
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
