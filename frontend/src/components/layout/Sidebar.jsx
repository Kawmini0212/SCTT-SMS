import { FiHome, FiUsers, FiBook, FiClipboard, FiShield } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
    { text: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { text: 'Students', icon: FiUsers, path: '/students' },
    { text: 'Courses', icon: FiBook, path: '/courses' },
    { text: 'Enrollments', icon: FiClipboard, path: '/enrollments' },
    { text: 'Audit Logs', icon: FiShield, path: '/audit-logs' },
];

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        if (onClose) onClose();
    };

    const sidebarContent = (
        <div className="h-full flex flex-col bg-brand-black">
            {/* Spacer for navbar */}
            <div className="h-16 border-b-4 border-brand-red" />

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        location.pathname.startsWith(item.path + '/');

                    return (
                        <button
                            key={item.text}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
                                       transition-all duration-150 font-semibold text-sm
                                       ${isActive
                                    ? 'bg-brand-red text-brand-white'
                                    : 'text-brand-gray3 hover:bg-white/10 hover:text-brand-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-white' : 'text-brand-yellow'}`} />
                            <span>{item.text}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-5 bg-brand-yellow rounded-full" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar with Overlay */}
            <div className={`lg:hidden fixed inset-0 z-30 transition-opacity duration-300
                            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-brand-black/60" onClick={onClose} />
                <div className={`absolute top-0 left-0 h-full w-64 shadow-2xl
                                transition-transform duration-300 transform
                                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {sidebarContent}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-full w-64 shadow-xl z-30">
                {sidebarContent}
            </div>
        </>
    );
}
