export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    icon: Icon,
}) {
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        outline: 'btn-outline',
    };

    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className} 
                  inline-flex items-center justify-center gap-2`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
}
