import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, FileText, Upload, Home, User, Plus, Settings, ChevronDown } from 'lucide-react';

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
    
    // Verificar se a tela é mobile
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
    
    // Fechar o dropdown ao clicar fora dele
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
                    {/* Dropdown de configurações do Admin — desenvolvido com base no componente existente por Thamires Candida Barbosa */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <div 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease',
                                backgroundColor: dropdownOpen ? '#f5f5f5' : 'transparent',
                                border: dropdownOpen ? '1px solid #e0e0e0' : '1px solid transparent'
                            }}
                        >
                            <User size={18} />
                            <span style={{ fontSize: '14px', color: '#666' }}>
                                {user?.username} 
                                {!isMobile && (
                                    <span>({user?.role})</span>
                                )}
                            </span>
                            <ChevronDown size={14} style={{ 
                                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                            }} />
                        </div>
                        
                        {dropdownOpen && (
                            <div className="dropdown-menu" style={{
                                position: 'absolute',
                                top: '100%',
                                right: isMobile ? '-10px' : 0,
                                marginTop: '10px',
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                padding: '8px 0',
                                minWidth: isMobile ? '180px' : '200px',
                                maxWidth: 'calc(100vw - 30px)',
                                zIndex: 1000,
                                animation: '0.2s ease-out',
                                opacity: 1,
                                transform: 'translateY(0)',
                                transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
                            }}>
                                {/* Seta indicativa no topo do dropdown */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '20px',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: 'white',
                                    transform: 'rotate(45deg)',
                                    boxShadow: '-2px -2px 3px rgba(0,0,0,0.05)'
                                }}></div>
                                
                                <Link
                                    to="/settings"
                                    onClick={() => setDropdownOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 15px',
                                        textDecoration: 'none',
                                        color: '#666',
                                        transition: 'background-color 0.2s ease',
                                        fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Settings size={16} />
                                    Configurações
                                    {user?.role === 'ADMIN' && (
                                        <span style={{ 
                                            fontSize: '12px', 
                                            backgroundColor: '#e6f7ff', 
                                            color: '#007bff',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            marginLeft: '4px'
                                        }}>
                                            Admin
                                        </span>
                                    )}
                                </Link>
                                
                                {/* Opções adicionais para administradores */}
                                {user?.role === 'ADMIN' && (
                                    <>
                                        <div style={{ 
                                            margin: '5px 15px',
                                            borderBottom: '1px solid #eee',
                                        }}></div>
                                        
                                        <div style={{ 
                                            padding: '6px 15px',
                                            fontSize: '12px',
                                            color: '#999',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}>
                                            Ferramentas de Administração
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
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
