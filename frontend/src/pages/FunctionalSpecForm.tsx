import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div className="card">
                <div className="card-header" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        📝 Nova Especificação Funcional
                    </h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                        Preencha os dados para criar uma nova Especificação Funcional
                    </p>
                </div>
                <div className="card-body">
                    <FunctionalSpecificationForm
                        mode="create"
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default FunctionalSpecForm;
