import { courseAxios } from './axiosConfig';

export const courseApi = {
    getAll: (params) => courseAxios.get('/courses', { params }),
    getSemesters: () => courseAxios.get('/courses/semesters'),
    getByIds: (ids) => courseAxios.get('/courses/by-ids', { params: { ids: ids.join(',') } }),
    getById: (id) => courseAxios.get(`/courses/${id}`),
    create: (data) => courseAxios.post('/courses', data),
    update: (id, data) => courseAxios.put(`/courses/${id}`, data),
    delete: (id) => courseAxios.delete(`/courses/${id}`),
};
