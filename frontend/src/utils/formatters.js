import { format } from 'date-fns';

export const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateInput = (date) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy-MM-dd');
};

export const formatStudentNumber = (number) => {
    return number || 'N/A';
};
