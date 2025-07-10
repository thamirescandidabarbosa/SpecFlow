import { Injectable } from '@nestjs/common';
import { FunctionalSpecification } from './entities/ef.entity';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerPdfGeneratorService {

    async generateEfPdf(ef: FunctionalSpecification): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            const html = this.generateHtml(ef);

            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdf = await page.pdf({
                format: 'A4',
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm'
                },
                displayHeaderFooter: true,
                headerTemplate: `
                    <div style="width: 100%; font-size: 10px; padding: 5px 20px; color: #666; border-bottom: 1px solid #ccc;">
                        <div style="text-align: center;">
                            <strong>ESPECIFICAÇÃO FUNCIONAL - Card: ${ef.cardNumber} | Projeto: ${ef.projectName}</strong>
                        </div>
                    </div>
                `,
                footerTemplate: `
                    <div style="width: 100%; font-size: 9px; padding: 5px 20px; color: #666; border-top: 1px solid #ccc; text-align: center;">
                        <span>Documento gerado automaticamente pelo Sistema SpecFlow | Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
                    </div>
                `,
                printBackground: true
            });

            return Buffer.from(pdf);
        } finally {
            await browser.close();
        }
    }

    private generateHtml(ef: FunctionalSpecification): string {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Especificação Funcional - ${ef.cardNumber}</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #2c3e50;
            margin: 0;
            padding: 20px;
            background-color: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #3498db;
          }
          
          .header h1 {
            color: #2c3e50;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: bold;
          }
          
          .header .subtitle {
            color: #7f8c8d;
            font-size: 14px;
            margin: 5px 0;
          }
          
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          .section-title {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .info-item {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #3498db;
          }
          
          .info-label {
            font-weight: bold;
            color: #2980b9;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
          }
          
          .info-value {
            color: #2c3e50;
            font-size: 13px;
            word-wrap: break-word;
          }
          
          .field {
            margin-bottom: 20px;
          }
          
          .field-label {
            font-weight: bold;
            color: #2980b9;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .field-value {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #3498db;
            border-radius: 4px;
            white-space: pre-wrap;
            line-height: 1.6;
          }
          
          .requests-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .requests-table th {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
            font-size: 13px;
          }
          
          .requests-table td {
            padding: 12px;
            border: 1px solid #e0e0e0;
            vertical-align: top;
            font-size: 12px;
          }
          
          .requests-table tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          
          .requests-table tr:hover {
            background-color: #e3f2fd;
          }
          
          .files-section {
            background-color: #fff3e0;
            padding: 20px;
            border-radius: 8px;
            border-left: 6px solid #ff9800;
          }
          
          .file-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .file-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            color: #ff9800;
          }
          
          .file-name {
            font-weight: bold;
            color: #2c3e50;
            flex-grow: 1;
          }
          
          .file-info {
            font-size: 10px;
            color: #7f8c8d;
            text-align: right;
          }
          
          .cutover-section {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #ffd93d;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .cutover-title {
            color: #b8860b;
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.7);
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #ffd93d;
          }
          
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-ativo {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          
          .status-inativo {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          
          .status-pendente {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
          }
          
          .no-data {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
            padding: 30px;
            background-color: #f8f9fa;
            border-radius: 6px;
            border: 2px dashed #dee2e6;
          }
          
          @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
            .cutover-section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 ESPECIFICAÇÃO FUNCIONAL</h1>
          <div class="subtitle">Card: ${ef.cardNumber} | Projeto: ${ef.projectName}</div>
          <div class="subtitle">Gerado em: ${new Date().toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</div>
        </div>

        ${this.generateBasicInfoSection(ef)}
        ${this.generateSpecificationsSection(ef)}
        ${this.generateRequestsSection(ef)}
        ${this.generateScheduleSection(ef)}
        ${ef.includeCutoverPlan ? this.generateCutoverPlanSection(ef) : ''}
        ${this.generateFilesSection(ef)}
      </body>
      </html>
    `;
    }

    private generateBasicInfoSection(ef: FunctionalSpecification): string {
        const statusClass = ef.status?.toLowerCase().includes('ativo') ? 'status-ativo' :
            ef.status?.toLowerCase().includes('inativo') ? 'status-inativo' :
                'status-pendente';

        return `
      <div class="section">
        <div class="section-title">📋 INFORMAÇÕES BÁSICAS</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">N° do Card</div>
            <div class="info-value">${ef.cardNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Nome do Projeto</div>
            <div class="info-value">${ef.projectName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Analista Técnico</div>
            <div class="info-value">${ef.technicalAnalyst}</div>
          </div>
          <div class="info-item">
            <div class="info-label">GMUD</div>
            <div class="info-value">${ef.gmud || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data</div>
            <div class="info-value">${new Date(ef.date).toLocaleDateString('pt-BR')}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Versão</div>
            <div class="info-value">${ef.version}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Ambiente</div>
            <div class="info-value">${ef.developmentEnvironment}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Autor</div>
            <div class="info-value">${ef.author}</div>
          </div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value">
            <span class="status-badge ${statusClass}">${ef.status}</span>
          </div>
        </div>
        
        ${ef.comment ? `
        <div class="info-item" style="margin-top: 15px;">
          <div class="info-label">Comentário</div>
          <div class="info-value">${ef.comment}</div>
        </div>
        ` : ''}
      </div>
    `;
    }

    private generateSpecificationsSection(ef: FunctionalSpecification): string {
        return `
      <div class="section">
        <div class="section-title">📝 ESPECIFICAÇÕES</div>
        
        <div class="field">
          <div class="field-label">🔧 Descrição do Desenvolvimento</div>
          <div class="field-value">${ef.developmentDescription}</div>
        </div>
        
        <div class="field">
          <div class="field-label">📋 Especificação Funcional</div>
          <div class="field-value">${ef.functionalSpecification}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🔄 Descrição da Mudança</div>
          <div class="field-value">${ef.changeDescription}</div>
        </div>
        
        ${ef.order ? `
        <div class="field">
          <div class="field-label">📊 Ordem</div>
          <div class="field-value">${ef.order}</div>
        </div>
        ` : ''}
      </div>
    `;
    }

    private generateRequestsSection(ef: FunctionalSpecification): string {
        if (!ef.requests || ef.requests.length === 0) {
            return `
        <div class="section">
          <div class="section-title">🔧 REQUESTS</div>
          <div class="no-data">
            📝 Nenhuma request cadastrada para este projeto.
          </div>
        </div>
      `;
        }

        const requestsRows = ef.requests.map((req, index) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${index + 1}</td>
        <td>${req.description}</td>
        <td style="text-align: center;">
          <span class="status-badge ${req.priority?.toLowerCase() === 'alta' ? 'status-inativo' :
                req.priority?.toLowerCase() === 'média' ? 'status-pendente' :
                    'status-ativo'}">
            ${req.priority || 'Normal'}
          </span>
        </td>
      </tr>
    `).join('');

        return `
      <div class="section">
        <div class="section-title">🔧 REQUESTS</div>
        <table class="requests-table">
          <thead>
            <tr>
              <th style="width: 50px;">#</th>
              <th>Descrição</th>
              <th style="width: 120px;">Prioridade</th>
            </tr>
          </thead>
          <tbody>
            ${requestsRows}
          </tbody>
        </table>
      </div>
    `;
    }

    private generateScheduleSection(ef: FunctionalSpecification): string {
        return `
      <div class="section">
        <div class="section-title">📅 CRONOGRAMA</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">⏰ Data/Horário de Início</div>
            <div class="info-value">${new Date(ef.startDateTime).toLocaleString('pt-BR')}</div>
          </div>
          <div class="info-item">
            <div class="info-label">🏁 Data/Horário de Fim</div>
            <div class="info-value">${ef.endDateTime ? new Date(ef.endDateTime).toLocaleString('pt-BR') : 'A definir'}</div>
          </div>
        </div>
      </div>
    `;
    }

    private generateCutoverPlanSection(ef: FunctionalSpecification): string {
        return `
      <div class="section">
        <div class="cutover-section">
          <div class="cutover-title">🚀 PLANO DE CUTOVER</div>
          
          ${ef.cutoverObjective ? `
          <div class="field">
            <div class="field-label">🎯 Objetivo do Cutover</div>
            <div class="field-value">${ef.cutoverObjective}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverTimeline ? `
          <div class="field">
            <div class="field-label">⏱️ Timeline e Cronograma</div>
            <div class="field-value">${ef.cutoverTimeline}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverDetailedActivities ? `
          <div class="field">
            <div class="field-label">📋 Atividades Detalhadas</div>
            <div class="field-value">${ef.cutoverDetailedActivities}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverPreChecklistActivities ? `
          <div class="field">
            <div class="field-label">✅ Checklist de Pré-Cutover</div>
            <div class="field-value">${ef.cutoverPreChecklistActivities}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverCommunicationPlan ? `
          <div class="field">
            <div class="field-label">📢 Plano de Comunicação</div>
            <div class="field-value">${ef.cutoverCommunicationPlan}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverTeamsAndResponsibilities ? `
          <div class="field">
            <div class="field-label">👥 Equipes e Responsabilidades</div>
            <div class="field-value">${ef.cutoverTeamsAndResponsibilities}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverContingencyPlan ? `
          <div class="field">
            <div class="field-label">🛡️ Plano de Contingência</div>
            <div class="field-value">${ef.cutoverContingencyPlan}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverSuccessCriteria ? `
          <div class="field">
            <div class="field-label">🏆 Critérios de Sucesso / Go-Live</div>
            <div class="field-value">${ef.cutoverSuccessCriteria}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverPostGoLiveSupport ? `
          <div class="field">
            <div class="field-label">🔧 Suporte Pós-Go-Live</div>
            <div class="field-value">${ef.cutoverPostGoLiveSupport}</div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
    }

    private generateFilesSection(ef: FunctionalSpecification): string {
        if (!ef.files || ef.files.length === 0) {
            return `
        <div class="section">
          <div class="section-title">📎 ARQUIVOS ANEXADOS</div>
          <div class="no-data">
            📎 Nenhum arquivo foi anexado a esta especificação.
          </div>
        </div>
      `;
        }

        const filesList = ef.files.map((file, index) => `
      <div class="file-item">
        <div class="file-icon">📄</div>
        <div class="file-name">${index + 1}. ${file.originalName}</div>
        <div class="file-info">
          ${file.mimetype}<br>
          ${this.formatFileSize(file.size)}
        </div>
      </div>
    `).join('');

        return `
      <div class="section">
        <div class="section-title">📎 ARQUIVOS ANEXADOS</div>
        <div class="files-section">
          ${filesList}
        </div>
      </div>
    `;
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
