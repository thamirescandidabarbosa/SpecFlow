import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
    const { register, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ANALYST' as 'ADMIN' | 'ANALYST' | 'USER',
    });
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData);
        } catch (error) {
            // Erro já tratado no contexto
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
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-header" style={{ textAlign: 'center' }}>
                    <UserPlus size={32} style={{ marginBottom: '10px', color: '#007bff' }} />
                    <h2 style={{ margin: 0 }}>Cadastro</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                        Crie sua conta
                    </p>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Nome de Usuário (Analista Técnico)
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
                                placeholder="João Silva"
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
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="role">
                                Função
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="form-input"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                <option value="ANALYST">Analista Técnico</option>
                                <option value="USER">Usuário</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '15px' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#666' }}>
                            Já tem uma conta?{' '}
                            <Link to="/login" style={{ color: '#007bff' }}>
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
