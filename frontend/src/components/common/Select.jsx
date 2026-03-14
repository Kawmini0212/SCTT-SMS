import { forwardRef } from 'react';

const Select = forwardRef(({
    label,
    error,
    children,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p className="mt-1 text-sm text-danger-500 animate-slide-in">
                    {error}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
