import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { functionalSpecificationService } from '../services/functionalSpecificationService';
import { FunctionalSpecification } from '../types';
import { FileText, Calendar, User, Settings, Download, Edit3, ArrowLeft } from 'lucide-react';

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
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <div className="card">
                    <div className="card-header" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                        <h2 style={{ margin: 0 }}>❌ Erro</h2>
                    </div>
                    <div className="card-body">
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>
                                {error || 'Especificação não encontrada'}
                            </h3>
                            <button
                                onClick={() => navigate('/functional-specifications')}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-header" style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={24} />
                                {spec.cardNumber} - {spec.projectName}
                            </h2>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                                Especificação Funcional - Versão {spec.version}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => navigate('/functional-specifications')}
                                className="btn btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <ArrowLeft size={16} />
                                Voltar
                            </button>
                            <button
                                onClick={handleDownloadPdf}
                                className="btn btn-success"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Download size={16} />
                                Baixar PDF
                            </button>
                            <button
                                onClick={() => navigate(`/functional-specification/edit/${spec.id}`)}
                                className="btn btn-warning"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Edit3 size={16} />
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações Básicas */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #28a745' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={20} />
                        Informações Básicas
                    </h3>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>N° DO CARD</label>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>{spec.cardNumber}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>NOME DO PROJETO</label>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>{spec.projectName}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>ANALISTA TÉCNICO</label>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>{spec.technicalAnalyst}</p>
                            </div>
                            {spec.gmud && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>GMUD</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px' }}>{spec.gmud}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>DATA</label>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>{formatDate(spec.date)}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>VERSÃO</label>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>{spec.version}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>AMBIENTE DE DESENVOLVIMENTO</label>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>{spec.developmentEnvironment}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>AUTOR</label>
                                <p style={{ margin: '5px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={16} />
                                    {spec.author}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>STATUS</label>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        backgroundColor: getStatusColor(spec.status),
                                        marginTop: '5px'
                                    }}
                                >
                                    {spec.status}
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>DATA/HORÁRIO DE INÍCIO</label>
                                <p style={{ margin: '5px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} />
                                    {formatDateTime(spec.startDateTime)}
                                </p>
                            </div>
                            {spec.endDateTime && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>DATA/HORÁRIO DE FIM</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={16} />
                                        {formatDateTime(spec.endDateTime)}
                                    </p>
                                </div>
                            )}
                            {spec.order && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>ORDEM</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px' }}>{spec.order}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {spec.comment && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>COMENTÁRIO</label>
                            <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.comment}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Especificações */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #28a745' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} />
                        Especificações
                    </h3>
                </div>
                <div className="card-body">
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>DESCRIÇÃO DO DESENVOLVIMENTO</label>
                        <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.developmentDescription}</p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>ESPECIFICAÇÃO FUNCIONAL</label>
                        <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.functionalSpecification}</p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>DESCRIÇÃO DA MUDANÇA</label>
                        <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.changeDescription}</p>
                    </div>
                </div>
            </div>

            {/* Requests */}
            {spec.requests && spec.requests.length > 0 && (
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #007bff' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📝 Requests ({spec.requests.length})
                        </h3>
                    </div>
                    <div className="card-body">
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
                                        <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>
                                            REQUEST {index + 1}
                                        </label>
                                        <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                                            {request.description}
                                        </p>
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
                    <div className="card-header" style={{ backgroundColor: '#fff3cd', color: '#856404', borderBottom: '2px solid #ffc107' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔄 Plano de Cutover
                        </h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
                            {spec.cutoverObjective && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>OBJETIVO DO CUTOVER</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverObjective}</p>
                                </div>
                            )}
                            {spec.cutoverTimeline && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>TIMELINE E CRONOGRAMA</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverTimeline}</p>
                                </div>
                            )}
                            {spec.cutoverDetailedActivities && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>ATIVIDADES DETALHADAS</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverDetailedActivities}</p>
                                </div>
                            )}
                            {spec.cutoverPreChecklistActivities && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>CHECKLIST DE PRÉ-CUTOVER</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverPreChecklistActivities}</p>
                                </div>
                            )}
                            {spec.cutoverCommunicationPlan && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>PLANO DE COMUNICAÇÃO</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverCommunicationPlan}</p>
                                </div>
                            )}
                            {spec.cutoverTeamsAndResponsibilities && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>EQUIPES ENVOLVIDAS E RESPONSABILIDADES</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverTeamsAndResponsibilities}</p>
                                </div>
                            )}
                            {spec.cutoverContingencyPlan && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>PLANO DE CONTINGÊNCIA</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverContingencyPlan}</p>
                                </div>
                            )}
                            {spec.cutoverSuccessCriteria && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>CRITÉRIOS DE SUCESSO / GO-LIVE</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverSuccessCriteria}</p>
                                </div>
                            )}
                            {spec.cutoverPostGoLiveSupport && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>SUPORTE PÓS-GO-LIVE</label>
                                    <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{spec.cutoverPostGoLiveSupport}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Arquivos */}
            {((spec.processdiagram) || (spec.unitTests && spec.unitTests.length > 0)) && (
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #6f42c1' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📎 Arquivos Anexos
                        </h3>
                    </div>
                    <div className="card-body">
                        {spec.processdiagram && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>DIAGRAMA DE PROCESSO</label>
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
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '12px' }}>
                                    TESTES UNITÁRIOS ({spec.unitTests.length} arquivo{spec.unitTests.length !== 1 ? 's' : ''})
                                </label>
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
