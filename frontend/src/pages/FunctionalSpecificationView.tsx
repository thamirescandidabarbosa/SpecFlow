import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { functionalSpecificationService } from '../services/functionalSpecificationService';
import { FunctionalSpecification } from '../types';
import { 
    FileText, Calendar, User, Settings, Download, Edit3, ArrowLeft,
    Tag, Clock, AlertCircle
} from 'lucide-react';

const FunctionalSpecificationView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [spec, setSpec] = useState<FunctionalSpecification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadSpecification();
        }
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadSpecification = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await functionalSpecificationService.getById(id!);
            setSpec(data);
        } catch (err: any) {
            console.error('Erro ao carregar especificação:', err);
            setError('Erro ao carregar especificação funcional');
            toast.error('Erro ao carregar especificação funcional');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!spec) return;
        try {
            await functionalSpecificationService.downloadPdf(spec.id, spec.cardNumber);
            toast.success('PDF baixado com sucesso!');
        } catch (err) {
            toast.error('Erro ao gerar PDF da especificação funcional');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
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

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p>Carregando especificação...</p>
            </div>
        );
    }

    if (error || !spec) {
        return (
            <div style={{ 
                maxWidth: '800px', 
                margin: '20px auto', 
                padding: '25px',
                backgroundColor: '#fff',
                boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
                borderRadius: '8px'
            }}>
                <div className="card" style={{ 
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #eee'
                }}>
                    <div className="card-header" style={{ 
                        backgroundColor: '#f8d7da', 
                        color: '#721c24',
                        borderBottom: '1px solid #f5c6cb',
                        padding: '15px 20px',
                        borderRadius: '6px 6px 0 0'
                    }}>
                        <h3 style={{ 
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <AlertCircle size={18} />
                            Erro
                        </h3>
                    </div>
                    <div className="card-body" style={{
                        padding: '25px 20px'
                    }}>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <h3 style={{ 
                                color: '#dc3545', 
                                marginBottom: '20px',
                                fontSize: '18px',
                                fontWeight: '500'
                            }}>
                                {error || 'Especificação não encontrada'}
                            </h3>
                            <button
                                onClick={() => navigate('/functional-specifications')}
                                className="btn btn-primary"
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    margin: '0 auto',
                                    padding: '10px 16px',
                                    fontSize: '14px'
                                }}
                            >
                                <ArrowLeft size={16} />
                                Voltar para Lista
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '20px auto', 
            padding: '25px',
            backgroundColor: '#fff',
            boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
            borderRadius: '8px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <FileText size={28} color="#1565c0" />
                    <div>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            {spec.cardNumber} - {spec.projectName}
                        </h1>
                        <p style={{ 
                            margin: '5px 0 0',
                            fontSize: '14px',
                            color: '#555' 
                        }}>
                            Especificação Funcional - Versão {spec.version}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/functional-specifications')}
                        className="btn btn-secondary"
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px'
                        }}
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="btn btn-success"
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px'
                        }}
                    >
                        <Download size={16} />
                        Baixar PDF
                    </button>
                    <button
                        onClick={() => navigate(`/functional-specification/edit/${spec.id}`)}
                        className="btn btn-warning"
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px'
                        }}
                    >
                        <Edit3 size={16} />
                        Editar
                    </button>
                </div>
            </div>

            {/* Status */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 15px',
                    borderRadius: '30px',
                    color: '#fff',
                    backgroundColor: getStatusColor(spec.status),
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <Tag size={16} />
                    {spec.status}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    <Clock size={16} />
                    Início: {formatDateTime(spec.startDateTime)}
                    {spec.endDateTime && <span> • Fim: {formatDateTime(spec.endDateTime)}</span>}
                </div>
            </div>

            {/* Informações Básicas */}
            <div className="card" style={{ 
                marginBottom: '35px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
            }}>
                <div className="card-header" style={{ 
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #eee',
                    padding: '15px 20px',
                    borderRadius: '6px 6px 0 0'
                }}>
                    <h3 style={{ 
                        margin: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#444'
                    }}>
                        <Settings size={18} />
                        Informações Básicas
                    </h3>
                </div>
                <div className="card-body" style={{
                    padding: '20px'
                }}>
                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '16px',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>N° do Card</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                {spec.cardNumber}
                            </div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Projeto</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                {spec.projectName}
                            </div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Analista Técnico</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                {spec.technicalAnalyst}
                            </div>
                        </div>
                        
                        {spec.gmud && (
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '14px 18px',
                                borderRadius: '6px',
                                border: '1px solid #eee',
                                flex: '1',
                                minWidth: '180px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>GMUD</div>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    {spec.gmud}
                                </div>
                            </div>
                        )}
                        
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Data</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                {formatDate(spec.date)}
                            </div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Versão</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                {spec.version}
                            </div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Ambiente</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                {spec.developmentEnvironment}
                            </div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Autor</div>
                            <div style={{ 
                                fontSize: '16px', 
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <User size={16} />
                                {spec.author}
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Status</div>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                borderRadius: '30px',
                                color: '#fff',
                                backgroundColor: getStatusColor(spec.status),
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                <Tag size={16} />
                                {spec.status}
                            </div>
                        </div>
                            
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '14px 18px',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            flex: '1',
                            minWidth: '180px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Data/Horário de Início</div>
                            <div style={{ 
                                fontSize: '16px', 
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Calendar size={16} />
                                {formatDateTime(spec.startDateTime)}
                            </div>
                        </div>
                            
                        {spec.endDateTime && (
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '14px 18px',
                                borderRadius: '6px',
                                border: '1px solid #eee',
                                flex: '1',
                                minWidth: '180px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>Data/Horário de Fim</div>
                                <div style={{ 
                                    fontSize: '16px', 
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Calendar size={16} />
                                    {formatDateTime(spec.endDateTime)}
                                </div>
                            </div>
                        )}
                            
                        {spec.order && (
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '14px 18px',
                                borderRadius: '6px',
                                border: '1px solid #eee',
                                flex: '1',
                                minWidth: '180px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>Ordem</div>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    {spec.order}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {spec.comment && (
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '15px', 
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                marginBottom: '8px', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                fontWeight: '500'
                            }}>Comentário</div>
                            <div style={{ 
                                fontSize: '16px', 
                                fontWeight: '400',
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.5'
                            }}>
                                {spec.comment}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Especificações */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-header" style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderBottom: '2px solid #28a745',
                    padding: '15px 20px',
                    borderRadius: '6px 6px 0 0'
                }}>
                    <h3 style={{ 
                        margin: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#444'
                    }}>
                        <FileText size={18} />
                        Especificações
                    </h3>
                </div>
                <div className="card-body" style={{
                    padding: '20px'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ 
                            fontSize: '13px', 
                            color: '#666', 
                            marginBottom: '8px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            fontWeight: '500'
                        }}>Descrição do Desenvolvimento</div>
                        <div style={{ 
                            fontSize: '16px', 
                            fontWeight: '400',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.5'
                        }}>
                            {spec.developmentDescription}
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ 
                            fontSize: '13px', 
                            color: '#666', 
                            marginBottom: '8px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            fontWeight: '500'
                        }}>Especificação Funcional</div>
                        <div style={{ 
                            fontSize: '16px', 
                            fontWeight: '400',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.5'
                        }}>
                            {spec.functionalSpecification}
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ 
                            fontSize: '13px', 
                            color: '#666', 
                            marginBottom: '8px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            fontWeight: '500'
                        }}>Descrição da Mudança</div>
                        <div style={{ 
                            fontSize: '16px', 
                            fontWeight: '400',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.5'
                        }}>
                            {spec.changeDescription}
                        </div>
                    </div>
                </div>
            </div>

            {/* Requests */}
            {spec.requests && spec.requests.length > 0 && (
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-header" style={{ 
                        backgroundColor: '#f8f9fa', 
                        borderBottom: '2px solid #007bff',
                        padding: '15px 20px',
                        borderRadius: '6px 6px 0 0'
                    }}>
                        <h3 style={{ 
                            margin: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#444'
                        }}>
                            <FileText size={18} />
                            Requests ({spec.requests.length})
                        </h3>
                    </div>
                    <div className="card-body" style={{
                        padding: '20px'
                    }}>
                        {spec.requests.map((request, index) => (
                            <div key={index} style={{
                                padding: '15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                borderLeft: '4px solid #007bff'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ 
                                            fontSize: '13px', 
                                            color: '#666', 
                                            marginBottom: '8px', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.5px',
                                            fontWeight: '500'
                                        }}>
                                            Request {index + 1}
                                        </div>
                                        <div style={{ 
                                            fontSize: '16px', 
                                            fontWeight: '400',
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: '1.5'
                                        }}>
                                            {request.description}
                                        </div>
                                    </div>
                                    {request.priority && (
                                        <div style={{
                                            marginLeft: '15px',
                                            padding: '4px 8px',
                                            backgroundColor: '#e9ecef',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {request.priority}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cutover Plan */}
            {spec.includeCutoverPlan && (
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-header" style={{ 
                        backgroundColor: '#fff3cd', 
                        color: '#856404', 
                        borderBottom: '2px solid #ffc107',
                        padding: '15px 20px',
                        borderRadius: '6px 6px 0 0'
                    }}>
                        <h3 style={{ 
                            margin: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            <Clock size={18} />
                            Plano de Cutover
                        </h3>
                    </div>
                    <div className="card-body" style={{
                        padding: '20px'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
                            {spec.cutoverObjective && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Objetivo do Cutover</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverObjective}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverTimeline && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Timeline e Cronograma</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverTimeline}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverDetailedActivities && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Atividades Detalhadas</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverDetailedActivities}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverPreChecklistActivities && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Checklist de Pré-Cutover</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverPreChecklistActivities}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverCommunicationPlan && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Plano de Comunicação</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverCommunicationPlan}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverTeamsAndResponsibilities && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Equipes Envolvidas e Responsabilidades</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverTeamsAndResponsibilities}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverContingencyPlan && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Plano de Contingência</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverContingencyPlan}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverSuccessCriteria && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Critérios de Sucesso / Go-Live</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverSuccessCriteria}
                                    </div>
                                </div>
                            )}
                            {spec.cutoverPostGoLiveSupport && (
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#666', 
                                        marginBottom: '8px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px',
                                        fontWeight: '500'
                                    }}>Suporte Pós-Go-Live</div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '400',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}>
                                        {spec.cutoverPostGoLiveSupport}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Arquivos */}
            {((spec.processdiagram) || (spec.unitTests && spec.unitTests.length > 0)) && (
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-header" style={{ 
                        backgroundColor: '#f8f9fa', 
                        borderBottom: '2px solid #6f42c1',
                        padding: '15px 20px',
                        borderRadius: '6px 6px 0 0'
                    }}>
                        <h3 style={{ 
                            margin: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#444'
                        }}>
                            <FileText size={18} />
                            Arquivos Anexos
                        </h3>
                    </div>
                    <div className="card-body" style={{
                        padding: '20px'
                    }}>
                        {spec.processdiagram && (
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>Diagrama de Processo</div>
                                <div style={{ 
                                    marginTop: '5px',
                                    padding: '10px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <FileText size={16} />
                                    <span>{spec.processdiagram.originalName}</span>
                                    <a 
                                        href={`http://localhost:3001/api/uploads/${spec.processdiagram.filename}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Ver Arquivo
                                    </a>
                                </div>
                            </div>
                        )}
                        {spec.unitTests && spec.unitTests.length > 0 && (
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>
                                    Testes Unitários ({spec.unitTests.length} arquivo{spec.unitTests.length !== 1 ? 's' : ''})
                                </div>
                                <div style={{ marginTop: '5px' }}>
                                    {spec.unitTests.map((file, index) => (
                                        <div key={index} style={{ 
                                            marginBottom: '5px',
                                            padding: '10px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <FileText size={16} />
                                            <span>{file.originalName}</span>
                                            <a 
                                                href={`http://localhost:3001/api/uploads/${file.filename}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Ver Arquivo
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FunctionalSpecificationView;
