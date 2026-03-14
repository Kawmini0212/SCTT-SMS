import { FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';

const STATUS_STYLES = {
    enrolled: 'bg-brand-yellow text-brand-black border border-brand-yellow',
    completed: 'bg-green-500 text-white border border-green-500',
    dropped: 'bg-gray-400 text-white border border-gray-400',
    failed: 'bg-brand-red text-brand-white border border-brand-red',
};

function StatusBadge({ status }) {
    return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
            ${STATUS_STYLES[status] || 'bg-brand-gray text-brand-gray3'}`}>
            {status}
        </span>
    );
}

export default function EnrollmentTable({ enrollments = [], loading, onStatusEdit, onDelete }) {
    if (loading) {
        return (
            <div className="card p-12 flex justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!enrollments.length) {
        return (
            <div className="card p-12 text-center">
                <FiClock className="w-12 h-12 mx-auto text-brand-gray2 mb-3" />
                <p className="text-brand-gray3 font-semibold">No enrollments found</p>
                <p className="text-brand-gray3 text-sm mt-1">Try adjusting your filters or enroll a student.</p>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-brand-black text-brand-white text-left">
                            <th className="px-5 py-3.5 font-semibold">ID</th>
                            <th className="px-5 py-3.5 font-semibold">Student</th>
                            <th className="px-5 py-3.5 font-semibold">Course</th>
                            <th className="px-5 py-3.5 font-semibold">Semester</th>
                            <th className="px-5 py-3.5 font-semibold">Year</th>
                            <th className="px-5 py-3.5 font-semibold">Status</th>
                            <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gray2">
                        {enrollments.map((e) => (
                            <tr key={e.enrollment_id} className="hover:bg-brand-gray/60 transition-colors">
                                <td className="px-5 py-3.5 font-mono text-xs text-brand-gray3">
                                    #{e.enrollment_id}
                                </td>
                                <td className="px-5 py-3.5">
                                    <p className="font-semibold text-brand-black">
                                        {e.student_name || e.studentId || '—'}
                                    </p>
                                    {e.student_number && (
                                        <p className="text-xs text-brand-gray3">{e.student_number}</p>
                                    )}
                                </td>
                                <td className="px-5 py-3.5">
                                    <p className="font-semibold text-brand-black">
                                        {e.course_name || e.courseId || '—'}
                                    </p>
                                    {e.course_code && (
                                        <p className="text-xs text-brand-gray3">{e.course_code}</p>
                                    )}
                                </td>
                                <td className="px-5 py-3.5 text-brand-black">{e.semester}</td>
                                <td className="px-5 py-3.5 text-brand-black">Year {e.academic_year}</td>
                                <td className="px-5 py-3.5">
                                    <StatusBadge status={e.status} />
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            onClick={() => onStatusEdit?.(e)}
                                            className="p-2 rounded-lg bg-brand-gray hover:bg-brand-yellow/20 transition-colors text-brand-gray3 hover:text-brand-black"
                                            title="Update Status"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(e)}
                                            className="p-2 rounded-lg bg-brand-gray hover:bg-red-100 transition-colors text-brand-gray3 hover:text-brand-red"
                                            title="Delete"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
