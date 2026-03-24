import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
    const { login, loginWithGoogle, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const googleEnabled = useMemo(
        () => process.env.REACT_APP_ENABLE_GOOGLE_AUTH === 'true',
        []
    );

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="card-header" style={{ textAlign: 'center' }}>
                    <LogIn size={32} style={{ marginBottom: '10px', color: '#007bff' }} />
                    <h2 style={{ margin: 0 }}>Login seguro</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                        Entre com email e senha ou use sua conta Google
                    </p>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: googleEnabled ? '12px' : '15px' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    {googleEnabled && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ width: '100%', marginBottom: '15px' }}
                            onClick={loginWithGoogle}
                            disabled={isLoading}
                        >
                            Continuar com Google
                        </button>
                    )}

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#666' }}>
                            Nao tem uma conta?{' '}
                            <Link to="/register" style={{ color: '#007bff' }}>
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
