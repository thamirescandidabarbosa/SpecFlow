import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { User, Settings, Lock, Save } from 'lucide-react';
import api from '../services/api';

interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface ProfileFormData {
    username: string;
    email: string;
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const profileSchema = yup.object().shape({
    username: yup.string().required('Nome de usuário é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
});

const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Senha atual é obrigatória'),
    newPassword: yup.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres').required('Nova senha é obrigatória'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Confirmação de senha não confere')
        .required('Confirmação de senha é obrigatória'),
});

const UserSettings: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema)
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword
    } = useForm<PasswordFormData>({
        resolver: yupResolver(passwordSchema)
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
                resetProfile({
                    username: response.data.username,
                    email: response.data.email
                });
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                toast.error('Erro ao carregar perfil do usuário');
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [resetProfile]);

    const onSubmitProfile = async (data: ProfileFormData) => {
        setIsUpdatingProfile(true);
        try {
            const response = await api.patch('/users/profile', data);
            setUser(response.data);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error: any) {
            console.error('Erro ao atualizar perfil:', error);
            if (error.response?.status === 409) {
                toast.error('Email ou nome de usuário já está em uso');
            } else {
                toast.error('Erro ao atualizar perfil');
            }
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const onSubmitPassword = async (data: PasswordFormData) => {
        setIsChangingPassword(true);
        try {
            await api.put('/users/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            toast.success('Senha alterada com sucesso!');
            resetPassword();
        } catch (error: any) {
            console.error('Erro ao alterar senha:', error);
            if (error.response?.status === 400) {
                toast.error('Senha atual incorreta');
            } else {
                toast.error('Erro ao alterar senha');
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '30px'
            }}>
                <Settings size={28} />
                <h1 style={{ margin: 0 }}>Configurações da Conta</h1>
            </div>

            {/* Informações do Usuário */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <div className="card-header">
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} />
                        Informações da Conta
                    </h3>
                </div>
                <div className="card-body">
                    {user && (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <strong>Função:</strong> {user.role === 'ADMIN' ? 'Administrador' : 'Analista'}
                            </div>
                            <div>
                                <strong>Conta criada em:</strong> {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                            <div>
                                <strong>Última atualização:</strong> {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Formulário de Perfil */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <div className="card-header">
                    <h3 style={{ margin: 0 }}>Editar Perfil</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div className="form-group">
                                <label htmlFor="username">Nome de Usuário</label>
                                <input
                                    {...registerProfile('username')}
                                    type="text"
                                    id="username"
                                    className={`form-control ${profileErrors.username ? 'is-invalid' : ''}`}
                                    placeholder="Digite seu nome de usuário"
                                />
                                {profileErrors.username && (
                                    <div className="invalid-feedback">
                                        {profileErrors.username.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    {...registerProfile('email')}
                                    type="email"
                                    id="email"
                                    className={`form-control ${profileErrors.email ? 'is-invalid' : ''}`}
                                    placeholder="Digite seu email"
                                />
                                {profileErrors.email && (
                                    <div className="invalid-feedback">
                                        {profileErrors.email.message}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isUpdatingProfile}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifySelf: 'start' }}
                            >
                                <Save size={18} />
                                {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Formulário de Alteração de Senha */}
            <div className="card">
                <div className="card-header">
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={20} />
                        Alterar Senha
                    </h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div className="form-group">
                                <label htmlFor="currentPassword">Senha Atual</label>
                                <input
                                    {...registerPassword('currentPassword')}
                                    type="password"
                                    id="currentPassword"
                                    className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                                    placeholder="Digite sua senha atual"
                                />
                                {passwordErrors.currentPassword && (
                                    <div className="invalid-feedback">
                                        {passwordErrors.currentPassword.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">Nova Senha</label>
                                <input
                                    {...registerPassword('newPassword')}
                                    type="password"
                                    id="newPassword"
                                    className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                                    placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                                />
                                {passwordErrors.newPassword && (
                                    <div className="invalid-feedback">
                                        {passwordErrors.newPassword.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                                <input
                                    {...registerPassword('confirmPassword')}
                                    type="password"
                                    id="confirmPassword"
                                    className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                                    placeholder="Confirme sua nova senha"
                                />
                                {passwordErrors.confirmPassword && (
                                    <div className="invalid-feedback">
                                        {passwordErrors.confirmPassword.message}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-warning"
                                disabled={isChangingPassword}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifySelf: 'start' }}
                            >
                                <Lock size={18} />
                                {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
