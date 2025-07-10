import { Injectable } from '@nestjs/common';
import { FunctionalSpecification } from './entities/ef.entity';
import { PuppeteerPdfGeneratorService } from './puppeteer-pdf-generator.service';
import { HtmlPdfGeneratorService } from './html-pdf-generator.service';
import { CompatiblePdfGeneratorService } from './compatible-pdf-generator.service';

export enum PdfGeneratorType {
    PUPPETEER = 'puppeteer',
    HTML_PDF = 'html-pdf',
    COMPATIBLE = 'compatible'
}

@Injectable()
export class UnifiedPdfGeneratorService {
    constructor(
        private readonly puppeteerPdfGenerator: PuppeteerPdfGeneratorService,
        private readonly htmlPdfGenerator: HtmlPdfGeneratorService,
        private readonly compatiblePdfGenerator: CompatiblePdfGeneratorService
    ) { }

    async generateEfPdf(
        ef: FunctionalSpecification,
        generatorType: PdfGeneratorType = PdfGeneratorType.PUPPETEER
    ): Promise<Buffer> {
        try {
            switch (generatorType) {
                case PdfGeneratorType.PUPPETEER:
                    console.log('🚀 Gerando PDF com Puppeteer (Moderno e Seguro)');
                    return await this.puppeteerPdfGenerator.generateEfPdf(ef);

                case PdfGeneratorType.HTML_PDF:
                    console.log('📄 Gerando PDF com html-pdf (Compatibilidade)');
                    return await this.htmlPdfGenerator.generateEfPdf(ef);

                case PdfGeneratorType.COMPATIBLE:
                    console.log('🔧 Gerando PDF com gerador compatível');
                    return await this.compatiblePdfGenerator.generateEfPdf(ef);

                default:
                    console.log('⚠️ Tipo de gerador não reconhecido, usando Puppeteer como padrão');
                    return await this.puppeteerPdfGenerator.generateEfPdf(ef);
            }
        } catch (error) {
            console.error(`❌ Erro ao gerar PDF com ${generatorType}:`, error);

            // Fallback: tenta com outro gerador
            if (generatorType === PdfGeneratorType.PUPPETEER) {
                console.log('🔄 Tentando fallback para html-pdf...');
                try {
                    return await this.htmlPdfGenerator.generateEfPdf(ef);
                } catch (fallbackError) {
                    console.error('❌ Erro no fallback html-pdf:', fallbackError);
                    console.log('🔄 Tentando fallback final para gerador compatível...');
                    return await this.compatiblePdfGenerator.generateEfPdf(ef);
                }
            } else if (generatorType === PdfGeneratorType.HTML_PDF) {
                console.log('🔄 Tentando fallback para gerador compatível...');
                return await this.compatiblePdfGenerator.generateEfPdf(ef);
            } else {
                throw error; // Se já é o último fallback, propaga o erro
            }
        }
    }

    /**
     * Método de conveniência para gerar PDF com o gerador mais moderno (Puppeteer)
     */
    async generateModernPdf(ef: FunctionalSpecification): Promise<Buffer> {
        return this.generateEfPdf(ef, PdfGeneratorType.PUPPETEER);
    }

    /**
     * Método de conveniência para gerar PDF com máxima compatibilidade
     */
    async generateCompatiblePdf(ef: FunctionalSpecification): Promise<Buffer> {
        return this.generateEfPdf(ef, PdfGeneratorType.COMPATIBLE);
    }

    /**
     * Método de conveniência para gerar PDF com html-pdf (legacy)
     */
    async generateLegacyPdf(ef: FunctionalSpecification): Promise<Buffer> {
        return this.generateEfPdf(ef, PdfGeneratorType.HTML_PDF);
    }

    /**
     * Verifica se o Puppeteer está disponível
     */
    async checkPuppeteerAvailability(): Promise<boolean> {
        try {
            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({ headless: true });
            await browser.close();
            return true;
        } catch (error) {
            console.log('⚠️ Puppeteer não está disponível:', error.message);
            return false;
        }
    }

    /**
     * Retorna o gerador recomendado baseado na disponibilidade
     */
    async getRecommendedGenerator(): Promise<PdfGeneratorType> {
        const isPuppeteerAvailable = await this.checkPuppeteerAvailability();

        if (isPuppeteerAvailable) {
            console.log('✅ Puppeteer disponível - usando gerador moderno');
            return PdfGeneratorType.PUPPETEER;
        } else {
            console.log('⚠️ Puppeteer não disponível - usando gerador compatível');
            return PdfGeneratorType.COMPATIBLE;
        }
    }
}
