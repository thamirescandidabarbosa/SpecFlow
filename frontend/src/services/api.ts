import axios from 'axios';

// Configuração dinâmica da URL base da API
const getBaseURL = () => {
    // Em produção, usa a variável de ambiente
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    // Em desenvolvimento, usa localhost
    return 'http://localhost:3001/api';
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
