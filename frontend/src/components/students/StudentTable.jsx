import { FiEye, FiEdit2, FiTrash2, FiClipboard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export default function StudentTable({ students, loading, onDelete, onEdit, onView, onViewHistory }) {
    const navigate = useNavigate();

    const headers = ['Student No.', 'Name', 'ID Number', 'Degree Program', 'Year', 'Semester', 'Actions'];

    if (loading) {
        return (
            <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-brand-black text-brand-white">
                        <tr>
                            {headers.map((h) => (
                                <th key={h} className="px-6 py-4 text-left text-sm font-semibold">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-brand-gray2">
                                {headers.map((h) => (
                                    <td key={h} className="px-6 py-4">
                                        <div className="h-5 bg-brand-gray2 rounded animate-pulse" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!students || students.length === 0) {
        return (
            <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-brand-gray rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FiEye className="w-8 h-8 text-brand-gray3" />
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-1">No students found</h3>
                <p className="text-brand-gray3 text-sm">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-brand-black text-brand-white">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={h}
                                    className={`px-6 py-4 text-sm font-semibold
                                               ${i === headers.length - 1 ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.student_id}
                                onClick={() => onView ? onView(student) : navigate(`/students/${student.student_id}`)}
                                className="border-b border-brand-gray2 hover:bg-brand-gray cursor-pointer
                                           transition-colors duration-100 group"
                            >
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-3 py-1 bg-brand-red text-brand-white
                                                     rounded-md text-xs font-bold tracking-wide">
                                        {student.student_number}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-brand-black">
                                    {student.first_name} {student.last_name}
                                </td>
                                <td className="px-6 py-4 text-brand-gray3 text-sm">{student.id_number}</td>
                                <td className="px-6 py-4 text-brand-gray3 text-sm">{student.program_name || '—'}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 bg-brand-yellow text-brand-black
                                                     rounded-md text-xs font-bold">
                                        Year {student.current_year || 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-brand-gray3 text-sm">{student.current_semester || 'Semester 1'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onView ? onView(student) : navigate(`/students/${student.student_id}`); }}
                                            className="p-2 text-brand-black hover:bg-brand-yellow/20 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewHistory?.(student); }}
                                            className="p-2 text-brand-black hover:bg-brand-yellow/20 rounded-lg transition-colors"
                                            title="View Academic History"
                                        >
                                            <FiClipboard className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit ? onEdit(student) : navigate(`/students/edit/${student.student_id}`); }}
                                            className="p-2 text-brand-black hover:bg-brand-yellow/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(student); }}
                                            className="p-2 text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
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
