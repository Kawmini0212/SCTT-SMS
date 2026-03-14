import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { loginValidationRules } from '../utils/validators';
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');
            const result = await login(data.username, data.password);
            if (result.success) navigate('/dashboard');
            else setError(result.error || 'Login failed');
        } catch {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-slide-in">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-16 h-16 bg-brand-red rounded-xl
                          items-center justify-center mb-4">
                        <span className="text-brand-white font-bold text-3xl">S</span>
                    </div>
                    <h1 className="text-3xl font-bold text-brand-white">Student Management</h1>
                    <p className="text-brand-gray3 mt-1">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-brand-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Red top accent */}
                    <div className="h-1.5 bg-brand-red w-full" />

                    <div className="p-8">
                        {error && (
                            <div className="mb-5 p-4 bg-red-50 border border-brand-red/30 rounded-lg
                              flex items-start gap-3 animate-slide-in">
                                <FiAlertCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                                <p className="text-brand-red text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-semibold text-brand-black mb-1.5 flex items-center gap-1.5">
                                    <FiUser className="w-4 h-4 text-brand-red" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    {...register('username', loginValidationRules.username)}
                                    placeholder="Enter your username"
                                    className={`input ${errors.username ? 'input-error' : ''}`}
                                />
                                {errors.username && (
                                    <p className="mt-1.5 text-xs text-brand-red flex items-center gap-1">
                                        <FiAlertCircle className="w-3.5 h-3.5" />
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-brand-black mb-1.5 flex items-center gap-1.5">
                                    <FiLock className="w-4 h-4 text-brand-red" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    {...register('password', loginValidationRules.password)}
                                    placeholder="Enter your password"
                                    className={`input ${errors.password ? 'input-error' : ''}`}
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-brand-red flex items-center gap-1">
                                        <FiAlertCircle className="w-3.5 h-3.5" />
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-2 py-3 text-base"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in…
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-brand-gray2 text-center">
                            <p className="text-sm text-brand-gray3">
                                Default credentials:
                                <span className="ml-1 font-semibold text-brand-black">admin / admin123</span>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 text-brand-gray3 text-sm">
                    © 2026 Student Management System
                </p>
            </div>
        </div>
    );
}
