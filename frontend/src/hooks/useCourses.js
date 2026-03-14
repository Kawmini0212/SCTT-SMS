import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';
import { toast } from 'react-toastify';

export const useCourses = (params) =>
    useQuery({
        queryKey: ['courses', params],
        queryFn: () => courseApi.getAll(params),
    });

export const useCourse = (id) =>
    useQuery({
        queryKey: ['courses', id],
        queryFn: () => courseApi.getById(id),
        enabled: !!id,
    });

export const useSemesters = () =>
    useQuery({
        queryKey: ['semesters'],
        queryFn: courseApi.getSemesters,
    });

export const useCreateCourse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: courseApi.create,
        onSuccess: (response) => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['auditLogs'] });
            qc.invalidateQueries({ queryKey: ['auditStats'] });
            toast.success('Course created successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create course');
        },
    });
};

export const useUpdateCourse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => courseApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['auditLogs'] });
            qc.invalidateQueries({ queryKey: ['auditStats'] });
            toast.success('Course updated successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update course');
        },
    });
};

export const useDeleteCourse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: courseApi.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['auditLogs'] });
            qc.invalidateQueries({ queryKey: ['auditStats'] });
            toast.success('Course deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete course');
        },
    });
};
