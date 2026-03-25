import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const runtimeUrl = PrismaService.resolveRuntimeDatabaseUrl();

        super({
            datasources: {
                db: {
                    // Prefer the direct connection in runtime when available.
                    url: runtimeUrl,
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    private static resolveRuntimeDatabaseUrl() {
        const directUrl = process.env.DIRECT_URL;
        const databaseUrl = process.env.DATABASE_URL;
        const supabaseUrl = process.env.SUPABASE_URL;
        const candidate = directUrl || databaseUrl;

        if (!candidate) {
            return undefined;
        }

        try {
            const parsed = new URL(candidate);
            const looksLikeSupabasePooler = parsed.hostname.endsWith('.pooler.supabase.com');

            if (!looksLikeSupabasePooler || !supabaseUrl) {
                return PrismaService.ensureSupabaseSsl(candidate);
            }

            const supabaseHost = new URL(supabaseUrl).hostname;
            const projectRef = supabaseHost.replace('.supabase.co', '');

            if (!projectRef) {
                return PrismaService.ensureSupabaseSsl(candidate);
            }

            parsed.hostname = `db.${projectRef}.supabase.co`;
            parsed.port = '5432';
            if (parsed.username.includes('.')) {
                parsed.username = parsed.username.split('.')[0];
            }
            return PrismaService.ensureSupabaseSsl(parsed.toString());
        } catch {
            return PrismaService.ensureSupabaseSsl(candidate);
        }
    }

    private static ensureSupabaseSsl(connectionString: string) {
        try {
            const parsed = new URL(connectionString);
            if (
                parsed.hostname.endsWith('.supabase.co') &&
                !parsed.searchParams.has('sslmode')
            ) {
                parsed.searchParams.set('sslmode', 'require');
            }

            return parsed.toString();
        } catch {
            return connectionString;
        }
    }
}
