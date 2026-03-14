import { useState } from 'react';
import {
    FiPlus, FiClipboard, FiX, FiEdit2, FiClock, FiBook
} from 'react-icons/fi';
import Layout from '../../components/layout/Layout';
import EnrollmentTable from '../../components/enrollments/EnrollmentTable';
import EnrollForm from '../../components/enrollments/EnrollForm';
import StudentHistoryModal from '../../components/enrollments/StudentHistoryModal';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
    useEnrollments,
    useEnroll,
    useUpdateEnrollmentStatus,
    useDeleteEnrollment,
} from '../../hooks/useEnrollments';
import { useStudents } from '../../hooks/useStudents';

const ENROLL_FORM_ID = 'enroll-form';
const DEFAULT_LIMIT = 10;

const STATUSES = ['enrolled', 'completed', 'dropped', 'failed'];
const STATUS_STYLES = {
    enrolled: 'bg-brand-yellow text-brand-black border border-brand-yellow',
    completed: 'bg-green-500 text-white border border-green-500',
    dropped: 'bg-gray-400 text-white border border-gray-400',
    failed: 'bg-brand-red text-brand-white border border-brand-red',
};

// ── Status update selector ───────────────────────────────────────────────────
function StatusUpdateBody({ enrollment, newStatus, setNewStatus }) {
    return (
        <div className="space-y-4">
            <p className="text-brand-gray3 text-sm">
                Update status for enrollment #{enrollment?.enrollment_id}
                {enrollment?.course_name ? ` — ${enrollment.course_name}` : ''}.
            </p>
            <div>
                <label className="block text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-2">
                    New Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {STATUSES.map((s) => (
                        <button
                            type="button"
                            key={s}
                            onClick={() => setNewStatus(s)}
                            className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm capitalize transition-all
                                ${newStatus === s
                                    ? 'border-brand-red bg-brand-red text-brand-white'
                                    : 'border-brand-gray2 text-brand-black hover:border-brand-black'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function EnrollmentList() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    // Modals
    const [enrollOpen, setEnrollOpen] = useState(false);
    const [statusEditEnrollment, setStatusEditEnrollment] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, enrollment: null });
    const [historyStudentId, setHistoryStudentId] = useState(null);

    const params = {
        page,
        limit: DEFAULT_LIMIT,
        ...(statusFilter && { status: statusFilter }),
        ...(semesterFilter && { semester: semesterFilter }),
        ...(yearFilter && { academicYear: yearFilter }),
    };

    const { data, isLoading } = useEnrollments(params);
    const enrollMutation = useEnroll();
    const statusMutation = useUpdateEnrollmentStatus();
    const deleteMutation = useDeleteEnrollment();

    const enrollments = data?.data?.enrollments || [];
    const totalPages = data?.data?.totalPages || 1;
    const total = data?.data?.total || 0;

    const spinner = <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

    const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
    const YEARS = [1, 2, 3, 4];

    const openStatusEdit = (e) => { setStatusEditEnrollment(e); setNewStatus(e.status); };

    const handleEnrollSubmit = async (formData) => {
        await enrollMutation.mutateAsync(formData);
        setEnrollOpen(false);
    };

    const handleStatusUpdate = async () => {
        if (!newStatus || !statusEditEnrollment) return;
        await statusMutation.mutateAsync({ id: statusEditEnrollment.enrollment_id, status: newStatus });
        setStatusEditEnrollment(null);
        setNewStatus('');
    };

    const handleDeleteConfirm = async () => {
        await deleteMutation.mutateAsync(deleteDialog.enrollment.enrollment_id);
        setDeleteDialog({ open: false, enrollment: null });
    };

    /* ── Modal footers ── */
    const enrollFooter = (
        <>
            <button onClick={() => setEnrollOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" form={ENROLL_FORM_ID} disabled={enrollMutation.isPending} className="btn-primary">
                {enrollMutation.isPending ? <span className="flex items-center gap-2">{spinner}Enrolling…</span> : 'Enroll Student'}
            </button>
        </>
    );

    const statusFooter = (
        <>
            <button onClick={() => { setStatusEditEnrollment(null); setNewStatus(''); }} className="btn-outline">Cancel</button>
            <button
                onClick={handleStatusUpdate}
                disabled={statusMutation.isPending || !newStatus}
                className="btn-primary"
            >
                {statusMutation.isPending ? <span className="flex items-center gap-2">{spinner}Saving…</span> : 'Update Status'}
            </button>
        </>
    );

    return (
        <Layout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-in">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-black">Enrollments</h1>
                        <p className="text-brand-gray3 mt-0.5">Manage student course enrollments</p>
                    </div>
                    <button onClick={() => setEnrollOpen(true)} className="btn-primary">
                        <FiPlus className="w-5 h-5" /> Enroll Student
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap animate-fade-in">
                    {/* Status */}
                    <div className="relative">
                        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="input pr-10 appearance-none min-w-[160px]">
                            <option value="">All Statuses</option>
                            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                        {statusFilter && (
                            <button onClick={() => { setStatusFilter(''); setPage(1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray3 hover:text-brand-red">
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Semester */}
                    <div className="relative">
                        <select value={semesterFilter} onChange={(e) => { setSemesterFilter(e.target.value); setPage(1); }}
                            className="input pr-10 appearance-none min-w-[160px]">
                            <option value="">All Semesters</option>
                            {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {semesterFilter && (
                            <button onClick={() => { setSemesterFilter(''); setPage(1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray3 hover:text-brand-red">
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Year */}
                    <div className="relative">
                        <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
                            className="input pr-10 appearance-none min-w-[140px]">
                            <option value="">All Years</option>
                            {YEARS.map((y) => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                        {yearFilter && (
                            <button onClick={() => { setYearFilter(''); setPage(1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray3 hover:text-brand-red">
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Active filter badges */}
                {(statusFilter || semesterFilter || yearFilter) && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {statusFilter && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/20 text-brand-black
                                text-sm font-medium rounded-full border border-brand-yellow">
                                <FiClock className="w-3.5 h-3.5" />{statusFilter}
                                <button onClick={() => { setStatusFilter(''); setPage(1); }} className="ml-1 hover:text-brand-red">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        )}
                        {semesterFilter && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/20 text-brand-black
                                text-sm font-medium rounded-full border border-brand-yellow">
                                {semesterFilter}
                                <button onClick={() => { setSemesterFilter(''); setPage(1); }} className="ml-1 hover:text-brand-red">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        )}
                        {yearFilter && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/20 text-brand-black
                                text-sm font-medium rounded-full border border-brand-yellow">
                                Year {yearFilter}
                                <button onClick={() => { setYearFilter(''); setPage(1); }} className="ml-1 hover:text-brand-red">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Count */}
                {!isLoading && (
                    <p className="text-xs text-brand-gray3">
                        {total} enrollment{total !== 1 ? 's' : ''} total
                    </p>
                )}

                {/* Table */}
                <EnrollmentTable
                    enrollments={enrollments}
                    loading={isLoading}
                    onStatusEdit={(e) => openStatusEdit(e)}
                    onDelete={(e) => setDeleteDialog({ open: true, enrollment: e })}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 animate-fade-in">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                            className="btn-outline btn-sm disabled:opacity-40">Previous</button>
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i + 1} onClick={() => setPage(i + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                                        ${page === i + 1
                                            ? 'bg-brand-red text-brand-white'
                                            : 'bg-brand-white text-brand-black border border-brand-gray2 hover:border-brand-black'
                                        }`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                            className="btn-outline btn-sm disabled:opacity-40">Next</button>
                    </div>
                )}

                {/* ── Enroll Modal ── */}
                <Modal open={enrollOpen} onClose={() => setEnrollOpen(false)}
                    title="Enroll Student" subtitle="Select a student, courses, and semester"
                    icon={FiClipboard} footer={enrollFooter} maxWidth="max-w-2xl">
                    <EnrollForm formId={ENROLL_FORM_ID} onSubmit={handleEnrollSubmit} loading={enrollMutation.isPending} />
                </Modal>

                {/* ── Update Status Modal ── */}
                <Modal open={!!statusEditEnrollment} onClose={() => { setStatusEditEnrollment(null); setNewStatus(''); }}
                    title="Update Status"
                    subtitle={statusEditEnrollment ? `Enrollment #${statusEditEnrollment.enrollment_id}` : ''}
                    icon={FiEdit2} footer={statusFooter} maxWidth="max-w-sm">
                    {statusEditEnrollment && (
                        <StatusUpdateBody enrollment={statusEditEnrollment} newStatus={newStatus} setNewStatus={setNewStatus} />
                    )}
                </Modal>

                {/* ── Student History Modal ── */}
                <Modal open={!!historyStudentId} onClose={() => setHistoryStudentId(null)}
                    title="Student Course History" subtitle="Full enrollment history by semester"
                    icon={FiBook} maxWidth="max-w-2xl"
                    footer={<button onClick={() => setHistoryStudentId(null)} className="btn-outline">Close</button>}>
                    {historyStudentId && <StudentHistoryModal studentId={historyStudentId} />}
                </Modal>

                {/* ── Delete Confirm ── */}
                <ConfirmDialog
                    open={deleteDialog.open}
                    title="Delete Enrollment"
                    message={`Are you sure you want to delete enrollment #${deleteDialog.enrollment?.enrollment_id}? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteDialog({ open: false, enrollment: null })}
                    confirmText="Delete"
                />
            </div>
        </Layout>
    );
}
