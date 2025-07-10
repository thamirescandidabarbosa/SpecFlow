import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getStoredUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            // Se houver erro no JSON, limpa o localStorage e retorna null
            console.warn('Dados inválidos no localStorage, limpando...', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    },

    getStoredToken() {
        try {
            return localStorage.getItem('token');
        } catch (error) {
            console.warn('Erro ao acessar token no localStorage', error);
            return null;
        }
    },

    storeAuth(authData: AuthResponse) {
        localStorage.setItem('token', authData.access_token);
        localStorage.setItem('user', JSON.stringify(authData.user));
    },
};
