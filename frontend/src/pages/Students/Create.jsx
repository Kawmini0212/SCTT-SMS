import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentForm from '../../components/students/StudentForm';
import Card from '../../components/common/Card';
import { useCreateStudent } from '../../hooks/useStudents';

export default function CreateStudent() {
    const navigate = useNavigate();
    const createMutation = useCreateStudent();

    const handleSubmit = async (data) => {
        await createMutation.mutateAsync(data);
        navigate('/students');
    };

    const handleCancel = () => {
        navigate('/students');
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-6 animate-slide-in">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Add New Student</h1>
                    <p className="text-slate-600">Fill in the details to register a new student</p>
                </div>

                {/* Form Card */}
                <Card>
                    <StudentForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={createMutation.isPending}
                    />
                </Card>
            </div>
        </Layout>
    );
}
