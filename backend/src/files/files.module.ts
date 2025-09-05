import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [
        MulterModule.register({
            storage: null, // Use memory storage for Supabase
        }),
        SupabaseModule,
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule { }
