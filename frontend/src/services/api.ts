import axios from 'axios';

// Configure a URL base da API baseada no ambiente
const getBaseURL = () => {
    // Se estiver em desenvolvimento, usa localhost
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3001';
    }
    
    // Em produção, usa a URL do backend no Railway (atualize quando fizer deploy)
    return process.env.REACT_APP_API_URL || 'https://specflow-backend.railway.app';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
