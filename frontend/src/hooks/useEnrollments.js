import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentApi } from '../api/enrollmentApi';
import { toast } from 'react-toastify';

// ── Queries ──────────────────────────────────────────────────────────────────

export const useEnrollments = (params) =>
    useQuery({
        queryKey: ['enrollments', params],
        queryFn: () => enrollmentApi.getAll(params),
        keepPreviousData: true,
    });

export const useEnrollment = (id) =>
    useQuery({
        queryKey: ['enrollment', id],
        queryFn: () => enrollmentApi.getById(id),
        enabled: !!id,
    });

export const useStudentHistory = (studentId) =>
    useQuery({
        queryKey: ['studentHistory', studentId],
        queryFn: () => enrollmentApi.getStudentHistory(studentId),
        enabled: !!studentId,
    });

export const useStudentSemester = (studentId, params) =>
    useQuery({
        queryKey: ['studentSemester', studentId, params],
        queryFn: () => enrollmentApi.getStudentSemester(studentId, params),
        enabled: !!studentId && !!params?.semester && !!params?.academicYear,
    });

// ── Mutations ────────────────────────────────────────────────────────────────

export const useEnroll = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => enrollmentApi.enroll(data),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: ['enrollments'] });
            qc.invalidateQueries({ queryKey: ['auditLogs'] });
            qc.invalidateQueries({ queryKey: ['auditStats'] });
            toast.success(res?.message || 'Student enrolled successfully!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to enroll student');
        },
    });
};

export const useUpdateSemesterCourses = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, data }) =>
            enrollmentApi.updateSemesterCourses(studentId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['enrollments'] });
            qc.invalidateQueries({ queryKey: ['studentHistory'] });
            qc.invalidateQueries({ queryKey: ['studentSemester'] });
            qc.invalidateQueries({ queryKey: ['auditLogs'] });
            qc.invalidateQueries({ queryKey: ['auditStats'] });
            toast.success('Semester courses updated successfully!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update semester courses');
        },
    });
};

export const useUpdateEnrollmentStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => enrollmentApi.updateStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['enrollments'] });
            qc.invalidateQueries({ queryKey: ['auditLogs'] });
            qc.invalidateQueries({ queryKey: ['auditStats'] });
            toast.success('Enrollment status updated!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update status');
        },
    });
};

export const useDeleteEnrollment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => enrollmentApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['enrollments'] });
            qc.invalidateQueries({ queryKey: ['auditLogs'] });
            qc.invalidateQueries({ queryKey: ['auditStats'] });
            toast.success('Enrollment deleted successfully!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete enrollment');
        },
    });
};
