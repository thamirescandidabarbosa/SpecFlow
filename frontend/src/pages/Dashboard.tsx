import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { functionalSpecificationService } from '../services/functionalSpecificationService';
import { filesService } from '../services/filesService';
import { FileText, Upload, Users, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const { data: specifications, isLoading: specificationsLoading } = useQuery(
        'specifications',
        functionalSpecificationService.getAll
    );

    const { data: files, isLoading: filesLoading } = useQuery(
        'files',
        filesService.getAll
    );

    const stats = [
        {
            title: 'Total de Especificações',
            value: specifications?.length || 0,
            icon: FileText,
            color: '#007bff',
        },
        {
            title: 'Arquivos Enviados',
            value: files?.length || 0,
            icon: Upload,
            color: '#28a745',
        },
        {
            title: 'Suas Especificações',
            value: specifications?.filter(spec => spec.authorId === user?.id).length || 0,
            icon: Users,
            color: '#ffc107',
        },
        {
            title: 'Total de MB',
            value: Math.round((files?.reduce((total, file) => total + file.size, 0) || 0) / (1024 * 1024)),
            icon: BarChart3,
            color: '#dc3545',
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    Dashboard
                </h1>
                <p style={{ margin: 0, color: '#666' }}>
                    Bem-vindo, {user?.username}! Aqui está um resumo do sistema.
                </p>
            </div>

            {/* Estatísticas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card">
                            <div className="card-body" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}>
                                <div style={{
                                    padding: '15px',
                                    borderRadius: '8px',
                                    backgroundColor: `${stat.color}20`,
                                }}>
                                    <Icon size={24} style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#333' }}>
                                        {specificationsLoading || filesLoading ? '...' : stat.value}
                                    </h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                                        {stat.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px'
            }}>
                {/* Especificações Recentes */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={20} />
                            Especificações Recentes
                        </h3>
                    </div>
                    <div className="card-body">
                        {specificationsLoading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                            </div>
                        ) : specifications && specifications.length > 0 ? (
                            <div
                                className="dashboard-list-container"
                                style={{
                                    maxHeight: specifications.length > 4 ? '320px' : 'auto',
                                    overflowY: specifications.length > 4 ? 'auto' : 'visible',
                                    paddingRight: specifications.length > 4 ? '4px' : '0'
                                }}
                            >
                                {specifications.map((spec) => (
                                    <div key={spec.id} className="dashboard-list-item">
                                        <h4 className="dashboard-list-title">
                                            {spec.cardNumber} - {spec.projectName}
                                        </h4>
                                        <p className="dashboard-list-subtitle">
                                            Por {spec.author} • {spec.status} • {new Date(spec.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ margin: 0, color: '#666', textAlign: 'center' }}>
                                Nenhuma especificação encontrada
                            </p>
                        )}
                    </div>
                </div>

                {/* Arquivos Recentes */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Upload size={20} />
                            Arquivos Recentes
                        </h3>
                    </div>
                    <div className="card-body">
                        {filesLoading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                            </div>
                        ) : files && files.length > 0 ? (
                            <div
                                className="dashboard-list-container"
                                style={{
                                    maxHeight: files.length > 4 ? '320px' : 'auto',
                                    overflowY: files.length > 4 ? 'auto' : 'visible',
                                    paddingRight: files.length > 4 ? '4px' : '0'
                                }}
                            >
                                {files.map((file) => (
                                    <div key={file.id} className="dashboard-list-item">
                                        <h4 className="dashboard-list-title">
                                            {file.originalName}
                                        </h4>
                                        <p className="dashboard-list-subtitle">
                                            Por {file.uploadedBy.username} • {Math.round(file.size / 1024)} KB
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ margin: 0, color: '#666', textAlign: 'center' }}>
                                Nenhum arquivo encontrado
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
