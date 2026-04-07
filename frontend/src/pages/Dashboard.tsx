import React from 'react';
import { useQuery } from 'react-query';
import { BarChart3, FileText, LayoutDashboard, Upload, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { filesService } from '../services/filesService';
import { functionalSpecificationService } from '../services/functionalSpecificationService';

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
            title: 'Total de Especificacoes',
            value: specifications?.length || 0,
            icon: FileText,
            color: '#0a88df',
            background: 'rgba(10, 136, 223, 0.12)',
        },
        {
            title: 'Arquivos Enviados',
            value: files?.length || 0,
            icon: Upload,
            color: '#09a37d',
            background: 'rgba(9, 163, 125, 0.12)',
        },
        {
            title: 'Suas Especificacoes',
            value: specifications?.filter((spec) => spec.authorId === user?.id).length || 0,
            icon: Users,
            color: '#f2a900',
            background: 'rgba(242, 169, 0, 0.14)',
        },
        {
            title: 'Total de MB',
            value: Math.round((files?.reduce((total, file) => total + file.size, 0) || 0) / (1024 * 1024)),
            icon: BarChart3,
            color: '#d94d5f',
            background: 'rgba(217, 77, 95, 0.12)',
        },
    ];

    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <div className="hero-badge">
                        <LayoutDashboard size={18} />
                        Workspace centralizado
                    </div>
                    <h1>Visao geral do seu fluxo.</h1>
                    <p>
                        Acompanhe especificacoes, anexos e volume de entrega no mesmo painel,
                        com a mesma linguagem visual do acesso inicial.
                    </p>
                </div>
            </section>

            <section className="stats-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <article key={stat.title} className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div
                                    style={{
                                        width: '58px',
                                        height: '58px',
                                        borderRadius: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: stat.background,
                                        color: stat.color,
                                    }}
                                >
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: '1.9rem',
                                            fontWeight: 800,
                                            letterSpacing: '-0.04em',
                                            color: '#11254f',
                                        }}
                                    >
                                        {specificationsLoading || filesLoading ? '...' : stat.value}
                                    </div>
                                    <p style={{ margin: 0, color: '#60708b', fontSize: '0.95rem' }}>
                                        {stat.title}
                                    </p>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '20px',
                }}
            >
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#11254f' }}>
                            <FileText size={20} />
                            Especificacoes recentes
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
                                    paddingRight: specifications.length > 4 ? '4px' : '0',
                                }}
                            >
                                {specifications.map((spec) => (
                                    <div key={spec.id} className="dashboard-list-item">
                                        <h4 className="dashboard-list-title">
                                            {spec.cardNumber} - {spec.projectName}
                                        </h4>
                                        <p className="dashboard-list-subtitle">
                                            Por {spec.author} • {spec.status} •{' '}
                                            {new Date(spec.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ margin: 0, color: '#60708b', textAlign: 'center' }}>
                                Nenhuma especificacao encontrada
                            </p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#11254f' }}>
                            <Upload size={20} />
                            Arquivos recentes
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
                                    paddingRight: files.length > 4 ? '4px' : '0',
                                }}
                            >
                                {files.map((file) => (
                                    <div key={file.id} className="dashboard-list-item">
                                        <h4 className="dashboard-list-title">{file.originalName}</h4>
                                        <p className="dashboard-list-subtitle">
                                            Por {file.uploadedBy.username} • {Math.round(file.size / 1024)} KB
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ margin: 0, color: '#60708b', textAlign: 'center' }}>
                                Nenhum arquivo encontrado
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
