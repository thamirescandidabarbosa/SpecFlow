import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
    maxWidth: '1100px',
    minHeight: '680px',
    display: 'grid',
    gridTemplateColumns: '1.08fr 1fr',
    background: '#ffffff',
    borderRadius: '28px',
    overflow: 'hidden',
    boxShadow: '0 36px 90px rgba(5, 56, 96, 0.24)',
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

const formPanelStyle: React.CSSProperties = {
    padding: '64px 56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
        'linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(244,250,255,0.96) 45%, rgba(230,243,252,0.92) 100%)',
    borderLeft: '1px solid rgba(9, 111, 178, 0.08)',
};

const formCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '360px',
    padding: '18px 0',
};

const titleStyle: React.CSSProperties = {
    margin: '0 0 10px 0',
    fontSize: '2.2rem',
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

const secondaryButtonStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    background: '#f2f7fc',
    color: '#0d71be',
    border: '1px solid #d6e5f4',
    boxShadow: 'none',
};

const decorativeLineStyle: React.CSSProperties = {
    position: 'absolute',
    left: '8%',
    right: '8%',
    bottom: '15%',
    height: '2px',
    background: 'rgba(13, 48, 86, 0.55)',
};

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
        <div style={pageStyle}>
            <div style={shellStyle}>
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
                            SpecFlow Workspace
                        </div>
                        <h1
                            style={{
                                margin: '0 0 16px 0',
                                fontSize: '3rem',
                                lineHeight: 1.02,
                                letterSpacing: '-0.05em',
                            }}
                        >
                            Acesse seu fluxo com mais clareza.
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
                            Entre na plataforma para acompanhar especificacoes, arquivos e
                            aprovacoes em um ambiente mais organizado e seguro.
                        </p>
                    </div>

                    <div
                        style={{
                            position: 'relative',
                            minHeight: '310px',
                            marginTop: '28px',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: '6%',
                                bottom: '18%',
                                width: '130px',
                                height: '130px',
                                borderRadius: '50% 50% 48% 52%',
                                background: 'rgba(255,255,255,0.9)',
                                transform: 'rotate(-12deg)',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                right: '10%',
                                bottom: '14%',
                                width: '110px',
                                height: '110px',
                                borderRadius: '46% 54% 50% 50%',
                                background: 'rgba(255,255,255,0.88)',
                                transform: 'rotate(18deg)',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                left: '30%',
                                bottom: '18%',
                                width: '170px',
                                height: '250px',
                                borderRadius: '90px 90px 24px 24px',
                                background: '#d9d9de',
                                boxShadow: '28px 0 0 rgba(255,255,255,0.82)',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '58px',
                                    left: '40px',
                                    width: '80px',
                                    height: '136px',
                                    borderRadius: '8px',
                                    background: '#ffffff',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    overflow: 'hidden',
                                    border: '2px solid #ececf0',
                                }}
                            >
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <div
                                        key={index}
                                        style={{ border: '1px solid #d8dde6', background: '#ffffff' }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                left: '58%',
                                bottom: '15%',
                                width: '74px',
                                height: '180px',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '14px',
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    background: '#ffe2db',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '32px',
                                    width: '28px',
                                    height: '24px',
                                    borderRadius: '45% 55% 50% 50%',
                                    background: '#2d3153',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '48px',
                                    left: '8px',
                                    width: '58px',
                                    height: '86px',
                                    borderRadius: '18px 18px 8px 8px',
                                    background: 'linear-gradient(180deg, #229cff 0%, #177be0 100%)',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '76px',
                                    left: '1px',
                                    width: '16px',
                                    height: '76px',
                                    borderRadius: '999px',
                                    background: '#ffd0ca',
                                    transform: 'rotate(12deg)',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '78px',
                                    right: '2px',
                                    width: '16px',
                                    height: '82px',
                                    borderRadius: '999px',
                                    background: '#ffd0ca',
                                    transform: 'rotate(-8deg)',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    left: '16px',
                                    width: '18px',
                                    height: '72px',
                                    borderRadius: '999px',
                                    background: '#2c355b',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '14px',
                                    right: '15px',
                                    width: '18px',
                                    height: '76px',
                                    borderRadius: '999px',
                                    background: '#2c355b',
                                }}
                            />
                        </div>
                        <div style={decorativeLineStyle} />
                    </div>
                </section>

                <section style={formPanelStyle}>
                    <div style={formCardStyle}>
                        <div style={{ marginBottom: '28px' }}>
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
                                <LogIn size={28} />
                            </div>
                            <h2 style={titleStyle}>LOGIN</h2>
                            <p style={{ margin: 0, color: '#6b7a93', lineHeight: 1.7 }}>
                                Entre com sua conta para continuar no ambiente de especificacoes.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '18px' }}>
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
                                    autoComplete="email"
                                    disabled={isBusy}
                                    placeholder="mail@empresa.com"
                                    style={fieldStyle}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
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
                                    autoComplete="current-password"
                                    disabled={isBusy}
                                    placeholder="Digite sua senha"
                                    style={fieldStyle}
                                />
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginBottom: '22px',
                                }}
                            >
                                <Link
                                    to="/register"
                                    style={{ color: '#0d84dc', fontWeight: 600, textDecoration: 'none' }}
                                >
                                    Criar conta
                                </Link>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    ...primaryButtonStyle,
                                    opacity: isBusy ? 0.72 : 1,
                                    marginBottom: googleEnabled ? '12px' : '20px',
                                }}
                                disabled={isBusy}
                            >
                                {isFormLoading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        {googleEnabled && (
                            <button
                                type="button"
                                style={{
                                    ...secondaryButtonStyle,
                                    opacity: isBusy ? 0.72 : 1,
                                    marginBottom: '22px',
                                }}
                                onClick={handleGoogleLogin}
                                disabled={isBusy}
                            >
                                {isGoogleLoading ? 'Conectando ao Google...' : 'Continuar com Google'}
                            </button>
                        )}

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
                                Acesse projetos, arquivos e historico no mesmo lugar.
                            </div>
                            <Link
                                to="/register"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#133968',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                Nao tem uma conta? Cadastre-se <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
