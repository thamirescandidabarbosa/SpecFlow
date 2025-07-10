import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar se existe usuário armazenado no localStorage
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();

        if (storedUser && storedToken) {
            setUser(storedUser);
        }

        setLoading(false);
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const authData = await authService.login(credentials);
            authService.storeAuth(authData);
            setUser(authData.user);
            toast.success('Login realizado com sucesso!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao fazer login';
            toast.error(message);
            throw error;
        }
    };

    const register = async (userData: RegisterRequest) => {
        try {
            const authData = await authService.register(userData);
            authService.storeAuth(authData);
            setUser(authData.user);
            toast.success('Cadastro realizado com sucesso!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao fazer cadastro';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.info('Logout realizado com sucesso!');
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
