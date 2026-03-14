import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentForm from '../../components/students/StudentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useStudent, useUpdateStudent } from '../../hooks/useStudents';
import { FiEdit2 } from 'react-icons/fi';

const FORM_ID = 'edit-student-form';

export default function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useStudent(id);
    const updateMutation = useUpdateStudent();

    const student = data?.data;

    const handleSubmit = async (formData) => {
        await updateMutation.mutateAsync({ id, data: formData });
        navigate(`/students/${id}`);
    };

    if (isLoading) return <Layout><LoadingSpinner /></Layout>;

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-6 animate-slide-in">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-13 h-13 w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
                        <FiEdit2 className="w-6 h-6 text-brand-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-brand-black">Edit Student</h1>
                        <p className="text-brand-gray3 mt-0.5">Update the student's information below</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm overflow-hidden">
                    <div className="h-1.5 bg-brand-red w-full" />
                    <div className="p-8">
                        <StudentForm
                            student={student}
                            formId={FORM_ID}
                            onSubmit={handleSubmit}
                            loading={updateMutation.isPending}
                        />
                    </div>

                    <div className="flex justify-end gap-3 px-8 py-5 border-t border-brand-gray2 bg-brand-gray">
                        <button
                            onClick={() => navigate(`/students/${id}`)}
                            className="btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form={FORM_ID}
                            disabled={updateMutation.isPending}
                            className="btn-primary"
                        >
                            {updateMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
