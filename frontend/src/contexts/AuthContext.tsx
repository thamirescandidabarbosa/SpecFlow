import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    completeSocialLogin: (token: string, userJson: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
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

    const applyAuth = useCallback((authData: { access_token: string; user: User }) => {
        authService.storeAuth(authData);
        setUser(authData.user);
    }, []);

    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = authService.getStoredToken();
            const storedUser = authService.getStoredUser();

            if (!storedToken || !storedUser) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await authService.fetchCurrentUser();
                setUser(currentUser);
                authService.storeAuth({
                    access_token: storedToken,
                    user: currentUser,
                });
            } catch (error) {
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const authData = await authService.login(credentials);
            if (!authData.access_token || !authData.user) {
                throw new Error('Credenciais invalidas');
            }
            applyAuth(authData);
            toast.success('Login realizado com sucesso!', { autoClose: 5000 });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Erro ao fazer login';
            toast.error(message, { autoClose: 5000 });
            throw error;
        }
    };

    const register = async (userData: RegisterRequest) => {
        try {
            const authData = await authService.register(userData);
            applyAuth(authData);
            toast.success('Cadastro realizado com sucesso!', { autoClose: 5000 });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao fazer cadastro';
            toast.error(message, { autoClose: 5000 });
            throw error;
        }
    };

    const completeSocialLogin = async (token: string, userJson: string) => {
        const parsedUser = JSON.parse(userJson) as User;
        applyAuth({
            access_token: token,
            user: parsedUser,
        });
        toast.success('Login com Google realizado com sucesso!', { autoClose: 5000 });
    };

    const loginWithGoogle = async () => {
        await authService.startGoogleLogin();
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.info('Logout realizado com sucesso!', { autoClose: 5000 });
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        completeSocialLogin,
        loginWithGoogle,
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
