import React, { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Download, File, FileText as FileTextIcon, FolderOpen, Image, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { filesService } from '../services/filesService';

const Files: React.FC = () => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const { data: files, isLoading } = useQuery('files', filesService.getAll);

    const uploadMutation = useMutation(({ file }: { file: File }) => filesService.upload(file), {
        onSuccess: () => {
            queryClient.invalidateQueries('files');
            toast.success('Arquivo enviado com sucesso!');
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao enviar arquivo';
            toast.error(message);
            setUploading(false);
        },
    });

    const deleteMutation = useMutation(filesService.delete, {
        onSuccess: () => {
            queryClient.invalidateQueries('files');
            toast.success('Arquivo excluido com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao excluir arquivo');
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            uploadMutation.mutate({ file });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este arquivo?')) {
            deleteMutation.mutate(id);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
        return `${Math.round(bytes / (1024 * 1024))} MB`;
    };

    const getFileIcon = (mimetype: string) => {
        if (mimetype.startsWith('image/')) {
            return <Image size={22} />;
        }
        if (
            mimetype === 'application/pdf' ||
            mimetype === 'application/msword' ||
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/vnd.ms-excel' ||
            mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            mimetype === 'text/plain'
        ) {
            return <FileTextIcon size={22} />;
        }
        return <File size={22} />;
    };

    const getFileUrl = (filename: string) => filesService.getFileUrl(filename);

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <div className="hero-badge">
                        <FolderOpen size={18} />
                        Biblioteca compartilhada
                    </div>
                    <h1>Arquivos com o mesmo acabamento do acesso.</h1>
                    <p>
                        Centralize uploads, consultas e downloads num painel mais claro, leve e
                        consistente com o restante da experiencia.
                    </p>
                </div>
                <div className="hero-actions">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                        style={{ display: 'none' }}
                        disabled={uploading}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-secondary"
                        disabled={uploading}
                    >
                        <Upload size={18} />
                        {uploading ? 'Enviando...' : 'Enviar arquivo'}
                    </button>
                </div>
            </section>

            <div className="page-panel">
                <div className="page-panel-inner">
                    <div
                        className="card"
                        style={{
                            marginBottom: '20px',
                            background: 'linear-gradient(180deg, #f8fcff 0%, #eef7fd 100%)',
                        }}
                    >
                        <div className="card-body">
                            <p style={{ margin: '0 0 10px 0', fontWeight: 700, color: '#11254f' }}>
                                Tipos aceitos
                            </p>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#60708b', lineHeight: 1.8 }}>
                                <li>Imagens: JPG, PNG, GIF</li>
                                <li>Documentos: PDF, DOC, DOCX</li>
                                <li>Planilhas: XLS, XLSX</li>
                                <li>Texto: TXT</li>
                                <li>Tamanho maximo: 10MB</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {files && files.length > 0 ? (
                            files.map((file: any) => (
                                <div key={file.id} className="card">
                                    <div className="card-body">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '16px',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'rgba(10, 136, 223, 0.12)',
                                                        color: '#0a88df',
                                                    }}
                                                >
                                                    {getFileIcon(file.mimetype)}
                                                </div>
                                                <div>
                                                    <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#11254f' }}>
                                                        {file.originalName}
                                                    </h3>
                                                    <p style={{ margin: 0, color: '#60708b', fontSize: '14px' }}>
                                                        {formatFileSize(file.size)} • Enviado por {file.uploadedBy.username} •{' '}
                                                        {new Date(file.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                <a
                                                    href={getFileUrl(file.filename)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Download size={16} />
                                                    Ver ou baixar
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(file.id)}
                                                    className="btn btn-danger"
                                                >
                                                    <Trash2 size={16} />
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card">
                                <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
                                    <Upload size={48} style={{ color: '#8eb9dc', marginBottom: '15px' }} />
                                    <h3 style={{ margin: '0 0 10px 0', color: '#11254f' }}>
                                        Nenhum arquivo encontrado
                                    </h3>
                                    <p style={{ margin: 0, color: '#60708b' }}>
                                        Clique em "Enviar arquivo" para adicionar seu primeiro item.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Files;
