/**
 * Serviço para gerenciamento de Especificações Funcionais
 * Desenvolvido por Thamires Candida Barbosa
 * 
 * Este módulo contém todas as operações relacionadas às Especificações Funcionais (EF),
 * incluindo CRUD, upload/download de arquivos e manipulação de anexos.
 */

import api from './api';
import { CreateFunctionalSpecificationRequest, FunctionalSpecification, UpdateFunctionalSpecificationRequest } from '../types';

export const functionalSpecificationService = {
    /**
     * Cria uma nova especificação funcional
     * @param data Dados da especificação a ser criada
     * @returns A especificação criada com ID gerado
     */
    async create(data: CreateFunctionalSpecificationRequest): Promise<FunctionalSpecification> {
        const response = await api.post('/ef', data);
        return response.data;
    },

    /**
     * Retorna todas as especificações funcionais cadastradas
     * @returns Lista de especificações funcionais
     */
    async getAll(): Promise<FunctionalSpecification[]> {
        const response = await api.get('/ef');
        return response.data;
    },

    /**
     * Busca uma especificação funcional pelo seu ID
     * @param id ID da especificação a ser buscada
     * @returns Dados completos da especificação
     */
    async getById(id: string): Promise<FunctionalSpecification> {
        const response = await api.get(`/ef/${id}`);
        return response.data;
    },

    /**
     * Atualiza uma especificação funcional existente
     * @param id ID da especificação a ser atualizada
     * @param data Novos dados para atualização
     * @returns A especificação atualizada
     */
    async update(id: string, data: UpdateFunctionalSpecificationRequest): Promise<FunctionalSpecification> {
        const response = await api.patch(`/ef/${id}`, data);
        return response.data;
    },

    /**
     * Remove uma especificação funcional
     * @param id ID da especificação a ser removida
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/ef/${id}`);
    },

    /**
     * Realiza upload de um diagrama de processo para uma especificação
     * @param id ID da especificação funcional
     * @param file Arquivo do diagrama de processo (PDF, imagem, etc)
     * @returns Metadados do arquivo enviado
     */
    async uploadProcessDiagram(id: string, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/ef/${id}/upload/process-diagram`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Realiza upload de múltiplos arquivos de testes unitários
     * @param id ID da especificação funcional
     * @param files Array de arquivos de teste (documentos, códigos, etc)
     * @returns Metadados dos arquivos enviados
     */
    async uploadUnitTests(id: string, files: File[]): Promise<any> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await api.post(`/ef/${id}/upload/unit-tests`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Gera um documento PDF a partir dos dados da especificação funcional
     * @param id ID da especificação para gerar o PDF
     * @returns Blob contendo o arquivo PDF gerado
     */
    async generatePdf(id: string): Promise<Blob> {
        const response = await api.get(`/ef/${id}/generate-pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },

    /**
     * Exporta os dados da especificação funcional em formato JSON
     * @param id ID da especificação para exportar
     * @returns Objeto JSON com os dados estruturados da especificação
     */
    async generateJson(id: string): Promise<any> {
        const response = await api.get(`/ef/${id}/generate-json`);
        return response.data;
    },

    /**
     * Gera e baixa um PDF da especificação funcional
     * @param id ID da especificação
     * @param cardNumber Número do card para incluir no nome do arquivo
     */
    async downloadPdf(id: string, cardNumber: string): Promise<void> {
        try {
            const blob = await this.generatePdf(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `EF_${cardNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao baixar PDF:', error);
            throw error;
        }
    },

    /**
     * Filtra especificações por status
     * @param status Status desejado para filtro (ex: "Em andamento", "Concluído")
     * @returns Lista filtrada de especificações com o status especificado
     */
    async getByStatus(status: string): Promise<FunctionalSpecification[]> {
        const allSpecs = await this.getAll();
        return allSpecs.filter(spec => spec.status === status);
    },

    /**
     * Filtra especificações por autor
     * @param authorId ID do autor para filtro
     * @returns Lista de especificações criadas pelo autor especificado
     */
    async getByAuthor(authorId: string): Promise<FunctionalSpecification[]> {
        const allSpecs = await this.getAll();
        return allSpecs.filter(spec => spec.authorId === authorId);
    },

    /**
     * Filtra especificações por nome de projeto
     * @param projectName Nome ou parte do nome do projeto para busca
     * @returns Lista de especificações cujo nome do projeto contém o termo pesquisado
     */
    async getByProject(projectName: string): Promise<FunctionalSpecification[]> {
        const allSpecs = await this.getAll();
        return allSpecs.filter(spec =>
            spec.projectName.toLowerCase().includes(projectName.toLowerCase())
        );
    },

    /**
     * Verifica se o usuário atual tem permissão para editar uma EF específica
     * Importante: A regra de negócio padrão permite edição apenas pelo autor original
     * 
     * @param id ID da especificação funcional a verificar
     * @returns Objeto contendo flag de permissão e mensagem opcional
     */
    async canEdit(id: string): Promise<{ canEdit: boolean; message?: string }> {
        try {
            const response = await api.get(`/ef/${id}/can-edit`);
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar permissão de edição:', error);
            return { canEdit: false, message: 'Erro ao verificar permissões' };
        }
    },

    /**
     * Realiza upload de múltiplos anexos genéricos para uma especificação
     * Suporta diversos tipos de arquivo como documentos, imagens e PDFs
     * 
     * @param id ID da especificação funcional
     * @param files Array de arquivos para anexar
     * @returns Metadados dos arquivos enviados
     */
    async uploadAttachments(id: string, files: File[]): Promise<any> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await api.post(`/ef/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Baixar arquivo
    async downloadFile(fileId: string, fileName: string): Promise<void> {
        try {
            console.log('💾 Baixando arquivo:', fileId, fileName);
            
            const response = await api.get(`/ef/file/${fileId}`, {
                responseType: 'blob',
            });
            
            console.log('📦 Download - Resposta recebida:', response.status, response.headers['content-type']);
            
            // Verificar se o arquivo foi retornado corretamente
            if (!response.data || response.data.size === 0) {
                throw new Error('Arquivo vazio ou não encontrado');
            }
            
            // Extrai o tipo do arquivo da resposta ou do nome do arquivo
            const contentType = response.headers['content-type'] || this.getMimeTypeFromFileName(fileName);
            const blob = new Blob([response.data], { type: contentType });
            
            // Criar URL do blob
            const url = window.URL.createObjectURL(blob);
            
            // Criar elemento link invisível
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.download = fileName;
            
            // Adicionar ao DOM, simular o click e remover
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpar a URL do objeto para evitar vazamento de memória
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
            
            console.log('✅ Download concluído:', fileName);
        } catch (error) {
            console.error('❌ Erro ao baixar arquivo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            throw new Error(`Erro ao baixar arquivo: ${errorMessage}`);
        }
    },

    // Visualizar arquivo (abrir em nova aba)
    async viewFile(fileId: string): Promise<void> {
        try {
            console.log('👁️ Visualizando arquivo:', fileId);
            
            // Fazer a requisição com autenticação e abrir o resultado
            const response = await api.get(`/ef/file/${fileId}/view`, {
                responseType: 'blob',
            });
            
            console.log('📦 Resposta recebida:', response.status, response.headers['content-type']);
            
            // Verificar se o arquivo foi retornado corretamente
            if (!response.data || response.data.size === 0) {
                throw new Error('Arquivo vazio ou não encontrado');
            }
            
            // Obter o nome de arquivo da resposta se disponível
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition 
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || 'visualizar'
                : 'visualizar';
                
            // Obter o tipo MIME da resposta
            const contentType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: contentType });
            
            // Criar URL do blob
            const url = window.URL.createObjectURL(blob);
            
            // Tentar abrir em nova janela - usando título amigável
            const newWindow = window.open(url, '_blank');
            if (!newWindow) {
                // Se não conseguir abrir popup, fazer download
                console.log('⚠️ Popup bloqueado, iniciando download');
                
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Se abriu corretamente, definir título da página
                if (newWindow.document) {
                    newWindow.document.title = filename;
                }
            }
            
            // Limpar URL após um tempo para liberar memória
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                console.log('🗑️ URL limpa da memória');
            }, 5000);
            
        } catch (error) {
            console.error('❌ Erro ao visualizar arquivo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            throw new Error(`Erro ao visualizar arquivo: ${errorMessage}`);
        }
    },

    /**
     * Gera um token público para compartilhamento de arquivo
     * O token permite acesso temporário ao arquivo sem necessidade de autenticação
     * 
     * @param fileId ID do arquivo para gerar token de acesso
     * @returns Objeto contendo o token e informações de expiração
     * @throws Erro caso a operação falhe
     */
    async generatePublicFileToken(fileId: string): Promise<any> {
        try {
            const response = await api.get(`/ef/file/${fileId}/public-token`);
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar token público:', error);
            throw error;
        }
    },
    
    /**
     * Remove um arquivo anexado à especificação funcional
     * Esta operação é irreversível e remove o arquivo do armazenamento
     * 
     * @param fileId ID do arquivo a ser excluído
     * @returns Dados da resposta da operação
     * @throws Erro caso a operação falhe
     */
    async deleteFile(fileId: string): Promise<void> {
        try {
            console.log('🗑️ Excluindo arquivo:', fileId);
            const response = await api.delete(`/ef/file/${fileId}`);
            console.log('✅ Arquivo excluído com sucesso:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao excluir arquivo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            throw new Error(`Erro ao excluir arquivo: ${errorMessage}`);
        }
    },
    
    /**
     * Determina o tipo MIME apropriado com base na extensão do arquivo
     * Utilizado internamente para operações de download e visualização
     */
    getMimeTypeFromFileName(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'txt': 'text/plain',
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript',
            'json': 'application/json',
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed'
        };
        
        return mimeTypes[extension] || 'application/octet-stream';
    }
};
