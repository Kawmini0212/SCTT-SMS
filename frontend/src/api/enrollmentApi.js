import { enrollmentAxios } from './axiosConfig';

export const enrollmentApi = {
    // List all enrollments (paginated + filtered)
    getAll: (params) => enrollmentAxios.get('/enrollments', { params }),

    // Get single enrollment by ID
    getById: (id) => enrollmentAxios.get(`/enrollments/${id}`),

    // Enroll a student in courses
    enroll: (data) => enrollmentAxios.post('/enrollments', data),

    // Full course history for a student
    getStudentHistory: (studentId) =>
        enrollmentAxios.get(`/enrollments/student/${studentId}/history`),

    // Get enrollments for a specific semester
    getStudentSemester: (studentId, params) =>
        enrollmentAxios.get(`/enrollments/student/${studentId}/semester`, { params }),

    // Change courses for a semester (replace)
    updateSemesterCourses: (studentId, data) =>
        enrollmentAxios.put(`/enrollments/student/${studentId}/semester`, data),

    // Update enrollment status
    updateStatus: (id, status) =>
        enrollmentAxios.patch(`/enrollments/${id}/status`, { status }),

    // Delete an enrollment
    delete: (id) => enrollmentAxios.delete(`/enrollments/${id}`),
};
