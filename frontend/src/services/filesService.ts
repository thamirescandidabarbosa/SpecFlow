import api from './api';
import { FileUpload } from '../types';

export const filesService = {
    async getAll(): Promise<FileUpload[]> {
        const response = await api.get('/files');
        return response.data;
    },

    async getById(id: string): Promise<FileUpload> {
        const response = await api.get(`/files/${id}`);
        return response.data;
    },

    async upload(file: File): Promise<FileUpload> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/files/${id}`);
    },

    getFileUrl(filename: string): string {
        return `http://localhost:3001/api/uploads/${filename}`;
    },
};
