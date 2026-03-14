import { create } from 'zustand';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('authToken'),
    isAuthenticated: false,
    isLoading: true,

    login: async (username, password) => {
        try {
            const response = await authApi.login(username, password);
            const { token, admin } = response.data;

            localStorage.setItem('authToken', token);
            set({
                user: admin,
                token,
                isAuthenticated: true,
                isLoading: false
            });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    },

    logout: () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            authApi.logout(token).catch(() => { });
        }
        localStorage.removeItem('authToken');
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    },

    initAuth: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }

        try {
            const response = await authApi.getCurrentUser(token);
            set({
                user: response.data,
                token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            localStorage.removeItem('authToken');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    }
}));
