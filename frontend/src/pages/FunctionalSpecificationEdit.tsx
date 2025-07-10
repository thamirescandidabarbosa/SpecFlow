import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FunctionalSpecificationForm from '../components/FunctionalSpecificationForm';
import { Edit, ArrowLeft } from 'lucide-react';

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
                    <div className="card-body" style={{
                        padding: '25px 20px',
                        textAlign: 'center'
                    }}>
                        <p style={{ 
                            textAlign: 'center',
                            fontSize: '16px',
                            color: '#555',
                            marginBottom: '20px'
                        }}>ID da especificação não fornecido.</p>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                fontSize: '14px',
                                margin: '0 auto'
                            }}
                        >
                            <ArrowLeft size={16} />
                            Voltar à Lista
                        </button>
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
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <Edit size={28} color="#856404" />
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333'
                }}>Editar Especificação Funcional</h1>
            </div>

            <div className="card" style={{ 
                marginBottom: '35px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
            }}>
                <div className="card-header" style={{
                    backgroundColor: '#fff3cd',
                    borderBottom: '1px solid #ffeeba',
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
                        color: '#856404'
                    }}>
                        <Edit size={18} />
                        Modifique os dados da Especificação Funcional
                    </h3>
                </div>
                <div className="card-body" style={{
                    padding: '25px 20px'
                }}>
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
