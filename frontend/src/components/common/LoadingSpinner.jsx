export default function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-6 h-6 border-2',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-4',
    };

    return (
        <div className={`flex justify-center items-center min-h-[400px] ${className}`}>
            <div className={`${sizes[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
        </div>
    );
}
