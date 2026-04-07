import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ChevronDown,
    FileText,
    Home,
    LogOut,
    Plus,
    Settings,
    Upload,
    User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { withAppBasePath } from '../utils/runtimeBase';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="app-navbar">
            <div className="container">
                <div className="app-navbar-shell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                        <Link
                            to="/"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            <img
                                src={withAppBasePath('/logoSpecFlow.png')}
                                alt="SpecFlow"
                                style={{ height: '42px', width: 'auto', display: 'block' }}
                            />
                        </Link>

                        <div className="app-navbar-links">
                            <Link to="/" className={`app-nav-link ${isActive('/') ? 'active' : ''}`}>
                                <Home size={18} />
                                Dashboard
                            </Link>

                            <Link to="/files" className={`app-nav-link ${isActive('/files') ? 'active' : ''}`}>
                                <Upload size={18} />
                                Arquivos
                            </Link>

                            <Link
                                to="/functional-specifications"
                                className={`app-nav-link ${isActive('/functional-specifications') ? 'active' : ''}`}
                            >
                                <FileText size={18} />
                                Especificacoes
                            </Link>

                            <Link
                                to="/functional-specification"
                                className={`app-nav-link ${isActive('/functional-specification') ? 'active' : ''}`}
                            >
                                <Plus size={18} />
                                Nova Especificacao
                            </Link>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <button
                                type="button"
                                className="app-user-chip"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                style={{
                                    backgroundColor: dropdownOpen ? '#eef6fd' : '#f7fbff',
                                }}
                            >
                                <User size={18} />
                                <span style={{ fontSize: '14px', color: '#26405f', fontWeight: 600 }}>
                                    {user?.username}
                                    {!isMobile && (
                                        <span style={{ color: '#6a7f99' }}> ({user?.role})</span>
                                    )}
                                </span>
                                <ChevronDown
                                    size={14}
                                    style={{
                                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease',
                                    }}
                                />
                            </button>

                            {dropdownOpen && (
                                <div
                                    className="dropdown-menu"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: isMobile ? '-10px' : 0,
                                        marginTop: '10px',
                                        backgroundColor: 'white',
                                        borderRadius: '18px',
                                        boxShadow: '0 24px 48px rgba(15, 66, 108, 0.16)',
                                        padding: '8px 0',
                                        minWidth: isMobile ? '180px' : '220px',
                                        maxWidth: 'calc(100vw - 30px)',
                                        zIndex: 1000,
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '-6px',
                                            right: '20px',
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: 'white',
                                            transform: 'rotate(45deg)',
                                            boxShadow: '-2px -2px 3px rgba(0,0,0,0.05)',
                                        }}
                                    />

                                    <Link
                                        to="/settings"
                                        onClick={() => setDropdownOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '12px 16px',
                                            textDecoration: 'none',
                                            color: '#48627f',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f4f9fe';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <Settings size={16} />
                                        Configuracoes
                                        {user?.role === 'ADMIN' && (
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    backgroundColor: '#e6f7ff',
                                                    color: '#007bff',
                                                    padding: '2px 6px',
                                                    borderRadius: '10px',
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                Admin
                                            </span>
                                        )}
                                    </Link>

                                    {user?.role === 'ADMIN' && (
                                        <>
                                            <div
                                                style={{
                                                    margin: '5px 15px',
                                                    borderBottom: '1px solid #e6eef7',
                                                }}
                                            />

                                            <div
                                                style={{
                                                    padding: '6px 15px',
                                                    fontSize: '12px',
                                                    color: '#8da2bb',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Ferramentas de Administracao
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{
                                color: '#b93a52',
                                minHeight: '42px',
                            }}
                        >
                            <LogOut size={18} />
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
