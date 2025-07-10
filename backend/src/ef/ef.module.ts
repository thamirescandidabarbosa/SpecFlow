import { Module } from '@nestjs/common';
import { EfService } from './ef.service';
import { EfController } from './ef.controller';
import { SimplePdfGeneratorService } from './simple-pdf-generator.service';
import { UltraSimplePdfGeneratorService } from './ultra-simple-pdf-generator.service';
import { CompatiblePdfGeneratorService } from './compatible-pdf-generator.service';
import { HtmlPdfGeneratorService } from './html-pdf-generator.service';
import { PuppeteerPdfGeneratorService } from './puppeteer-pdf-generator.service';
import { UnifiedPdfGeneratorService } from './unified-pdf-generator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EfController],
    providers: [
        EfService,
        SimplePdfGeneratorService,
        UltraSimplePdfGeneratorService,
        CompatiblePdfGeneratorService,
        HtmlPdfGeneratorService,
        PuppeteerPdfGeneratorService,
        UnifiedPdfGeneratorService
    ],
    exports: [EfService, UnifiedPdfGeneratorService],
})
export class EfModule { }
