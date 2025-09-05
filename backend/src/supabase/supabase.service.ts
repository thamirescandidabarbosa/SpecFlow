import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    
    // Só inicializa se as credenciais estiverem configuradas
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.logger.log('Supabase client initialized successfully');
    } else {
      this.logger.warn('Supabase not configured - using local storage');
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase não configurado. Configure SUPABASE_URL e SUPABASE_ANON_KEY');
    }
    return this.supabase;
  }

  isConfigured(): boolean {
    return !!this.supabase;
  }

  // Método para upload de arquivos
  async uploadFile(bucket: string, fileName: string, file: Buffer, contentType: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType,
        upsert: true
      });

    if (error) {
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }

    return data;
  }

  // Método para baixar arquivos
  async downloadFile(bucket: string, fileName: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(fileName);

    if (error) {
      throw new Error(`Erro ao baixar arquivo: ${error.message}`);
    }

    return data;
  }

  // Método para listar arquivos
  async listFiles(bucket: string, folder?: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      throw new Error(`Erro ao listar arquivos: ${error.message}`);
    }

    return data;
  }

  // Método para deletar arquivos
  async deleteFile(bucket: string, fileName: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }

    return data;
  }
}
