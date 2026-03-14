import { useQuery } from '@tanstack/react-query';
import { degreeProgramApi } from '../api/studentApi';

export const useDegreePrograms = () => {
    return useQuery({
        queryKey: ['degreePrograms'],
        queryFn: () => degreeProgramApi.getAll(),
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
};
