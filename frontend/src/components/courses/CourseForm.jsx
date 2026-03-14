import { useForm } from 'react-hook-form';
import { useSemesters } from '../../hooks/useCourses';

const rules = {
    courseCode: {
        required: 'Course code is required',
        pattern: { value: /^[A-Z0-9]+$/, message: 'Uppercase letters and numbers only' },
        minLength: { value: 2, message: 'Min 2 characters' },
        maxLength: { value: 50, message: 'Max 50 characters' },
    },
    courseName: {
        required: 'Course name is required',
        minLength: { value: 3, message: 'Min 3 characters' },
        maxLength: { value: 255, message: 'Max 255 characters' },
    },
    credits: {
        required: 'Credits are required',
        min: { value: 1, message: 'Min 1 credit' },
        max: { value: 10, message: 'Max 10 credits' },
    },
    semester: {
        maxLength: { value: 50, message: 'Max 50 characters' },
    },
};

/**
 * CourseForm
 * @param {object}   course   – existing course for edit mode (null for create)
 * @param {string}   formId   – id tied to external submit button via form={formId}
 * @param {function} onSubmit – called with validated form data
 * @param {boolean}  loading  – disables inputs while submitting
 */
export default function CourseForm({ course, formId = 'course-form', onSubmit, loading }) {
    const { data: semData } = useSemesters();
    const semesters = semData?.data || [];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: course
            ? {
                courseCode: course.course_code,
                courseName: course.course_name,
                credits: course.credits,
                semester: course.semester ?? '',
                year: course.year ?? '',
            }
            : {},
    });

    const field = (err) => `input ${err ? 'input-error' : ''}`;

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Course Code */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">
                        Course Code
                        {course && (
                            <span className="ml-2 text-xs font-normal text-brand-gray3">(cannot be changed)</span>
                        )}
                    </label>
                    <input
                        {...register('courseCode', rules.courseCode)}
                        placeholder="e.g. CS101"
                        disabled={!!course}
                        className={`${field(errors.courseCode)} ${course ? 'bg-brand-gray cursor-not-allowed' : ''}`}
                    />
                    {errors.courseCode && (
                        <p className="mt-1 text-xs text-brand-red">{errors.courseCode.message}</p>
                    )}
                </div>

                {/* Credits */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">Credits</label>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        {...register('credits', { ...rules.credits, valueAsNumber: true })}
                        placeholder="1 – 10"
                        className={field(errors.credits)}
                    />
                    {errors.credits && (
                        <p className="mt-1 text-xs text-brand-red">{errors.credits.message}</p>
                    )}
                </div>
            </div>

            {/* Course Name */}
            <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">Course Name</label>
                <input
                    {...register('courseName', rules.courseName)}
                    placeholder="e.g. Introduction to Programming"
                    className={field(errors.courseName)}
                />
                {errors.courseName && (
                    <p className="mt-1 text-xs text-brand-red">{errors.courseName.message}</p>
                )}
            </div>

            {/* Semester */}
            <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">
                    Semester
                    <span className="ml-1 text-xs font-normal text-brand-gray3">(optional)</span>
                </label>
                {semesters.length > 0 ? (
                    <select {...register('semester', rules.semester)} className={field(errors.semester)}>
                        <option value="">— None —</option>
                        {semesters.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        {...register('semester', rules.semester)}
                        placeholder="e.g. Semester 1"
                        className={field(errors.semester)}
                    />
                )}
                {errors.semester && (
                    <p className="mt-1 text-xs text-brand-red">{errors.semester.message}</p>
                )}
            </div>

            {/* Year */}
            <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">
                    Year
                    <span className="ml-1 text-xs font-normal text-brand-gray3">(optional)</span>
                </label>
                <select {...register('year')} className={field(errors.year)}>
                    <option value="">— None —</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                </select>
                {errors.year && (
                    <p className="mt-1 text-xs text-brand-red">{errors.year.message}</p>
                )}
            </div>
        </form>
    );
}
