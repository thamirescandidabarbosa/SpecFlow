import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const Register: React.FC = () => {
    const { register, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const passwordIsStrong = useMemo(
        () => passwordRegex.test(formData.password),
        [formData.password]
    );
    const passwordsMatch = useMemo(
        () => formData.password === formData.confirmPassword,
        [formData.password, formData.confirmPassword]
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

        if (!passwordIsStrong) {
            return;
        }

        if (!passwordsMatch) {
            return;
        }

        setIsLoading(true);

        try {
            await register({
                username: formData.username.trim(),
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
            <div className="card" style={{ width: '100%', maxWidth: '460px' }}>
                <div className="card-header" style={{ textAlign: 'center' }}>
                    <UserPlus size={32} style={{ marginBottom: '10px', color: '#007bff' }} />
                    <h2 style={{ margin: 0 }}>Criar conta</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                        Cadastro real com senha forte e acesso padrão de analista
                    </p>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Nome do usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-input"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                autoComplete="username"
                                placeholder="Joao Silva"
                            />
                        </div>

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
                                disabled={isLoading}
                                autoComplete="email"
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
                                disabled={isLoading}
                                autoComplete="new-password"
                                placeholder="Minimo 8 caracteres"
                            />
                            <small style={{ color: passwordIsStrong ? '#1f7a1f' : '#666' }}>
                                Use 8+ caracteres com maiuscula, minuscula, numero e simbolo.
                            </small>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                            {formData.confirmPassword && !passwordsMatch && (
                                <small style={{ color: '#c62828' }}>As senhas precisam ser iguais.</small>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '15px' }}
                            disabled={isLoading || !passwordIsStrong || !passwordsMatch}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#666' }}>
                            Ja tem uma conta?{' '}
                            <Link to="/login" style={{ color: '#007bff' }}>
                                Faca login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
