import React, { useState, useEffect } from 'react';
import { functionalSpecificationService } from '../services/functionalSpecificationService';
import { FunctionalSpecification } from '../types';
import { useAuth } from '../contexts/AuthContext';

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
            const data = await functionalSpecificationService.getAll();
            setSpecifications(data);
        } catch (err) {
            setError('Erro ao carregar especificações funcionais');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilterChange = async (status: string) => {
        setStatusFilter(status);
        if (status === '') {
            await loadSpecifications();
        } else {
            try {
                setLoading(true);
                const data = await functionalSpecificationService.getByStatus(status);
                setSpecifications(data);
            } catch (err) {
                setError('Erro ao filtrar por status');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta especificação funcional?')) {
            try {
                await functionalSpecificationService.delete(id);
                await loadSpecifications();
                alert('Especificação funcional excluída com sucesso!');
            } catch (err) {
                alert('Erro ao excluir especificação funcional');
            }
        }
    };

    const handleDownloadPdf = async (id: string, cardNumber: string) => {
        try {
            await functionalSpecificationService.downloadPdf(id, cardNumber);
        } catch (err) {
            alert('Erro ao gerar PDF da especificação funcional');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Em andamento': return '#ffc107';
            case 'Pronto': return '#28a745';
            case 'Aprovado': return '#007bff';
            case 'Cancelado': return '#dc3545';
            case 'Em análise': return '#6f42c1';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Carregando especificações funcionais...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#dc3545' }}>
                <p>{error}</p>
                <button onClick={loadSpecifications} className="btn btn-primary">
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div className="card">
                <div className="card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>Especificações Funcionais</h2>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label>Filtrar por status:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="form-input"
                                style={{ width: 'auto' }}
                            >
                                <option value="">Todos</option>
                                <option value="Em andamento">Em andamento</option>
                                <option value="Em análise">Em análise</option>
                                <option value="Pronto">Pronto</option>
                                <option value="Aprovado">Aprovado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {specifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>Nenhuma especificação funcional encontrada.</p>
                            <a href="/functional-specification" className="btn btn-primary">
                                Criar Nova Especificação
                            </a>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {specifications.map((spec) => (
                                <div
                                    key={spec.id}
                                    className="card"
                                    style={{
                                        border: '1px solid #dee2e6',
                                        borderLeft: `4px solid ${getStatusColor(spec.status)}`
                                    }}
                                >
                                    <div className="card-body">
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                                            <div>
                                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                                    {spec.cardNumber} - {spec.projectName}
                                                </h3>
                                                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                                                    <strong>Versão:</strong> {spec.version} |
                                                    <strong> Ambiente:</strong> {spec.developmentEnvironment} |
                                                    <strong> Data:</strong> {formatDate(spec.date)}
                                                </p>
                                                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                                                    <strong>Descrição:</strong> {spec.developmentDescription}
                                                </p>
                                                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                                                    <strong>Autor:</strong> {spec.author} |
                                                    <strong> Criado em:</strong> {formatDateTime(spec.createdAt)}
                                                </p>
                                                {spec.requests && spec.requests.length > 0 && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <strong style={{ fontSize: '12px' }}>Requests ({spec.requests.length}):</strong>
                                                        <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '12px' }}>
                                                            {spec.requests.slice(0, 3).map((req, index) => (
                                                                <li key={index}>
                                                                    {req.description.substring(0, 100)}
                                                                    {req.description.length > 100 ? '...' : ''}
                                                                    {req.priority && (
                                                                        <span style={{ color: '#666' }}> ({req.priority})</span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                            {spec.requests.length > 3 && (
                                                                <li style={{ color: '#666' }}>
                                                                    ... e mais {spec.requests.length - 3} requests
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <div
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        backgroundColor: getStatusColor(spec.status),
                                                        marginBottom: '10px'
                                                    }}
                                                >
                                                    {spec.status}
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        <strong>Início:</strong><br />
                                                        {formatDateTime(spec.startDateTime)}
                                                    </div>
                                                    {spec.endDateTime && (
                                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                                            <strong>Fim:</strong><br />
                                                            {formatDateTime(spec.endDateTime)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ marginTop: '15px', display: 'flex', gap: '5px' }}>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{
                                                            backgroundColor: '#007bff',
                                                            color: 'white',
                                                            fontSize: '12px',
                                                            padding: '4px 8px'
                                                        }}
                                                        onClick={() => window.open(`/functional-specification/${spec.id}`, '_blank')}
                                                    >
                                                        Ver
                                                    </button>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{
                                                            backgroundColor: '#28a745',
                                                            color: 'white',
                                                            fontSize: '12px',
                                                            padding: '4px 8px'
                                                        }}
                                                        onClick={() => handleDownloadPdf(spec.id, spec.cardNumber)}
                                                    >
                                                        Baixar PDF
                                                    </button>
                                                    {spec.authorId === user?.id && (
                                                        <button
                                                            className="btn btn-sm"
                                                            style={{
                                                                backgroundColor: '#ffc107',
                                                                color: 'black',
                                                                fontSize: '12px',
                                                                padding: '4px 8px'
                                                            }}
                                                            onClick={() => window.open(`/functional-specification/edit/${spec.id}`, '_blank')}
                                                            title="Apenas o autor pode editar"
                                                        >
                                                            Editar
                                                        </button>
                                                    )}
                                                    {(user?.role === 'ADMIN' || spec.authorId === user?.id) && (
                                                        <button
                                                            className="btn btn-sm"
                                                            style={{
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                                fontSize: '12px',
                                                                padding: '4px 8px'
                                                            }}
                                                            onClick={() => handleDelete(spec.id)}
                                                            title={spec.authorId === user?.id ? "Excluir especificação" : "Apenas administradores podem excluir"}
                                                        >
                                                            Excluir
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FunctionalSpecificationList;
