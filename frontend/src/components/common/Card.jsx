export default function Card({ children, className = '', variant = 'default', ...props }) {
    const variants = {
        default: 'card',
        glass: 'card-glass',
        gradient: 'card-gradient',
    };

    return (
        <div className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </div>
    );
}
