import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <div className="card">
                    <div className="card-body">
                        <p style={{ textAlign: 'center' }}>ID da especificação não fornecido.</p>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Voltar à Lista
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div className="card">
                <div className="card-header" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        ✏️ Editar Especificação Funcional
                    </h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                        Modifique os dados da Especificação Funcional
                    </p>
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
        </div>
    );
};

export default FunctionalSpecificationEdit;
