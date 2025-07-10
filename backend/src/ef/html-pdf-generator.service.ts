import { Injectable } from '@nestjs/common';
import { FunctionalSpecification } from './entities/ef.entity';
import * as pdf from 'html-pdf';
import * as path from 'path';

@Injectable()
export class HtmlPdfGeneratorService {

    async generateEfPdf(ef: FunctionalSpecification): Promise<Buffer> {
        const html = this.generateHtml(ef);

        const options: pdf.CreateOptions = {
            format: 'A4',
            border: {
                top: '1in',
                right: '0.5in',
                bottom: '1in',
                left: '0.5in'
            },
            header: {
                height: '45mm',
                contents: `
          <div style="text-align: center; color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">ESPECIFICAÇÃO FUNCIONAL</h1>
            <p style="margin: 5px 0; font-size: 14px;">Card: ${ef.cardNumber} | Projeto: ${ef.projectName}</p>
            <p style="margin: 0; font-size: 12px; color: #7f8c8d;">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        `
            },
            footer: {
                height: '20mm',
                contents: {
                    default: `
            <div style="text-align: center; color: #95a5a6; font-size: 10px; border-top: 1px solid #bdc3c7; padding-top: 5px;">
              <p>Documento gerado automaticamente pelo Sistema SpecFlow | Página {{page}} de {{pages}}</p>
            </div>
          `
                }
            }
        };

        return new Promise((resolve, reject) => {
            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
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
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #2c3e50;
            margin: 0;
            padding: 20px;
          }
          
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          
          .section-title {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 5px;
            margin-bottom: 15px;
          }
          
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          
          .info-table td {
            padding: 8px 12px;
            border: 1px solid #bdc3c7;
            vertical-align: top;
          }
          
          .info-table td:first-child {
            background-color: #ecf0f1;
            font-weight: bold;
            width: 25%;
          }
          
          .field {
            margin-bottom: 15px;
          }
          
          .field-label {
            font-weight: bold;
            color: #2980b9;
            margin-bottom: 5px;
          }
          
          .field-value {
            background-color: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #3498db;
            border-radius: 3px;
            white-space: pre-wrap;
          }
          
          .requests-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          
          .requests-table th {
            background-color: #3498db;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
          }
          
          .requests-table td {
            padding: 8px 10px;
            border: 1px solid #bdc3c7;
            vertical-align: top;
          }
          
          .requests-table tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          
          .files-list {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #f39c12;
          }
          
          .file-item {
            margin-bottom: 8px;
            padding: 5px 0;
          }
          
          .file-name {
            font-weight: bold;
            color: #2c3e50;
          }
          
          .file-info {
            font-size: 10px;
            color: #7f8c8d;
            margin-left: 15px;
          }
          
          .cutover-section {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
          }
          
          .cutover-title {
            color: #856404;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
            text-align: center;
            background-color: #ffeaa7;
            padding: 8px;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
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
        return `
      <div class="section">
        <div class="section-title">📋 INFORMAÇÕES BÁSICAS</div>
        <table class="info-table">
          <tr><td>N° do Card:</td><td>${ef.cardNumber}</td></tr>
          <tr><td>Nome do Projeto:</td><td>${ef.projectName}</td></tr>
          <tr><td>Analista Técnico:</td><td>${ef.technicalAnalyst}</td></tr>
          <tr><td>GMUD:</td><td>${ef.gmud || 'N/A'}</td></tr>
          <tr><td>Data:</td><td>${new Date(ef.date).toLocaleDateString('pt-BR')}</td></tr>
          <tr><td>Versão:</td><td>${ef.version}</td></tr>
          <tr><td>Ambiente:</td><td>${ef.developmentEnvironment}</td></tr>
          <tr><td>Autor:</td><td>${ef.author}</td></tr>
          <tr><td>Status:</td><td><strong>${ef.status}</strong></td></tr>
          ${ef.comment ? `<tr><td>Comentário:</td><td>${ef.comment}</td></tr>` : ''}
        </table>
      </div>
    `;
    }

    private generateSpecificationsSection(ef: FunctionalSpecification): string {
        return `
      <div class="section">
        <div class="section-title">📝 ESPECIFICAÇÕES</div>
        
        <div class="field">
          <div class="field-label">Descrição do Desenvolvimento:</div>
          <div class="field-value">${ef.developmentDescription}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Especificação Funcional:</div>
          <div class="field-value">${ef.functionalSpecification}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Descrição da Mudança:</div>
          <div class="field-value">${ef.changeDescription}</div>
        </div>
        
        ${ef.order ? `
        <div class="field">
          <div class="field-label">Ordem:</div>
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
          <p style="color: #7f8c8d; font-style: italic;">Nenhuma request cadastrada.</p>
        </div>
      `;
        }

        const requestsRows = ef.requests.map(req => `
      <tr>
        <td>${req.description}</td>
        <td style="text-align: center;">${req.priority || 'N/A'}</td>
      </tr>
    `).join('');

        return `
      <div class="section">
        <div class="section-title">🔧 REQUESTS</div>
        <table class="requests-table">
          <thead>
            <tr>
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
        <table class="info-table">
          <tr>
            <td>Data/Horário de Início:</td>
            <td>${new Date(ef.startDateTime).toLocaleString('pt-BR')}</td>
          </tr>
          <tr>
            <td>Data/Horário de Fim:</td>
            <td>${ef.endDateTime ? new Date(ef.endDateTime).toLocaleString('pt-BR') : 'N/A'}</td>
          </tr>
        </table>
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
            <div class="field-label">Objetivo do Cutover:</div>
            <div class="field-value">${ef.cutoverObjective}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverTimeline ? `
          <div class="field">
            <div class="field-label">Timeline e Cronograma:</div>
            <div class="field-value">${ef.cutoverTimeline}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverDetailedActivities ? `
          <div class="field">
            <div class="field-label">Atividades Detalhadas:</div>
            <div class="field-value">${ef.cutoverDetailedActivities}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverPreChecklistActivities ? `
          <div class="field">
            <div class="field-label">Checklist de Pré-Cutover:</div>
            <div class="field-value">${ef.cutoverPreChecklistActivities}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverCommunicationPlan ? `
          <div class="field">
            <div class="field-label">Plano de Comunicação:</div>
            <div class="field-value">${ef.cutoverCommunicationPlan}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverTeamsAndResponsibilities ? `
          <div class="field">
            <div class="field-label">Equipes e Responsabilidades:</div>
            <div class="field-value">${ef.cutoverTeamsAndResponsibilities}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverContingencyPlan ? `
          <div class="field">
            <div class="field-label">Plano de Contingência:</div>
            <div class="field-value">${ef.cutoverContingencyPlan}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverSuccessCriteria ? `
          <div class="field">
            <div class="field-label">Critérios de Sucesso / Go-Live:</div>
            <div class="field-value">${ef.cutoverSuccessCriteria}</div>
          </div>
          ` : ''}
          
          ${ef.cutoverPostGoLiveSupport ? `
          <div class="field">
            <div class="field-label">Suporte Pós-Go-Live:</div>
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
          <p style="color: #7f8c8d; font-style: italic;">Nenhum arquivo anexado.</p>
        </div>
      `;
        }

        const filesList = ef.files.map((file, index) => `
      <div class="file-item">
        <div class="file-name">${index + 1}. ${file.originalName}</div>
        <div class="file-info">
          Tipo: ${file.mimetype} | Tamanho: ${this.formatFileSize(file.size)}
        </div>
      </div>
    `).join('');

        return `
      <div class="section">
        <div class="section-title">📎 ARQUIVOS ANEXADOS</div>
        <div class="files-list">
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
