import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../api/auditApi';

export const useAuditLogs = (params) =>
    useQuery({
        queryKey: ['auditLogs', params],
        queryFn: () => auditApi.getAll(params),
        keepPreviousData: true,
    });

export const useAuditLog = (id) =>
    useQuery({
        queryKey: ['auditLog', id],
        queryFn: () => auditApi.getById(id),
        enabled: !!id,
    });

export const useAuditStats = () =>
    useQuery({
        queryKey: ['auditStats'],
        queryFn: auditApi.getStats,
        staleTime: 30_000,
    });
