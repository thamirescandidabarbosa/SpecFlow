import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import FunctionalSpecificationForm from '../components/FunctionalSpecificationForm';

const FunctionalSpecificationEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/functional-specifications');
    };

    const handleCancel = () => {
        navigate('/functional-specifications');
    };

    if (!id) {
        return (
            <div className="page-panel">
                <div className="page-panel-inner" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#60708b', marginBottom: '20px' }}>
                        ID da especificacao nao fornecido.
                    </p>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                        <ArrowLeft size={16} />
                        Voltar para a lista
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
                        <Edit size={18} />
                        Ajuste fino da entrega
                    </div>
                    <h1>Edite a especificacao sem perder a consistencia visual.</h1>
                    <p>
                        A tela de edicao agora acompanha o mesmo sistema de superfícies,
                        espacamentos e destaque visual das telas de autenticacao.
                    </p>
                </div>
            </section>

            <section className="page-panel-inner">
                    <div className="card">
                        <div className="card-header">
                            <h3
                                style={{
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: '#11254f',
                                }}
                            >
                                <Edit size={18} />
                                Modifique os dados da especificacao funcional
                            </h3>
                        </div>
                        <div className="card-body">
                            <FunctionalSpecificationForm
                                mode="edit"
                                efId={id}
                                onSuccess={handleSuccess}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
            </section>
        </div>
    );
};

export default FunctionalSpecificationEdit;
