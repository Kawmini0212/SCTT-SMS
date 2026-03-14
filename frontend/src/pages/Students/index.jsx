import { useState } from 'react';
import { FiPlus, FiUserPlus, FiEdit2, FiUser, FiCalendar, FiMapPin, FiCreditCard, FiBook, FiExternalLink, FiClipboard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentTable from '../../components/students/StudentTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import StudentForm from '../../components/students/StudentForm';
import StudentHistoryModal from '../../components/enrollments/StudentHistoryModal';
import { useStudents, useDeleteStudent, useCreateStudent, useUpdateStudent } from '../../hooks/useStudents';
import { formatDate } from '../../utils/formatters';
import { PAGINATION } from '../../utils/constants';

const ADD_FORM_ID = 'add-student-form';
const EDIT_FORM_ID = 'edit-student-form';

// ── Student detail view (inside view modal) ────────────────────────────────
function StudentDetailBody({ student }) {
    const items = [
        { label: 'Student Number', value: student.student_number, badge: true },
        { label: 'Birthday', value: formatDate(student.birthday) },
        { label: 'ID Number', value: student.id_number },
        { label: 'Degree Program', value: student.program_name ?? '—' },
        { label: 'Current Year', value: `Year ${student.current_year || 1}` },
        { label: 'Current Semester', value: student.current_semester || 'Semester 1' },
    ];
    return (
        <div className="space-y-5">
            {/* Name banner */}
            <div className="bg-brand-black text-brand-white rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiUser className="w-6 h-6 text-brand-white" />
                </div>
                <div>
                    <p className="text-brand-gray3 text-xs font-medium mb-0.5">Full Name</p>
                    <p className="text-xl font-bold">{student.first_name} {student.last_name}</p>
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
                {items.map(({ label, value, badge }) => (
                    <div key={label} className="bg-brand-gray rounded-xl p-4">
                        <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1">{label}</p>
                        {badge ? (
                            <span className="inline-flex px-3 py-1 bg-brand-red text-brand-white rounded-md text-sm font-bold tracking-widest">
                                {value}
                            </span>
                        ) : (
                            <p className="text-brand-black font-semibold text-sm">{value}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Address */}
            <div className="bg-brand-gray rounded-xl p-4">
                <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1">Address</p>
                <p className="text-brand-black font-semibold text-sm">{student.address}</p>
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function StudentList() {
    const navigate = useNavigate();

    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [search, setSearch] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, student: null });
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [viewStudent, setViewStudent] = useState(null);
    const [editStudent, setEditStudent] = useState(null);
    const [historyStudentId, setHistoryStudentId] = useState(null);

    const { data, isLoading } = useStudents({ page, limit: PAGINATION.DEFAULT_LIMIT, search });
    const deleteMutation = useDeleteStudent();
    const createMutation = useCreateStudent();
    const updateMutation = useUpdateStudent();

    const students = data?.data?.students || [];
    const totalPages = data?.data?.totalPages || 1;

    const handleSearch = (v) => { setSearch(v); setPage(1); };
    const handlePageChange = (n) => setPage(n);

    const handleDeleteClick = (s) => setDeleteDialog({ open: true, student: s });
    const handleDeleteConfirm = async () => {
        if (deleteDialog.student) {
            await deleteMutation.mutateAsync(deleteDialog.student.student_id);
            setDeleteDialog({ open: false, student: null });
        }
    };

    const handleCreateSubmit = async (formData) => {
        await createMutation.mutateAsync(formData);
        setAddModalOpen(false);
    };

    const handleEditSubmit = async (formData) => {
        await updateMutation.mutateAsync({ id: editStudent.student_id, data: formData });
        setEditStudent(null);
    };

    const spinner = <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

    /* ── Modal footers ── */
    const viewFooter = (
        <>
            <button onClick={() => setViewStudent(null)} className="btn-outline">Close</button>
            <button
                onClick={() => { setEditStudent(viewStudent); setViewStudent(null); }}
                className="btn-primary flex items-center gap-2"
            >
                <FiEdit2 className="w-4 h-4" /> Edit Student
            </button>
        </>
    );

    const addFooter = (
        <>
            <button onClick={() => setAddModalOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" form={ADD_FORM_ID} disabled={createMutation.isPending} className="btn-primary">
                {createMutation.isPending ? <span className="flex items-center gap-2">{spinner}Creating…</span> : 'Create Student'}
            </button>
        </>
    );

    const editFooter = (
        <>
            <button onClick={() => setEditStudent(null)} className="btn-outline">Cancel</button>
            <button type="submit" form={EDIT_FORM_ID} disabled={updateMutation.isPending} className="btn-primary">
                {updateMutation.isPending ? <span className="flex items-center gap-2">{spinner}Saving…</span> : 'Save Changes'}
            </button>
        </>
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-in">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-black">Students</h1>
                        <p className="text-brand-gray3 mt-0.5">Manage all student records</p>
                    </div>
                    <button onClick={() => setAddModalOpen(true)} className="btn-primary">
                        <FiPlus className="w-5 h-5" />
                        Add New Student
                    </button>
                </div>

                {/* Search */}
                <div className="animate-fade-in">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search by name, student number, or ID number..."
                        className="max-w-md"
                    />
                </div>

                {/* Table */}
                <StudentTable
                    students={students}
                    loading={isLoading}
                    onView={(s) => setViewStudent(s)}
                    onEdit={(s) => setEditStudent(s)}
                    onDelete={handleDeleteClick}
                    onViewHistory={(s) => setHistoryStudentId(s.student_id)}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 animate-fade-in">
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="btn-outline btn-sm disabled:opacity-40">Previous</button>
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                    ${page === i + 1
                                            ? 'bg-brand-red text-brand-white'
                                            : 'bg-brand-white text-brand-black border border-brand-gray2 hover:border-brand-black'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="btn-outline btn-sm disabled:opacity-40">Next</button>
                    </div>
                )}

                {/* ── View Student Modal ── */}
                <Modal
                    open={!!viewStudent}
                    onClose={() => setViewStudent(null)}
                    title="Student Details"
                    subtitle={viewStudent ? `${viewStudent.first_name} ${viewStudent.last_name}` : ''}
                    icon={FiUser}
                    footer={viewFooter}
                    maxWidth="max-w-lg"
                >
                    {viewStudent && <StudentDetailBody student={viewStudent} />}
                </Modal>

                {/* ── Add Student Modal ── */}
                <Modal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    title="Add New Student"
                    subtitle="Fill in the details to register a new student"
                    icon={FiUserPlus}
                    footer={addFooter}
                    maxWidth="max-w-2xl"
                >
                    <StudentForm formId={ADD_FORM_ID} onSubmit={handleCreateSubmit} loading={createMutation.isPending} />
                </Modal>

                {/* ── Edit Student Modal ── */}
                <Modal
                    open={!!editStudent}
                    onClose={() => setEditStudent(null)}
                    title="Edit Student"
                    subtitle={editStudent ? `${editStudent.first_name} ${editStudent.last_name}` : ''}
                    icon={FiEdit2}
                    footer={editFooter}
                    maxWidth="max-w-2xl"
                >
                    {editStudent && (
                        <StudentForm
                            key={editStudent.student_id}
                            student={editStudent}
                            formId={EDIT_FORM_ID}
                            onSubmit={handleEditSubmit}
                            loading={updateMutation.isPending}
                        />
                    )}
                </Modal>

                {/* ── Academic History Modal ── */}
                <Modal
                    open={!!historyStudentId}
                    onClose={() => setHistoryStudentId(null)}
                    title="Academic History"
                    subtitle="Complete enrollment history throughout student's academic journey"
                    icon={FiClipboard}
                    footer={<button onClick={() => setHistoryStudentId(null)} className="btn-outline">Close</button>}
                    maxWidth="max-w-3xl"
                >
                    {historyStudentId && <StudentHistoryModal studentId={historyStudentId} />}
                </Modal>

                {/* ── Delete Confirm ── */}
                <ConfirmDialog
                    open={deleteDialog.open}
                    title="Delete Student"
                    message={`Are you sure you want to delete ${deleteDialog.student?.first_name} ${deleteDialog.student?.last_name}? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteDialog({ open: false, student: null })}
                    confirmText="Delete"
                />
            </div>
        </Layout>
    );
}
