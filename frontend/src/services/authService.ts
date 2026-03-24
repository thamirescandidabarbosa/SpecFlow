import api, { getBaseURL } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    async fetchCurrentUser(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    startGoogleLogin() {
        window.location.href = `${getBaseURL()}/auth/google`;
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
            console.warn('Dados invalidos no localStorage, limpando...', error);
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
