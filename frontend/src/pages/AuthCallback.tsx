import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const AuthCallback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { completeSocialLogin, isAuthenticated } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const user = params.get('user');
        const error = params.get('error');

        if (error) {
            toast.error('Nao foi possivel concluir o login com Google.', { autoClose: 5000 });
            navigate('/login', { replace: true });
            return;
        }

        if (!token || !user) {
            navigate('/login', { replace: true });
            return;
        }

        completeSocialLogin(token, user).catch(() => {
            navigate('/login', { replace: true });
        });
    }, [completeSocialLogin, location.search, navigate]);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
                <div className="card-body">
                    <h2 style={{ marginBottom: '12px' }}>Conectando sua conta</h2>
                    <p style={{ margin: 0, color: '#666' }}>Estamos finalizando seu login seguro.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthCallback;
