import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, FileText, Upload, Home, User, Plus, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav style={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #e0e0e0',
            padding: '0 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '60px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <h2 style={{ margin: 0, color: '#333' }}>SPECFLOW</h2>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link
                            to="/"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: isActive('/') ? '#007bff' : '#666',
                                fontWeight: isActive('/') ? '500' : 'normal'
                            }}
                        >
                            <Home size={18} />
                            Dashboard
                        </Link>

                        <Link
                            to="/files"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: isActive('/files') ? '#007bff' : '#666',
                                fontWeight: isActive('/files') ? '500' : 'normal'
                            }}
                        >
                            <Upload size={18} />
                            Arquivos
                        </Link>

                        <Link
                            to="/functional-specifications"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: isActive('/functional-specifications') ? '#007bff' : '#666',
                                fontWeight: isActive('/functional-specifications') ? '500' : 'normal'
                            }}
                        >
                            <FileText size={18} />
                            Especificações
                        </Link>

                        <Link
                            to="/functional-specification"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: isActive('/functional-specification') ? '#007bff' : '#666',
                                fontWeight: isActive('/functional-specification') ? '500' : 'normal'
                            }}
                        >
                            <Plus size={18} />
                            Nova Especificação
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link
                        to="/settings"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            color: isActive('/settings') ? '#007bff' : '#666',
                            fontWeight: isActive('/settings') ? '500' : 'normal'
                        }}
                    >
                        <Settings size={18} />
                        Configurações
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} />
                        <span style={{ fontSize: '14px', color: '#666' }}>
                            {user?.username} ({user?.role})
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
