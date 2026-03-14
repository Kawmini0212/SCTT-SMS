import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiUser, FiCalendar, FiMapPin, FiCreditCard, FiBook, FiArrowLeft } from 'react-icons/fi';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import StudentForm from '../../components/students/StudentForm';
import { useStudent, useDeleteStudent, useUpdateStudent } from '../../hooks/useStudents';
import { formatDate } from '../../utils/formatters';

const EDIT_FORM_ID = 'details-edit-student-form';

const InfoCard = ({ icon: Icon, iconColor, label, children }) => (
    <div className="bg-brand-white rounded-xl border border-brand-gray2 shadow-sm p-5">
        <div className="flex items-start gap-4">
            <div className={`w-11 h-11 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-brand-white" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1">{label}</p>
                <div className="text-brand-black font-semibold">{children}</div>
            </div>
        </div>
    </div>
);

export default function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useStudent(id);
    const deleteMutation = useDeleteStudent();
    const updateMutation = useUpdateStudent();

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const student = data?.data;

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(id);
        navigate('/students');
    };

    const handleEditSubmit = async (formData) => {
        await updateMutation.mutateAsync({ id, data: formData });
        setEditOpen(false);
        refetch();
    };

    const editFooter = (
        <>
            <button onClick={() => setEditOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" form={EDIT_FORM_ID} disabled={updateMutation.isPending} className="btn-primary">
                {updateMutation.isPending
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</span>
                    : 'Save Changes'}
            </button>
        </>
    );

    if (isLoading) return <Layout><LoadingSpinner /></Layout>;

    if (!student) return (
        <Layout>
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-brand-black">Student not found</h2>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">

                {/* Back + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <button
                            onClick={() => navigate('/students')}
                            className="flex items-center gap-2 text-brand-gray3 hover:text-brand-black text-sm font-medium mb-2 transition-colors"
                        >
                            <FiArrowLeft className="w-4 h-4" /> Back to Students
                        </button>
                        <h1 className="text-3xl font-bold text-brand-black">Student Details</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditOpen(true)}
                            className="btn-outline flex items-center gap-2"
                        >
                            <FiEdit2 className="w-4 h-4" /> Edit
                        </button>
                        <button
                            onClick={() => setDeleteDialog(true)}
                            className="btn-danger flex items-center gap-2"
                        >
                            <FiTrash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>

                {/* Student number banner */}
                <div className="bg-brand-black text-brand-white rounded-xl p-6 flex items-center gap-5">
                    <div className="w-16 h-16 bg-brand-red rounded-xl flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-brand-white" />
                    </div>
                    <div>
                        <p className="text-brand-gray3 text-sm font-medium mb-0.5">Student Number</p>
                        <p className="text-3xl font-bold">{student.student_number}</p>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard icon={FiUser} iconColor="bg-brand-red" label="Full Name">
                        {student.first_name} {student.last_name}
                    </InfoCard>
                    <InfoCard icon={FiCalendar} iconColor="bg-brand-black" label="Birthday">
                        {formatDate(student.birthday)}
                    </InfoCard>
                    <InfoCard icon={FiCreditCard} iconColor="bg-brand-yellow" label="ID Number">
                        <span className="text-brand-black">{student.id_number}</span>
                    </InfoCard>
                    <InfoCard icon={FiBook} iconColor="bg-brand-red" label="Degree Program">
                        <span>{student.program_name}</span>
                        {student.program_code && (
                            <span className="ml-2 text-xs font-bold text-brand-gray3 border border-brand-gray2 px-2 py-0.5 rounded">
                                {student.program_code}
                            </span>
                        )}
                    </InfoCard>
                </div>

                {/* Address */}
                <InfoCard icon={FiMapPin} iconColor="bg-brand-black" label="Address">
                    <span className="font-normal text-brand-gray3">{student.address}</span>
                </InfoCard>

                {/* Metadata */}
                <p className="text-xs text-brand-gray3 text-right">
                    Created on {formatDate(student.created_at)}
                </p>

                {/* ── Edit Modal ── */}
                <Modal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    title="Edit Student"
                    subtitle={`${student.first_name} ${student.last_name}`}
                    icon={FiEdit2}
                    footer={editFooter}
                    maxWidth="max-w-2xl"
                >
                    <StudentForm
                        key={student.student_id}
                        student={student}
                        formId={EDIT_FORM_ID}
                        onSubmit={handleEditSubmit}
                        loading={updateMutation.isPending}
                    />
                </Modal>

                {/* ── Delete Confirm ── */}
                <ConfirmDialog
                    open={deleteDialog}
                    title="Delete Student"
                    message={`Are you sure you want to delete ${student.first_name} ${student.last_name}? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteDialog(false)}
                    confirmText="Delete"
                />
            </div>
        </Layout>
    );
}
