import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Save, Settings, ShieldCheck, User } from 'lucide-react';
import { toast } from 'react-toastify';
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
    username: yup.string().required('Nome de usuario e obrigatorio'),
    email: yup.string().email('Email invalido').required('Email e obrigatorio'),
});

const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Senha atual e obrigatoria'),
    newPassword: yup.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres').required('Nova senha e obrigatoria'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Confirmacao de senha nao confere')
        .required('Confirmacao de senha e obrigatoria'),
});

const infoCardStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)',
    padding: '18px',
    borderRadius: '18px',
    border: '1px solid #e2eef8',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
};

const UserSettings: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<PasswordFormData>({
        resolver: yupResolver(passwordSchema),
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
                resetProfile({
                    username: response.data.username,
                    email: response.data.email,
                });
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                toast.error('Erro ao carregar perfil do usuario');
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
                toast.error('Email ou nome de usuario ja esta em uso');
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
                newPassword: data.newPassword,
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
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <div className="hero-badge">
                        <ShieldCheck size={18} />
                        Conta protegida
                    </div>
                    <h1>Configuracoes com o mesmo nivel de acabamento.</h1>
                    <p>
                        Atualize dados de acesso e seguranca dentro de uma area mais limpa,
                        consistente e alinhada ao novo visual do produto.
                    </p>
                </div>
            </section>

            <section className="page-panel">
                <div className="page-panel-inner" style={{ display: 'grid', gap: '20px' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#11254f' }}>
                                <User size={18} />
                                Informacoes da conta
                            </h3>
                        </div>
                        <div className="card-body">
                            {user && (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '16px',
                                    }}
                                >
                                    <div style={infoCardStyle}>
                                        <span style={{ fontSize: '12px', color: '#60708b', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Funcao
                                        </span>
                                        <strong style={{ fontSize: '16px', color: user.role === 'ADMIN' ? '#0a88df' : '#09a37d' }}>
                                            {user.role === 'ADMIN' ? 'Administrador' : 'Analista'}
                                        </strong>
                                    </div>
                                    <div style={infoCardStyle}>
                                        <span style={{ fontSize: '12px', color: '#60708b', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Conta criada em
                                        </span>
                                        <strong style={{ fontSize: '16px', color: '#11254f' }}>
                                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                        </strong>
                                    </div>
                                    <div style={infoCardStyle}>
                                        <span style={{ fontSize: '12px', color: '#60708b', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Ultima atualizacao
                                        </span>
                                        <strong style={{ fontSize: '16px', color: '#11254f' }}>
                                            {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#11254f' }}>
                                <Settings size={18} />
                                Editar perfil
                            </h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: '20px',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    }}
                                >
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">
                                            Nome de usuario
                                        </label>
                                        <input
                                            {...registerProfile('username')}
                                            type="text"
                                            id="username"
                                            className="form-control"
                                            placeholder="Digite seu nome de usuario"
                                        />
                                        {profileErrors.username && (
                                            <div className="invalid-feedback">{profileErrors.username.message}</div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            {...registerProfile('email')}
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            placeholder="Digite seu email corporativo"
                                        />
                                        {profileErrors.email && (
                                            <div className="invalid-feedback">{profileErrors.email.message}</div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginTop: '18px' }}>
                                    <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
                                        <Save size={18} />
                                        {isUpdatingProfile ? 'Salvando...' : 'Salvar alteracoes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#11254f' }}>
                                <Lock size={18} />
                                Alterar senha
                            </h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: '20px',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    }}
                                >
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label htmlFor="currentPassword" className="form-label">
                                            Senha atual
                                        </label>
                                        <input
                                            {...registerPassword('currentPassword')}
                                            type="password"
                                            id="currentPassword"
                                            className="form-control"
                                            placeholder="Digite sua senha atual"
                                        />
                                        {passwordErrors.currentPassword && (
                                            <div className="invalid-feedback">{passwordErrors.currentPassword.message}</div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword" className="form-label">
                                            Nova senha
                                        </label>
                                        <input
                                            {...registerPassword('newPassword')}
                                            type="password"
                                            id="newPassword"
                                            className="form-control"
                                            placeholder="Digite sua nova senha"
                                        />
                                        {passwordErrors.newPassword && (
                                            <div className="invalid-feedback">{passwordErrors.newPassword.message}</div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirmar nova senha
                                        </label>
                                        <input
                                            {...registerPassword('confirmPassword')}
                                            type="password"
                                            id="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirme sua nova senha"
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <div className="invalid-feedback">{passwordErrors.confirmPassword.message}</div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginTop: '18px' }}>
                                    <button type="submit" className="btn btn-warning" disabled={isChangingPassword}>
                                        <Lock size={18} />
                                        {isChangingPassword ? 'Alterando...' : 'Alterar senha'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserSettings;
