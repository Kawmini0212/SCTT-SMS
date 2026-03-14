import { useState } from 'react';
import { FiPlus, FiBookOpen, FiEdit2, FiBook, FiCalendar, FiAward, FiX } from 'react-icons/fi';
import Layout from '../../components/layout/Layout';
import CourseTable from '../../components/courses/CourseTable';
import CourseForm from '../../components/courses/CourseForm';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import { useCourses, useSemesters, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../../hooks/useCourses';
import { formatDate } from '../../utils/formatters';

const ADD_FORM_ID = 'add-course-form';
const EDIT_FORM_ID = 'edit-course-form';
const DEFAULT_LIMIT = 10;

// ── Detail view inside a Modal ──────────────────────────────────────────────
function CourseDetailBody({ course }) {
    const items = [
        { label: 'Course Code', value: course.course_code, highlight: true },
        { label: 'Credits', value: course.credits, badge: true },
        { label: 'Semester', value: course.semester || '—' },
        { label: 'Year', value: course.year ? `Year ${course.year}` : '—' },
        { label: 'Created', value: formatDate(course.created_at) },
    ];
    return (
        <div className="space-y-5">
            <div>
                <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1">Course Name</p>
                <p className="text-xl font-bold text-brand-black">{course.course_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {items.map(({ label, value, highlight, badge }) => (
                    <div key={label} className="bg-brand-gray rounded-xl p-4">
                        <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1">{label}</p>
                        {highlight ? (
                            <span className="inline-flex px-3 py-1 bg-brand-black text-brand-yellow rounded-md text-sm font-bold tracking-widest">
                                {value}
                            </span>
                        ) : badge ? (
                            <span className="inline-flex w-9 h-9 items-center justify-center bg-brand-red text-brand-white rounded-lg text-lg font-bold">
                                {value}
                            </span>
                        ) : (
                            <p className="text-brand-black font-semibold">{value}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CourseList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [semester, setSemester] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editCourse, setEditCourse] = useState(null);
    const [viewCourse, setViewCourse] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, course: null });

    const { data, isLoading } = useCourses({ page, limit: DEFAULT_LIMIT, search, semester });
    const { data: semData } = useSemesters();
    const createMutation = useCreateCourse();
    const updateMutation = useUpdateCourse();
    const deleteMutation = useDeleteCourse();

    const courses = data?.data?.courses || [];
    const totalPages = data?.data?.totalPages || 1;
    const semesters = semData?.data || [];

    const handleSearch = (v) => { setSearch(v); setPage(1); };
    const handleSemester = (v) => { setSemester(v); setPage(1); };

    const handleCreateSubmit = async (formData) => {
        await createMutation.mutateAsync(formData);
        setAddOpen(false);
    };

    const handleEditSubmit = async (formData) => {
        await updateMutation.mutateAsync({ id: editCourse.course_id, data: formData });
        setEditCourse(null);
    };

    const handleDeleteConfirm = async () => {
        await deleteMutation.mutateAsync(deleteDialog.course.course_id);
        setDeleteDialog({ open: false, course: null });
    };

    /* ── Modal footers ── */
    const spinner = <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

    const addFooter = (
        <>
            <button onClick={() => setAddOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" form={ADD_FORM_ID} disabled={createMutation.isPending} className="btn-primary">
                {createMutation.isPending ? <span className="flex items-center gap-2">{spinner}Creating…</span> : 'Create Course'}
            </button>
        </>
    );

    const editFooter = (
        <>
            <button onClick={() => setEditCourse(null)} className="btn-outline">Cancel</button>
            <button type="submit" form={EDIT_FORM_ID} disabled={updateMutation.isPending} className="btn-primary">
                {updateMutation.isPending ? <span className="flex items-center gap-2">{spinner}Saving…</span> : 'Save Changes'}
            </button>
        </>
    );

    const viewFooter = (
        <>
            <button onClick={() => setViewCourse(null)} className="btn-outline">Close</button>
            <button onClick={() => { setEditCourse(viewCourse); setViewCourse(null); }} className="btn-primary flex items-center gap-2">
                <FiEdit2 className="w-4 h-4" /> Edit Course
            </button>
        </>
    );

    return (
        <Layout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-in">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-black">Courses</h1>
                        <p className="text-brand-gray3 mt-0.5">Manage all course records</p>
                    </div>
                    <button onClick={() => setAddOpen(true)} className="btn-primary">
                        <FiPlus className="w-5 h-5" />
                        Add New Course
                    </button>
                </div>

                {/* Filters row */}
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search by course code or name..."
                        className="flex-1 max-w-md"
                    />
                    {/* Semester filter */}
                    <div className="relative">
                        <select
                            value={semester}
                            onChange={(e) => handleSemester(e.target.value)}
                            className="input pr-10 appearance-none min-w-[180px]"
                        >
                            <option value="">All Semesters</option>
                            {semesters.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {semester && (
                            <button
                                onClick={() => handleSemester('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray3 hover:text-brand-red"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Active filter badge */}
                {semester && (
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/20 text-brand-black
                             text-sm font-medium rounded-full border border-brand-yellow">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {semester}
                            <button onClick={() => handleSemester('')} className="ml-1 hover:text-brand-red">
                                <FiX className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    </div>
                )}

                {/* Table */}
                <CourseTable
                    courses={courses}
                    loading={isLoading}
                    onView={(c) => setViewCourse(c)}
                    onEdit={(c) => setEditCourse(c)}
                    onDelete={(c) => setDeleteDialog({ open: true, course: c })}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 animate-fade-in">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-outline btn-sm disabled:opacity-40">Previous</button>
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
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
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="btn-outline btn-sm disabled:opacity-40">Next</button>
                    </div>
                )}

                {/* ── View Modal ── */}
                <Modal
                    open={!!viewCourse}
                    onClose={() => setViewCourse(null)}
                    title="Course Details"
                    subtitle={viewCourse?.course_name}
                    icon={FiBook}
                    footer={viewFooter}
                    maxWidth="max-w-lg"
                >
                    {viewCourse && <CourseDetailBody course={viewCourse} />}
                </Modal>

                {/* ── Add Modal ── */}
                <Modal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    title="Add New Course"
                    subtitle="Fill in the details to create a new course"
                    icon={FiBookOpen}
                    footer={addFooter}
                    maxWidth="max-w-2xl"
                >
                    <CourseForm formId={ADD_FORM_ID} onSubmit={handleCreateSubmit} loading={createMutation.isPending} />
                </Modal>

                {/* ── Edit Modal ── */}
                <Modal
                    open={!!editCourse}
                    onClose={() => setEditCourse(null)}
                    title="Edit Course"
                    subtitle={editCourse ? `${editCourse.course_code} – ${editCourse.course_name}` : ''}
                    icon={FiEdit2}
                    footer={editFooter}
                    maxWidth="max-w-2xl"
                >
                    {editCourse && (
                        <CourseForm
                            key={editCourse.course_id}
                            course={editCourse}
                            formId={EDIT_FORM_ID}
                            onSubmit={handleEditSubmit}
                            loading={updateMutation.isPending}
                        />
                    )}
                </Modal>

                {/* ── Delete Confirm ── */}
                <ConfirmDialog
                    open={deleteDialog.open}
                    title="Delete Course"
                    message={`Are you sure you want to delete "${deleteDialog.course?.course_name}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteDialog({ open: false, course: null })}
                    confirmText="Delete"
                />
            </div>
        </Layout>
    );
}
