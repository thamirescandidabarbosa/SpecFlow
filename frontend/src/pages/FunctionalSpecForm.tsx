import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import FunctionalSpecificationForm from '../components/FunctionalSpecificationForm';

const FunctionalSpecForm: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/functional-specifications');
    };

    const handleCancel = () => {
        navigate('/functional-specifications');
    };

    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <div className="hero-badge">
                        <Plus size={18} />
                        Nova entrega estruturada
                    </div>
                    <h1>Crie uma especificacao com a mesma linguagem do acesso.</h1>
                    <p>
                        O fluxo de criacao agora fica mais leve visualmente, com uma base mais
                        clara e consistente para preencher todos os detalhes da entrega.
                    </p>
                </div>
            </section>

            <section className="page-panel-inner">
                    <div className="card" style={{ marginBottom: '0' }}>
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
                                <FileText size={18} />
                                Preencha os dados para criar uma nova especificacao funcional
                            </h3>
                        </div>
                        <div className="card-body">
                            <FunctionalSpecificationForm
                                mode="create"
                                onSuccess={handleSuccess}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
            </section>
        </div>
    );
};

export default FunctionalSpecForm;
