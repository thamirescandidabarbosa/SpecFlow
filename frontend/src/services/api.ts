import axios from 'axios';

const defaultProductionApiUrl = 'https://specflow-backend.railway.app/api';

export const getBaseURL = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3001/api';
    }

    return process.env.REACT_APP_API_URL || defaultProductionApiUrl;
};

export const getUploadsBaseURL = () => `${getBaseURL()}/uploads`;

const api = axios.create({
    baseURL: getBaseURL(),
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
