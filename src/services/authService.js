import axios from 'axios';
import conf from '../conf/conf';

const API_URL = conf.apiUrl;

const authService = {
    login: async (data) => {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    createAccount: async (data) => {
        const response = await axios.post(`${API_URL}/auth/signup`, data);
        return response.data;
    },
    getCurrentUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const response = await axios.get(`${API_URL}/auth/current-user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
    logout: async () => {
        const response = await axios.post(`${API_URL}/auth/logout`);
        localStorage.removeItem('token');
        return response.data;
    },
};

export default authService;
