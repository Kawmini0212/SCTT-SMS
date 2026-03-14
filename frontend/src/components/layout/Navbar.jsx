import { useState } from 'react';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-black border-b-4 border-brand-red">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
                        >
                            <FiMenu className="w-6 h-6 text-brand-white" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center">
                                <span className="text-brand-white font-bold text-xl">S</span>
                            </div>
                            <h1 className="text-xl font-bold text-brand-white hidden sm:block tracking-wide">
                                Student Management
                            </h1>
                        </div>
                    </div>

                    {/* Right: User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg
                                       hover:bg-white/10 transition-all"
                        >
                            <div className="w-9 h-9 bg-brand-yellow rounded-lg flex items-center justify-center">
                                <FiUser className="w-5 h-5 text-brand-black" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-brand-white">
                                    {user?.fullName || user?.username}
                                </p>
                                <p className="text-xs text-brand-gray3">Administrator</p>
                            </div>
                        </button>

                        {/* Dropdown */}
                        {showDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowDropdown(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-brand-white rounded-xl shadow-2xl
                                               border border-brand-gray2 z-20 overflow-hidden animate-scale-in">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left hover:bg-brand-gray transition-colors
                                                   flex items-center gap-3 text-brand-black font-medium"
                                    >
                                        <FiLogOut className="w-4 h-4 text-brand-red" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
