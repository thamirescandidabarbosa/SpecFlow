import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase?: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseKey = serviceRoleKey || anonKey;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      this.logger.log('Supabase client initialized successfully');
    } else {
      this.logger.warn('Supabase not configured - using local fallback where available');
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase nao configurado. Configure SUPABASE_URL e uma chave valida');
    }
    return this.supabase;
  }

  isConfigured(): boolean {
    return !!this.supabase;
  }

  async uploadFile(bucket: string, fileName: string, file: Buffer, contentType: string): Promise<any> {
    const { data, error } = await this.getClient().storage
      .from(bucket)
      .upload(fileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }

    return data;
  }

  async downloadFile(bucket: string, fileName: string): Promise<any> {
    const { data, error } = await this.getClient().storage
      .from(bucket)
      .download(fileName);

    if (error) {
      throw new Error(`Erro ao baixar arquivo: ${error.message}`);
    }

    return data;
  }

  async deleteFile(bucket: string, fileName: string): Promise<any> {
    const { data, error } = await this.getClient().storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }

    return data;
  }

  getPublicUrl(bucket: string, fileName: string): string {
    const { data } = this.getClient().storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}
