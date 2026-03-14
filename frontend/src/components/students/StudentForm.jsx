import { useForm } from 'react-hook-form';
import { validationRules } from '../../utils/validators';
import { formatDateInput } from '../../utils/formatters';
import { useDegreePrograms } from '../../hooks/useDegreePrograms';
import LoadingSpinner from '../common/LoadingSpinner';

export default function StudentForm({ student, onSubmit, loading, formId = 'student-form' }) {
    const { data: programsData, isLoading: programsLoading } = useDegreePrograms();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: student
            ? {
                firstName: student.first_name,
                lastName: student.last_name,
                address: student.address,
                birthday: formatDateInput(student.birthday),
                idNumber: student.id_number,
                degreeProgramId: student.degree_program_id,
                currentYear: student.current_year || 1,
                currentSemester: student.current_semester || 'Semester 1',
            }
            : {
                currentYear: 1,
                currentSemester: 'Semester 1'
            },
    });

    const programs = programsData?.data || [];

    if (programsLoading) return <LoadingSpinner size="sm" />;

    const field = (err) =>
        `input ${err ? 'input-error' : ''}`;

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">First Name</label>
                    <input
                        {...register('firstName', validationRules.firstName)}
                        placeholder="Enter first name"
                        className={field(errors.firstName)}
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-xs text-brand-red">{errors.firstName.message}</p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">Last Name</label>
                    <input
                        {...register('lastName', validationRules.lastName)}
                        placeholder="Enter last name"
                        className={field(errors.lastName)}
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-xs text-brand-red">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">Address</label>
                <textarea
                    rows={3}
                    {...register('address', validationRules.address)}
                    placeholder="Enter full address"
                    className={`${field(errors.address)} resize-none`}
                />
                {errors.address && (
                    <p className="mt-1 text-xs text-brand-red">{errors.address.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Birthday */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">Birthday</label>
                    <input
                        type="date"
                        {...register('birthday', validationRules.birthday)}
                        className={field(errors.birthday)}
                    />
                    {errors.birthday && (
                        <p className="mt-1 text-xs text-brand-red">{errors.birthday.message}</p>
                    )}
                </div>

                {/* ID Number */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">ID Number</label>
                    <input
                        {...register('idNumber', validationRules.idNumber)}
                        placeholder="e.g., 200312345678"
                        className={field(errors.idNumber)}
                    />
                    {errors.idNumber && (
                        <p className="mt-1 text-xs text-brand-red">{errors.idNumber.message}</p>
                    )}
                </div>
            </div>

            {/* Degree Program */}
            <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">Degree Program</label>
                <select
                    {...register('degreeProgramId', validationRules.degreeProgramId)}
                    className={field(errors.degreeProgramId)}
                >
                    <option value="">Select a degree program</option>
                    {programs.map((p) => (
                        <option key={p.degree_program_id} value={p.degree_program_id}>
                            {p.program_name} ({p.program_code})
                        </option>
                    ))}
                </select>
                {errors.degreeProgramId && (
                    <p className="mt-1 text-xs text-brand-red">{errors.degreeProgramId.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Current Year */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">Current Year</label>
                    <select
                        {...register('currentYear')}
                        className={field(errors.currentYear)}
                    >
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                    </select>
                    {errors.currentYear && (
                        <p className="mt-1 text-xs text-brand-red">{errors.currentYear.message}</p>
                    )}
                </div>

                {/* Current Semester */}
                <div>
                    <label className="block text-sm font-semibold text-brand-black mb-1.5">Current Semester</label>
                    <select
                        {...register('currentSemester')}
                        className={field(errors.currentSemester)}
                    >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 6">Semester 6</option>
                        <option value="Semester 7">Semester 7</option>
                        <option value="Semester 8">Semester 8</option>
                    </select>
                    {errors.currentSemester && (
                        <p className="mt-1 text-xs text-brand-red">{errors.currentSemester.message}</p>
                    )}
                </div>
            </div>
        </form>
    );
}
