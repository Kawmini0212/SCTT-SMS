import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

const HEADERS = ['Course Code', 'Course Name', 'Credits', 'Semester', 'Year', 'Actions'];

export default function CourseTable({ courses, loading, onView, onEdit, onDelete }) {

    if (loading) {
        return (
            <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-brand-black text-brand-white">
                        <tr>
                            {HEADERS.map((h) => (
                                <th key={h} className="px-6 py-4 text-left text-sm font-semibold">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-brand-gray2">
                                {HEADERS.map((h) => (
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

    if (!courses || courses.length === 0) {
        return (
            <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-brand-gray rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FiEye className="w-8 h-8 text-brand-gray3" />
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-1">No courses found</h3>
                <p className="text-brand-gray3 text-sm">Try adjusting your search or filter</p>
            </div>
        );
    }

    return (
        <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-brand-black text-brand-white">
                        <tr>
                            {HEADERS.map((h, i) => (
                                <th key={h}
                                    className={`px-6 py-4 text-sm font-semibold
                               ${i === HEADERS.length - 1 ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr
                                key={course.course_id}
                                onClick={() => onView && onView(course)}
                                className="border-b border-brand-gray2 hover:bg-brand-gray cursor-pointer
                           transition-colors duration-100 group"
                            >
                                {/* Code badge */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-3 py-1 bg-brand-black text-brand-yellow
                                   rounded-md text-xs font-bold tracking-widest">
                                        {course.course_code}
                                    </span>
                                </td>

                                <td className="px-6 py-4 font-semibold text-brand-black max-w-xs truncate">
                                    {course.course_name}
                                </td>

                                {/* Credits badge */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex w-8 h-8 items-center justify-center
                                   bg-brand-red text-brand-white rounded-lg text-sm font-bold">
                                        {course.credits}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-brand-gray3 text-sm">
                                    {course.semester || <span className="italic text-brand-gray2">—</span>}
                                </td>

                                {/* Year badge */}
                                <td className="px-6 py-4">
                                    {course.year ? (
                                        <span className="inline-flex px-3 py-1 bg-brand-red/10 text-brand-red
                                       border border-brand-red/20 rounded-md text-xs font-semibold">
                                            Year {course.year}
                                        </span>
                                    ) : (
                                        <span className="italic text-brand-gray2">—</span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onView && onView(course); }}
                                            className="p-2 text-brand-black hover:bg-brand-yellow/20 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(course); }}
                                            className="p-2 text-brand-black hover:bg-brand-yellow/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(course); }}
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
