import React from 'react';
import { useNavigate } from 'react-router-dom';
import FunctionalSpecificationForm from '../components/FunctionalSpecificationForm';
import { FileText, Plus } from 'lucide-react';

const FunctionalSpecForm: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/functional-specifications');
    };

    const handleCancel = () => {
        navigate('/functional-specifications');
    };

    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '20px auto', 
            padding: '25px',
            backgroundColor: '#fff',
            boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
            borderRadius: '8px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <FileText size={28} color="#155724" />
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333'
                }}>Nova Especificação Funcional</h1>
            </div>

            <div className="card" style={{ 
                marginBottom: '35px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
            }}>
                <div className="card-header" style={{
                    backgroundColor: '#d4edda',
                    borderBottom: '1px solid #c3e6cb',
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
                        color: '#155724'
                    }}>
                        <Plus size={18} />
                        Preencha os dados para criar uma nova Especificação Funcional
                    </h3>
                </div>
                <div className="card-body" style={{
                    padding: '25px 20px'
                }}>
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
