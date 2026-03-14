import { useState, useEffect } from 'react';
import { useCourses, useSemesters } from '../../hooks/useCourses';

const currentYear = new Date().getFullYear();
const ACADEMIC_YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function ChangeSemesterForm({ formId, onSubmit, loading, studentId, initialSemester = '', initialYear = currentYear }) {
    const [semester, setSemester] = useState(initialSemester);
    const [academicYear, setAcademicYear] = useState(initialYear);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [courseSearch, setCourseSearch] = useState('');
    const [errors, setErrors] = useState({});

    const { data: coursesData } = useCourses({ page: 1, limit: 50, search: courseSearch });
    const { data: semData } = useSemesters();

    const courses = coursesData?.data?.courses || [];
    const semesters = semData?.data || [];

    const validate = () => {
        const errs = {};
        if (!semester) errs.semester = 'Please select a semester';
        setErrors(errs);
        return !Object.keys(errs).length;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            semester,
            academicYear: Number(academicYear),
            courseIds: selectedCourses.map((c) => c.course_id),
        });
    };

    const toggleCourse = (course) => {
        setSelectedCourses((prev) =>
            prev.find((c) => c.course_id === course.course_id)
                ? prev.filter((c) => c.course_id !== course.course_id)
                : [...prev, course]
        );
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-5">
            <div className="p-4 bg-brand-yellow/10 rounded-xl border border-brand-yellow text-sm text-brand-black">
                <strong>Note:</strong> Courses not in the new selection will be marked as <em>dropped</em>. New courses will be added.
            </div>

            {/* Semester & Year row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1.5">
                        Semester *
                    </label>
                    <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input">
                        <option value="">Select semester</option>
                        {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
                        {!semesters.length && ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((s) =>
                            <option key={s} value={s}>{s}</option>
                        )}
                    </select>
                    {errors.semester && <p className="text-brand-red text-xs mt-1">{errors.semester}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1.5">
                        Academic Year *
                    </label>
                    <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="input">
                        {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Course Selection */}
            <div>
                <label className="block text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1.5">
                    New Course List{' '}
                    <span className="text-brand-red text-[10px] normal-case font-normal">
                        ({selectedCourses.length} selected — leave empty to drop all)
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="input mb-2"
                />

                <div className="border-2 border-brand-gray2 rounded-lg max-h-52 overflow-y-auto bg-brand-white">
                    {courses.length === 0 ? (
                        <p className="p-3 text-brand-gray3 text-sm">No courses found</p>
                    ) : (
                        courses.map((c) => {
                            const checked = !!selectedCourses.find((sc) => sc.course_id === c.course_id);
                            return (
                                <label
                                    key={c.course_id}
                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer border-b border-brand-gray2 last:border-0
                                        ${checked ? 'bg-brand-yellow/10' : 'hover:bg-brand-gray'} transition-colors`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleCourse(c)}
                                        className="w-4 h-4 accent-brand-red"
                                    />
                                    <span className="font-semibold text-sm text-brand-black">{c.course_name}</span>
                                    <span className="ml-auto text-xs text-brand-gray3 font-mono">{c.course_code}</span>
                                    <span className="text-xs bg-brand-red text-brand-white px-1.5 py-0.5 rounded font-bold">
                                        {c.credits}cr
                                    </span>
                                </label>
                            );
                        })
                    )}
                </div>
            </div>
        </form>
    );
}
