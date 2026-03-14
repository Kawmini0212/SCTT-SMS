import axios from 'axios';

const authBaseURL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5001/api';

export const authApi = {
    login: async (username, password) => {
        const response = await axios.post(`${authBaseURL}/auth/login`, {
            username,
            password
        });
        return response.data;
    },

    getCurrentUser: async (token) => {
        const response = await axios.get(`${authBaseURL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    logout: async (token) => {
        const response = await axios.post(
            `${authBaseURL}/auth/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    }
};
