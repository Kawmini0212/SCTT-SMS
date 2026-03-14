import { useStudentHistory } from '../../hooks/useEnrollments';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiBook } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

const STATUS_STYLES = {
    enrolled: 'bg-brand-yellow/20 text-brand-black border border-brand-yellow',
    completed: 'bg-green-100 text-green-800 border border-green-300',
    dropped: 'bg-brand-gray2 text-brand-gray3 border border-brand-gray2',
    failed: 'bg-red-100 text-red-800 border border-red-300',
};

function StatusBadge({ status }) {
    return (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold capitalize
            ${STATUS_STYLES[status] || 'bg-brand-gray text-brand-gray3'}`}>
            {status}
        </span>
    );
}

export default function StudentHistoryModal({ studentId }) {
    const { data, isLoading } = useStudentHistory(studentId);

    if (isLoading) return <div className="py-8 flex justify-center"><LoadingSpinner /></div>;

    const history = data?.data?.history || [];
    const student = data?.data?.student;

    if (!history.length) {
        return (
            <div className="py-8 text-center">
                <FiBook className="w-10 h-10 mx-auto text-brand-gray2 mb-2" />
                <p className="text-brand-gray3 font-semibold">No enrollment history found</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Student banner */}
            {student && (
                <div className="bg-brand-black text-brand-white rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiBook className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-brand-gray3 font-medium">Student</p>
                        <p className="font-bold">{student.name}</p>
                        <p className="text-xs text-brand-gray3">{student.studentNumber}</p>
                    </div>
                </div>
            )}

            {/* History grouped by semester */}
            {history.map((group) => (
                <div key={`${group.semester}-${group.academicYear}`} className="card overflow-hidden">
                    {/* Semester header */}
                    <div className="bg-brand-black px-5 py-3 flex items-center gap-3">
                        <span className="text-brand-white font-bold text-sm">
                            {group.semester}
                        </span>
                        <span className="px-2 py-0.5 bg-brand-yellow text-brand-black rounded text-xs font-bold">
                            Year {group.academicYear}
                        </span>
                        <span className="ml-auto text-brand-gray3 text-xs">
                            {group.courses.length} course{group.courses.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Courses list */}
                    <div className="divide-y divide-brand-gray2">
                        {group.courses.map((course) => (
                            <div key={course.enrollmentId} className="px-5 py-3 flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-brand-black text-sm truncate">
                                        {course.courseName}
                                    </p>
                                    <p className="text-xs text-brand-gray3">
                                        {course.courseCode}
                                        {course.credits != null && (
                                            <span className="ml-2 bg-brand-gray px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                {course.credits} cr
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <StatusBadge status={course.status} />
                                <div className="text-right text-xs text-brand-gray3 hidden sm:block">
                                    <p>{formatDate(course.enrolledAt)}</p>
                                    {course.completedAt && <p className="text-green-700">{formatDate(course.completedAt)}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
