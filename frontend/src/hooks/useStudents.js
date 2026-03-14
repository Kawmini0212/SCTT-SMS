import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { toast } from 'react-toastify';

export const useStudents = ({ page = 1, limit = 10, search = '' }) => {
    return useQuery({
        queryKey: ['students', page, limit, search],
        queryFn: () => studentApi.getAll({ page, limit, search }),
        keepPreviousData: true
    });
};

export const useStudent = (id) => {
    return useQuery({
        queryKey: ['student', id],
        queryFn: () => studentApi.getById(id),
        enabled: !!id
    });
};

export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => studentApi.create(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries(['students']);
            queryClient.invalidateQueries(['auditLogs']);
            queryClient.invalidateQueries(['auditStats']);
            toast.success(
                `Student created successfully! Student Number: ${response.data.studentNumber}`
            );
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create student');
        }
    });
};

export const useUpdateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => studentApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['students']);
            queryClient.invalidateQueries(['student', variables.id]);
            queryClient.invalidateQueries(['auditLogs']);
            queryClient.invalidateQueries(['auditStats']);
            toast.success('Student updated successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update student');
        }
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => studentApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            queryClient.invalidateQueries(['auditLogs']);
            queryClient.invalidateQueries(['auditStats']);
            toast.success('Student deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete student');
        }
    });
};
