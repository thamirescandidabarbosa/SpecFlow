import React, { useEffect, useState } from 'react';
import { Filter, ListChecks, Pencil, Trash2, Eye, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { functionalSpecificationService } from '../services/functionalSpecificationService';
import { FunctionalSpecification } from '../types';

const FunctionalSpecificationList: React.FC = () => {
    const { user } = useAuth();
    const [specifications, setSpecifications] = useState<FunctionalSpecification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        loadSpecifications();
    }, []);

    const loadSpecifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await functionalSpecificationService.getAll();
            setSpecifications(data);
        } catch (err) {
            setError('Erro ao carregar especificacoes funcionais');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilterChange = async (status: string) => {
        setStatusFilter(status);
        if (status === '') {
            await loadSpecifications();
            return;
        }

        try {
            setLoading(true);
            const data = await functionalSpecificationService.getByStatus(status);
            setSpecifications(data);
        } catch (err) {
            setError('Erro ao filtrar por status');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta especificacao funcional?')) {
            try {
                await functionalSpecificationService.delete(id);
                await loadSpecifications();
                alert('Especificacao funcional excluida com sucesso!');
            } catch (err) {
                alert('Erro ao excluir especificacao funcional');
            }
        }
    };

    const handleDownloadPdf = async (id: string, cardNumber: string) => {
        try {
            await functionalSpecificationService.downloadPdf(id, cardNumber);
        } catch (err) {
            alert('Erro ao gerar PDF da especificacao funcional');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Em andamento':
                return { background: 'rgba(242, 169, 0, 0.16)', color: '#9a6800' };
            case 'Pronto':
                return { background: 'rgba(9, 163, 125, 0.14)', color: '#0c8468' };
            case 'Aprovado':
                return { background: 'rgba(10, 136, 223, 0.14)', color: '#0a6db3' };
            case 'Cancelado':
                return { background: 'rgba(217, 77, 95, 0.14)', color: '#b93a52' };
            case 'Em anÃ¡lise':
                return { background: 'rgba(108, 82, 196, 0.14)', color: '#5e43b2' };
            default:
                return { background: 'rgba(96, 112, 139, 0.16)', color: '#60708b' };
        }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
    const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('pt-BR');

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-panel">
                <div className="page-panel-inner" style={{ textAlign: 'center', color: '#c64559' }}>
                    <p style={{ marginBottom: '14px' }}>{error}</p>
                    <button onClick={loadSpecifications} className="btn btn-primary">
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <div className="hero-badge">
                        <ListChecks size={18} />
                        Acervo de especificacoes
                    </div>
                    <h1>Consulte e gerencie suas especificacoes.</h1>
                    <p>
                        A lista agora segue o mesmo peso visual das telas de entrada, com filtros
                        mais claros, cards mais elegantes e acoes organizadas.
                    </p>
                </div>
            </section>

            <section className="page-panel">
                <div className="page-panel-inner">
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div className="card-header">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '16px',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <h2 style={{ margin: 0, color: '#11254f' }}>Especificacoes funcionais</h2>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <label
                                        htmlFor="status-filter"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60708b', fontWeight: 600 }}
                                    >
                                        <Filter size={16} />
                                        Filtrar por status
                                    </label>
                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                                        className="form-input"
                                        style={{ width: '220px' }}
                                    >
                                        <option value="">Todos</option>
                                        <option value="Em andamento">Em andamento</option>
                                        <option value="Em anÃ¡lise">Em analise</option>
                                        <option value="Pronto">Pronto</option>
                                        <option value="Aprovado">Aprovado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            {specifications.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                                    <p style={{ color: '#60708b', marginBottom: '16px' }}>
                                        Nenhuma especificacao funcional encontrada.
                                    </p>
                                    <a href="/functional-specification" className="btn btn-primary">
                                        Criar nova especificacao
                                    </a>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '18px' }}>
                                    {specifications.map((spec) => {
                                        const statusStyle = getStatusColor(spec.status);

                                        return (
                                            <article key={spec.id} className="card">
                                                <div className="card-body">
                                                    <div
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(280px, 1fr)',
                                                            gap: '24px',
                                                        }}
                                                    >
                                                        <div>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '10px',
                                                                    flexWrap: 'wrap',
                                                                    marginBottom: '10px',
                                                                }}
                                                            >
                                                                <h3 style={{ margin: 0, color: '#11254f', fontSize: '1.15rem' }}>
                                                                    {spec.cardNumber} - {spec.projectName}
                                                                </h3>
                                                                <span
                                                                    className="status-pill"
                                                                    style={{
                                                                        background: statusStyle.background,
                                                                        color: statusStyle.color,
                                                                    }}
                                                                >
                                                                    {spec.status}
                                                                </span>
                                                            </div>

                                                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#60708b' }}>
                                                                <strong>Versao:</strong> {spec.version} • <strong>Ambiente:</strong>{' '}
                                                                {spec.developmentEnvironment} • <strong>Data:</strong> {formatDate(spec.date)}
                                                            </p>
                                                            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#29415f', lineHeight: 1.7 }}>
                                                                <strong>Descricao:</strong> {spec.developmentDescription}
                                                            </p>
                                                            <p style={{ margin: 0, fontSize: '12px', color: '#7a8ca5' }}>
                                                                <strong>Autor:</strong> {spec.author} • <strong>Criado em:</strong>{' '}
                                                                {formatDateTime(spec.createdAt)}
                                                            </p>

                                                            {spec.requests && spec.requests.length > 0 && (
                                                                <div style={{ marginTop: '14px' }}>
                                                                    <strong style={{ fontSize: '12px', color: '#31486f' }}>
                                                                        Requests ({spec.requests.length})
                                                                    </strong>
                                                                    <ul
                                                                        style={{
                                                                            margin: '8px 0 0',
                                                                            paddingLeft: '20px',
                                                                            fontSize: '12px',
                                                                            color: '#60708b',
                                                                            lineHeight: 1.7,
                                                                        }}
                                                                    >
                                                                        {spec.requests.slice(0, 3).map((req, index) => (
                                                                            <li key={index}>
                                                                                {req.description.substring(0, 100)}
                                                                                {req.description.length > 100 ? '...' : ''}
                                                                                {req.priority && <span> ({req.priority})</span>}
                                                                            </li>
                                                                        ))}
                                                                        {spec.requests.length > 3 && (
                                                                            <li>... e mais {spec.requests.length - 3} requests</li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                                gap: '16px',
                                                                padding: '18px',
                                                                borderRadius: '18px',
                                                                background: '#f7fbff',
                                                                border: '1px solid #e2eef8',
                                                            }}
                                                        >
                                                            <div style={{ display: 'grid', gap: '10px', fontSize: '13px', color: '#60708b' }}>
                                                                <div>
                                                                    <strong style={{ color: '#31486f' }}>Inicio</strong>
                                                                    <div>{formatDateTime(spec.startDateTime)}</div>
                                                                </div>
                                                                {spec.endDateTime && (
                                                                    <div>
                                                                        <strong style={{ color: '#31486f' }}>Fim</strong>
                                                                        <div>{formatDateTime(spec.endDateTime)}</div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => window.open(`/functional-specification/${spec.id}`, '_blank')}
                                                                >
                                                                    <Eye size={16} />
                                                                    Ver
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => handleDownloadPdf(spec.id, spec.cardNumber)}
                                                                >
                                                                    <Download size={16} />
                                                                    PDF
                                                                </button>
                                                                {spec.authorId === user?.id && (
                                                                    <button
                                                                        className="btn btn-warning"
                                                                        onClick={() =>
                                                                            window.open(`/functional-specification/edit/${spec.id}`, '_blank')
                                                                        }
                                                                        title="Apenas o autor pode editar"
                                                                    >
                                                                        <Pencil size={16} />
                                                                        Editar
                                                                    </button>
                                                                )}
                                                                {(user?.role === 'ADMIN' || spec.authorId === user?.id) && (
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => handleDelete(spec.id)}
                                                                        title={
                                                                            spec.authorId === user?.id
                                                                                ? 'Excluir especificacao'
                                                                                : 'Apenas administradores podem excluir'
                                                                        }
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        Excluir
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FunctionalSpecificationList;
