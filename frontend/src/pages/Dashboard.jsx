import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { courseApi } from '../api/courseApi';
import { enrollmentApi } from '../api/enrollmentApi';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import { FiUsers, FiUserPlus, FiBook, FiBookOpen, FiClipboard } from 'react-icons/fi';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: studentsData } = useQuery({
        queryKey: ['students', 1, 10, ''],
        queryFn: () => studentApi.getAll({ page: 1, limit: 10, search: '' }),
    });

    const { data: coursesData } = useQuery({
        queryKey: ['courses', { page: 1, limit: 1 }],
        queryFn: () => courseApi.getAll({ page: 1, limit: 1 }),
    });

    const { data: enrollmentsData } = useQuery({
        queryKey: ['enrollments', { page: 1, limit: 1 }],
        queryFn: () => enrollmentApi.getAll({ page: 1, limit: 1 }),
    });

    const totalStudents = studentsData?.data?.total || 0;
    const totalCourses = coursesData?.data?.total || 0;
    const totalEnrollments = enrollmentsData?.data?.total || 0;

    const stats = [
        { label: 'Total Students', value: totalStudents, icon: FiUsers, bg: 'bg-brand-black', iconBg: 'bg-brand-red', text: 'text-brand-white' },
        { label: 'Total Courses', value: totalCourses, icon: FiBook, bg: 'bg-brand-red', iconBg: 'bg-brand-black', text: 'text-brand-white' },
        { label: 'Enrollments', value: totalEnrollments, icon: FiClipboard, bg: 'bg-brand-yellow', iconBg: 'bg-brand-black', text: 'text-brand-black' },
    ];

    const quickActions = [
        {
            label: 'Add New Student',
            desc: 'Register a new student',
            icon: FiUserPlus,
            path: '/students',
            accent: 'group-hover:border-brand-red',
            iconBg: 'bg-brand-red',
            arrow: 'text-brand-red',
        },
        {
            label: 'Add New Course',
            desc: 'Create a course record',
            icon: FiBookOpen,
            path: '/courses',
            accent: 'group-hover:border-brand-yellow',
            iconBg: 'bg-brand-black',
            arrow: 'text-brand-black',
        },
        {
            label: 'Enrollments',
            desc: 'Manage student enrollments',
            icon: FiClipboard,
            path: '/enrollments',
            accent: 'group-hover:border-brand-black',
            iconBg: 'bg-brand-black',
            arrow: 'text-brand-black',
        },
    ];

    return (
        <Layout>
            <div className="space-y-8 animate-fade-in">

                {/* Welcome Header */}
                <div className="animate-slide-in">
                    <h1 className="text-3xl font-bold text-brand-black">
                        Welcome back,{' '}
                        <span className="text-brand-red">{user?.fullName || user?.username}</span>!
                    </h1>
                    <p className="text-brand-gray3 mt-1">Here's an overview of your student management system</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label}
                                className={`${s.bg} ${s.text} rounded-xl p-6 shadow-sm
                               hover:-translate-y-1 transition-transform duration-200`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${s.iconBg} rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-brand-white" />
                                    </div>
                                    <span className="text-4xl font-bold">{s.value}</span>
                                </div>
                                <p className="font-semibold text-sm opacity-80">{s.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-1 h-7 bg-brand-red rounded-full" />
                        <h2 className="text-xl font-bold text-brand-black">Quick Actions</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((a) => {
                            const Icon = a.icon;
                            return (
                                <button
                                    key={a.label}
                                    onClick={() => navigate(a.path)}
                                    className={`group flex flex-col items-start gap-3 p-5 rounded-xl border-2 border-brand-gray2
                              ${a.accent} hover:shadow-md transition-all duration-200 text-left`}
                                >
                                    <div className={`w-11 h-11 ${a.iconBg} rounded-lg flex items-center justify-center
                                  group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-5 h-5 text-brand-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-brand-black text-sm">{a.label}</p>
                                        <p className="text-xs text-brand-gray3 mt-0.5">{a.desc}</p>
                                    </div>
                                    <span className={`${a.arrow} text-sm font-bold group-hover:translate-x-1 transition-transform`}>→</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </Layout>
    );
}
