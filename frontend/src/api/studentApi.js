import axios from './axiosConfig';

export const studentApi = {
    getAll: (params) => axios.get('/students', { params }),
    getById: (id) => axios.get(`/students/${id}`),
    create: (data) => axios.post('/students', data),
    update: (id, data) => axios.put(`/students/${id}`, data),
    delete: (id) => axios.delete(`/students/${id}`)
};

export const degreeProgramApi = {
    getAll: () => axios.get('/degree-programs')
};
