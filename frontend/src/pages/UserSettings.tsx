// Formulário de configurações ajustado — otimizado por Thamires Candida Barbosa para melhor UX
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { User, Settings, Lock, Save, ChevronRight } from 'lucide-react';
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
        <div style={{ 
            maxWidth: '800px', 
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
                <Settings size={28} color="#333" />
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333'
                }}>Configurações da Conta</h1>
            </div>

            {/* Informações do Usuário */}
            <div className="card" style={{ 
                marginBottom: '35px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
            }}>
                <div className="card-header" style={{
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #eee',
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
                        color: '#444'
                    }}>
                        <User size={18} />
                        Informações da Conta
                    </h3>
                </div>
                <div className="card-body" style={{
                    padding: '20px'
                }}>
                    {user && (
                        <div style={{ 
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: '16px',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '14px 18px',
                                borderRadius: '6px',
                                border: '1px solid #eee',
                                flex: '1',
                                minWidth: '180px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>Função</div>
                                <div style={{ 
                                    fontSize: '16px', 
                                    fontWeight: '600',
                                    color: user.role === 'ADMIN' ? '#007bff' : '#28a745'
                                }}>
                                    {user.role === 'ADMIN' ? 'Administrador' : 'Analista'}
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '14px 18px',
                                borderRadius: '6px',
                                border: '1px solid #eee',
                                flex: '1',
                                minWidth: '180px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>Conta criada em</div>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '14px 18px',
                                borderRadius: '6px',
                                border: '1px solid #eee',
                                flex: '1',
                                minWidth: '180px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    marginBottom: '8px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>Última atualização</div>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Formulário de Perfil */}
            <div className="card" style={{ 
                marginBottom: '35px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
            }}>
                <div className="card-header" style={{
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #eee',
                    padding: '15px 20px',
                    borderRadius: '6px 6px 0 0'
                }}>
                    <h3 style={{ 
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Settings size={18} />
                        Editar Perfil
                    </h3>
                </div>
                <div className="card-body" style={{
                    padding: '25px 20px'
                }}>
                    <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                        <div style={{ 
                            display: 'grid', 
                            gap: '22px',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                        }}>
                            <div className="form-group" style={{ 
                                display: 'flex', 
                                flexDirection: 'column'
                            }}>
                                <label htmlFor="username" style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#555',
                                    marginBottom: '8px'
                                }}>
                                    Nome de Usuário
                                </label>
                                <input
                                    {...registerProfile('username')}
                                    type="text"
                                    id="username"
                                    className={`form-control ${profileErrors.username ? 'is-invalid' : ''}`}
                                    placeholder="Digite seu nome de usuário"
                                    style={{
                                        fontSize: '15px',
                                        padding: '12px 15px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        transition: 'border-color 0.2s',
                                        width: '100%'
                                    }}
                                />
                                {profileErrors.username && (
                                    <div className="invalid-feedback" style={{
                                        color: '#dc3545',
                                        fontSize: '13px',
                                        marginTop: '6px'
                                    }}>
                                        {profileErrors.username.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group" style={{ 
                                display: 'flex', 
                                flexDirection: 'column'
                            }}>
                                <label htmlFor="email" style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#555',
                                    marginBottom: '8px'
                                }}>
                                    Email
                                </label>
                                <input
                                    {...registerProfile('email')}
                                    type="email"
                                    id="email"
                                    className={`form-control ${profileErrors.email ? 'is-invalid' : ''}`}
                                    placeholder="Digite seu email corporativo"
                                    style={{
                                        fontSize: '15px',
                                        padding: '12px 15px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        transition: 'border-color 0.2s',
                                        width: '100%'
                                    }}
                                />
                                {profileErrors.email && (
                                    <div className="invalid-feedback" style={{
                                        color: '#dc3545',
                                        fontSize: '13px',
                                        marginTop: '6px'
                                    }}>
                                        {profileErrors.email.message}
                                    </div>
                                )}
                            </div>

                            <div style={{ 
                                gridColumn: '1/-1', 
                                marginTop: '10px'
                            }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isUpdatingProfile}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        cursor: isUpdatingProfile ? 'wait' : 'pointer',
                                        transition: 'background-color 0.2s',
                                        opacity: isUpdatingProfile ? 0.8 : 1
                                    }}
                                >
                                    <Save size={18} />
                                    {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Formulário de Alteração de Senha */}
            <div className="card" style={{ 
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
            }}>
                <div className="card-header" style={{
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #eee',
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
                        color: '#444'
                    }}>
                        <Lock size={18} />
                        Alterar Senha
                    </h3>
                </div>
                <div className="card-body" style={{
                    padding: '25px 20px'
                }}>
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                        <div style={{ 
                            display: 'grid', 
                            gap: '22px',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                        }}>
                            <div className="form-group" style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gridColumn: '1/-1'
                            }}>
                                <label htmlFor="currentPassword" style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#555',
                                    marginBottom: '8px'
                                }}>
                                    Senha Atual
                                </label>
                                <input
                                    {...registerPassword('currentPassword')}
                                    type="password"
                                    id="currentPassword"
                                    className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                                    placeholder="Digite sua senha atual"
                                    style={{
                                        fontSize: '15px',
                                        padding: '12px 15px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        transition: 'border-color 0.2s'
                                    }}
                                />
                                {passwordErrors.currentPassword && (
                                    <div className="invalid-feedback" style={{
                                        color: '#dc3545',
                                        fontSize: '13px',
                                        marginTop: '6px'
                                    }}>
                                        {passwordErrors.currentPassword.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group" style={{ 
                                display: 'flex', 
                                flexDirection: 'column'
                            }}>
                                <label htmlFor="newPassword" style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#555',
                                    marginBottom: '8px'
                                }}>
                                    Nova Senha
                                </label>
                                <input
                                    {...registerPassword('newPassword')}
                                    type="password"
                                    id="newPassword"
                                    className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                                    placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                                    style={{
                                        fontSize: '15px',
                                        padding: '12px 15px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        transition: 'border-color 0.2s'
                                    }}
                                />
                                {passwordErrors.newPassword && (
                                    <div className="invalid-feedback" style={{
                                        color: '#dc3545',
                                        fontSize: '13px',
                                        marginTop: '6px'
                                    }}>
                                        {passwordErrors.newPassword.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group" style={{ 
                                display: 'flex', 
                                flexDirection: 'column'
                            }}>
                                <label htmlFor="confirmPassword" style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#555',
                                    marginBottom: '8px'
                                }}>
                                    Confirmar Nova Senha
                                </label>
                                <input
                                    {...registerPassword('confirmPassword')}
                                    type="password"
                                    id="confirmPassword"
                                    className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                                    placeholder="Confirme sua nova senha"
                                    style={{
                                        fontSize: '15px',
                                        padding: '12px 15px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        transition: 'border-color 0.2s'
                                    }}
                                />
                                {passwordErrors.confirmPassword && (
                                    <div className="invalid-feedback" style={{
                                        color: '#dc3545',
                                        fontSize: '13px',
                                        marginTop: '6px'
                                    }}>
                                        {passwordErrors.confirmPassword.message}
                                    </div>
                                )}
                            </div>

                            <div style={{ 
                                gridColumn: '1/-1', 
                                marginTop: '10px'
                            }}>
                                <button
                                    type="submit"
                                    className="btn btn-warning"
                                    disabled={isChangingPassword}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        padding: '10px 20px',
                                        backgroundColor: '#ffc107',
                                        color: '#212529',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        cursor: isChangingPassword ? 'wait' : 'pointer',
                                        transition: 'background-color 0.2s',
                                        opacity: isChangingPassword ? 0.8 : 1
                                    }}
                                >
                                    <Lock size={18} />
                                    {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
