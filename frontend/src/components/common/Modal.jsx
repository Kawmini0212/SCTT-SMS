import { FiX } from 'react-icons/fi';

export default function Modal({
    open,
    onClose,
    title,
    subtitle,
    children,
    footer,
    maxWidth = 'max-w-2xl',
    icon: Icon,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-brand-black/70"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative ${maxWidth} w-full bg-brand-white rounded-xl shadow-2xl
                     animate-scale-in overflow-hidden`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Flat red header */}
                    <div className="bg-brand-red px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {Icon && (
                                <div className="w-10 h-10 bg-brand-black/20 rounded-lg
                               flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-brand-white" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-bold text-brand-white">{title}</h3>
                                {subtitle && (
                                    <p className="text-brand-white/70 text-sm mt-0.5">{subtitle}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-brand-black/20 hover:bg-brand-black/40
                         transition-colors text-brand-white ml-4 flex-shrink-0"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex gap-3 justify-end px-8 py-5
                           border-t border-brand-gray2 bg-brand-gray rounded-b-xl">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
