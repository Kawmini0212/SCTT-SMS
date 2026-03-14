import { auditAxios } from './axiosConfig';

export const auditApi = {
    // List all audit logs (paginated + filtered)
    getAll: (params) => auditAxios.get('/audit-logs', { params }),

    // Get single audit log by ID
    getById: (id) => auditAxios.get(`/audit-logs/${id}`),

    // Get statistics
    getStats: () => auditAxios.get('/audit-logs/stats'),
};
