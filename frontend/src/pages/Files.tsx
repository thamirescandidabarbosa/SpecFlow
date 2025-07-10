import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { filesService } from '../services/filesService';
import { toast } from 'react-toastify';
import { Upload, File, Trash2, Download, Image, FileText as FileTextIcon } from 'lucide-react';

const Files: React.FC = () => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const { data: files, isLoading } = useQuery(
        'files',
        filesService.getAll
    );

    const uploadMutation = useMutation(
        ({ file }: { file: File }) =>
            filesService.upload(file),
        {
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
        }
    );

    const deleteMutation = useMutation(filesService.delete, {
        onSuccess: () => {
            queryClient.invalidateQueries('files');
            toast.success('Arquivo excluído com sucesso!');
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
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return Math.round(bytes / (1024 * 1024)) + ' MB';
    };

    const getFileIcon = (mimetype: string) => {
        if (mimetype.startsWith('image/')) {
            return <Image size={24} />;
        }
        if (mimetype === 'application/pdf') {
            return <FileTextIcon size={24} />;
        }
        if (mimetype === 'application/msword' || 
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return <FileTextIcon size={24} />;
        }
        if (mimetype === 'application/vnd.ms-excel' || 
            mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return <FileTextIcon size={24} />;
        }
        if (mimetype === 'text/plain') {
            return <FileTextIcon size={24} />;
        }
        return <File size={24} />;
    };

    const getFileUrl = (filename: string) => {
        return filesService.getFileUrl(filename);
    };

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Upload size={28} />
                    Arquivos
                </h1>
                <div>
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
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        disabled={uploading}
                    >
                        <Upload size={18} />
                        {uploading ? 'Enviando...' : 'Enviar Arquivo'}
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-body" style={{ backgroundColor: '#f8f9fa' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: '500' }}>
                        Tipos de arquivo aceitos:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Imagens: JPG, PNG, GIF</li>
                        <li>Documentos: PDF, DOC, DOCX</li>
                        <li>Planilhas: XLS, XLSX</li>
                        <li>Texto: TXT</li>
                        <li>Tamanho máximo: 10MB</li>
                    </ul>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                {files && files.length > 0 ? (
                    files.map((file: any) => (
                        <div key={file.id} className="card">
                            <div className="card-body">
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ color: '#007bff' }}>
                                            {getFileIcon(file.mimetype)}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                                                {file.originalName}
                                            </h3>
                                            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                                                {formatFileSize(file.size)} • Enviado por {file.uploadedBy.username} • {' '}
                                                {new Date(file.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <a
                                            href={getFileUrl(file.filename)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <Download size={16} />
                                            Ver/Baixar
                                        </a>
                                        <button
                                            onClick={() => handleDelete(file.id)}
                                            className="btn btn-danger"
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
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
                        <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
                            <Upload size={48} style={{ color: '#ccc', marginBottom: '15px' }} />
                            <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>
                                Nenhum arquivo encontrado
                            </h3>
                            <p style={{ margin: 0, color: '#999' }}>
                                Clique em "Enviar Arquivo" para adicionar seu primeiro arquivo.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Files;
