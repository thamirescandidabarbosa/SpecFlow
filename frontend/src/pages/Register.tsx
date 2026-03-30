import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    background:
        'radial-gradient(circle at top, rgba(255,255,255,0.75), transparent 24%), linear-gradient(135deg, #08a8ea 0%, #0b93df 42%, #0478cb 100%)',
};

const shellStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1140px',
    minHeight: '720px',
    display: 'grid',
    gridTemplateColumns: '1fr 1.04fr',
    background: '#ffffff',
    borderRadius: '28px',
    overflow: 'hidden',
    boxShadow: '0 36px 90px rgba(5, 56, 96, 0.24)',
};

const formPanelStyle: React.CSSProperties = {
    padding: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
        'linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(244,250,255,0.96) 45%, rgba(230,243,252,0.92) 100%)',
    borderRight: '1px solid rgba(9, 111, 178, 0.08)',
};

const heroStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    padding: '56px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'linear-gradient(180deg, #18ace7 0%, #0497db 100%)',
    color: '#ffffff',
};

const formCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '388px',
    padding: '18px 0',
};

const titleStyle: React.CSSProperties = {
    margin: '0 0 10px 0',
    fontSize: '2.15rem',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: '#11254f',
};

const fieldStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    border: '1px solid #d9e6f2',
    borderRadius: '12px',
    background: '#eef5fb',
    padding: '0 16px',
    fontSize: '0.98rem',
    color: '#16325c',
    outline: 'none',
    boxSizing: 'border-box',
};

const primaryButtonStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #13a8ea 0%, #0a88df 100%)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 14px 28px rgba(8, 137, 223, 0.28)',
};

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
        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <div style={shellStyle}>
                <section style={formPanelStyle}>
                    <div style={formCardStyle}>
                        <div style={{ marginBottom: '26px' }}>
                            <div
                                style={{
                                    width: '58px',
                                    height: '58px',
                                    borderRadius: '18px',
                                    background: 'rgba(17, 123, 207, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#0a7dd7',
                                    marginBottom: '18px',
                                }}
                            >
                                <UserPlus size={28} />
                            </div>
                            <h2 style={titleStyle}>CADASTRO</h2>
                            <p style={{ margin: 0, color: '#6b7a93', lineHeight: 1.7 }}>
                                Crie seu acesso para acompanhar especificacoes, arquivos e validacoes.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label
                                    htmlFor="username"
                                    style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#31486f' }}
                                >
                                    Nome do usuario
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    autoComplete="username"
                                    placeholder="Ex.: Thamires Barbosa"
                                    style={fieldStyle}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label
                                    htmlFor="email"
                                    style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#31486f' }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    autoComplete="email"
                                    placeholder="mail@empresa.com"
                                    style={fieldStyle}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label
                                    htmlFor="password"
                                    style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#31486f' }}
                                >
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                    placeholder="Use uma senha forte"
                                    style={fieldStyle}
                                />
                                <small style={{ display: 'block', marginTop: '8px', color: passwordIsStrong ? '#108b68' : '#6b7a93' }}>
                                    Use 8+ caracteres com maiuscula, minuscula, numero e simbolo.
                                </small>
                            </div>

                            <div style={{ marginBottom: '22px' }}>
                                <label
                                    htmlFor="confirmPassword"
                                    style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#31486f' }}
                                >
                                    Confirmar senha
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                    placeholder="Repita a senha"
                                    style={fieldStyle}
                                />
                                {formData.confirmPassword && !passwordsMatch && (
                                    <small style={{ display: 'block', marginTop: '8px', color: '#c62828' }}>
                                        As senhas precisam ser iguais.
                                    </small>
                                )}
                            </div>

                            <button
                                type="submit"
                                style={{
                                    ...primaryButtonStyle,
                                    opacity: isLoading || !passwordIsStrong || !passwordsMatch ? 0.72 : 1,
                                    marginBottom: '20px',
                                }}
                                disabled={isLoading || !passwordIsStrong || !passwordsMatch}
                            >
                                {isLoading ? 'Cadastrando...' : 'Criar conta'}
                            </button>
                        </form>

                        <div
                            style={{
                                borderTop: '1px solid #e6eef7',
                                paddingTop: '22px',
                                display: 'grid',
                                gap: '12px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#48627f' }}>
                                <CheckCircle2 size={18} color="#09a37d" />
                                Seu perfil entra com acesso padrao de analista.
                            </div>
                            <Link
                                to="/login"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#133968',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                Ja tem uma conta? Faca login <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>

                <section style={heroStyle}>
                    <div>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 16px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(8px)',
                                marginBottom: '22px',
                                fontWeight: 700,
                                letterSpacing: '0.02em',
                            }}
                        >
                            <ShieldCheck size={18} />
                            Fluxo protegido
                        </div>
                        <h1
                            style={{
                                margin: '0 0 16px 0',
                                fontSize: '2.9rem',
                                lineHeight: 1.04,
                                letterSpacing: '-0.05em',
                            }}
                        >
                            Organize cada entrega em um unico espaco.
                        </h1>
                        <p
                            style={{
                                margin: 0,
                                maxWidth: '420px',
                                fontSize: '1.02rem',
                                lineHeight: 1.7,
                                color: 'rgba(255,255,255,0.9)',
                            }}
                        >
                            Com seu cadastro ativo, voce acompanha alteracoes, publica arquivos e
                            centraliza todo o contexto das especificacoes funcionais.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gap: '16px',
                            marginTop: '30px',
                        }}
                    >
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.18)',
                                borderRadius: '20px',
                                padding: '20px 22px',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <strong style={{ display: 'block', marginBottom: '8px' }}>Acesso imediato</strong>
                            <span style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
                                Entre, consulte arquivos compartilhados e acompanhe o status das demandas.
                            </span>
                        </div>
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.14)',
                                borderRadius: '20px',
                                padding: '22px',
                                display: 'grid',
                                gap: '12px',
                            }}
                        >
                            {[
                                'Painel centralizado para specs e anexos',
                                'Autenticacao segura com senha forte',
                                'Fluxo pronto para aprovacao e consulta',
                            ].map((item) => (
                                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CheckCircle2 size={18} color="#ffffff" />
                                    <span style={{ color: 'rgba(255,255,255,0.92)' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Register;
