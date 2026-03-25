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
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const googleEnabled = useMemo(
        () => process.env.REACT_APP_ENABLE_GOOGLE_AUTH === 'true',
        []
    );
    const isBusy = isFormLoading || isGoogleLoading;

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
        setIsFormLoading(true);

        try {
            await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);

        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Erro ao iniciar login com Google:', error);
        } finally {
            setIsGoogleLoading(false);
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
                                disabled={isBusy}
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
                                disabled={isBusy}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: googleEnabled ? '12px' : '15px' }}
                            disabled={isBusy}
                        >
                            {isFormLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    {googleEnabled && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ width: '100%', marginBottom: '15px' }}
                            onClick={handleGoogleLogin}
                            disabled={isBusy}
                        >
                            {isGoogleLoading ? 'Conectando ao Google...' : 'Continuar com Google'}
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
