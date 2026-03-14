import { useState } from 'react';
import {
    FiActivity, FiX, FiEye, FiFilter, FiDatabase,
    FiRefreshCw, FiServer, FiCalendar
} from 'react-icons/fi';
import Layout from '../../components/layout/Layout';
import AuditLogTable from '../../components/auditLogs/AuditLogTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { formatDate } from '../../utils/formatters';

const DEFAULT_LIMIT = 20;

const ACTION_TYPES = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT'];
const SERVICE_NAMES = [
    'student-service',
    'course-service',
    'enrollment-service',
    'audit-service',
];

const ACTION_COLORS = {
    CREATE: 'bg-green-500',
    UPDATE: 'bg-brand-yellow',
    DELETE: 'bg-brand-red',
    VIEW: 'bg-blue-500',
    LOGIN: 'bg-gray-500',
    LOGOUT: 'bg-gray-400',
};

const ACTION_STYLES = {
    CREATE: 'bg-green-500 text-white',
    UPDATE: 'bg-brand-yellow text-brand-black',
    DELETE: 'bg-brand-red text-brand-white',
    VIEW: 'bg-blue-500 text-white',
    LOGIN: 'bg-gray-500 text-white',
    LOGOUT: 'bg-gray-400 text-white',
};

// ── Stats section ────────────────────────────────────────────────────────────
function StatsSection({ stats, loading }) {
    if (loading) return <div className="py-6 flex justify-center"><LoadingSpinner /></div>;
    if (!stats) return null;

    const { total, byActionType = [], byService = [], last7Days = [] } = stats;

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total */}
                <div className="bg-brand-black text-brand-white rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-brand-gray3 text-xs font-semibold uppercase tracking-wide mb-1">Total Logs</p>
                        <p className="text-4xl font-bold">{total}</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
                        <FiActivity className="w-6 h-6 text-brand-white" />
                    </div>
                </div>

                {/* By Action Type */}
                <div className="card p-5">
                    <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <FiRefreshCw className="w-3.5 h-3.5" /> By Action
                    </p>
                    <div className="space-y-1.5">
                        {byActionType.slice(0, 4).map(({ action_type, count }) => (
                            <div key={action_type} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ACTION_COLORS[action_type] || 'bg-brand-gray2'}`} />
                                <span className="text-xs font-semibold text-brand-black flex-1">{action_type}</span>
                                <span className="text-xs font-bold text-brand-gray3">{count}</span>
                                <div className="w-20 h-1.5 bg-brand-gray rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${ACTION_COLORS[action_type] || 'bg-brand-gray2'}`}
                                        style={{ width: `${Math.round((count / total) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* By Service */}
                <div className="card p-5">
                    <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <FiServer className="w-3.5 h-3.5" /> By Service
                    </p>
                    <div className="space-y-1.5">
                        {byService.slice(0, 4).map(({ service_name, count }) => (
                            <div key={service_name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0" />
                                <span className="text-xs font-semibold text-brand-black flex-1 truncate">{service_name}</span>
                                <span className="text-xs font-bold text-brand-gray3">{count}</span>
                                <div className="w-20 h-1.5 bg-brand-gray rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-brand-red"
                                        style={{ width: `${Math.round((count / total) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Last 7 days bar chart */}
            {last7Days.length > 0 && (
                <div className="card p-5">
                    <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5" /> Last 7 Days
                    </p>
                    <div className="flex items-end gap-2 h-16">
                        {(() => {
                            const maxCount = Math.max(...last7Days.map((d) => Number(d.count)), 1);
                            return last7Days.map((day) => (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-brand-gray3 font-bold">{day.count}</span>
                                    <div
                                        className="w-full bg-brand-red rounded-t-sm min-h-[4px] transition-all"
                                        style={{ height: `${Math.max(4, Math.round((Number(day.count) / maxCount) * 48))}px` }}
                                    />
                                    <span className="text-[9px] text-brand-gray3">
                                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                                    </span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Smart JSON renderer ──────────────────────────────────────────────────────
function JsonValueRenderer({ value }) {
    if (value === null || value === undefined) return <span className="text-brand-gray3 italic">null</span>;
    if (typeof value === 'boolean') return <span className="font-mono font-bold">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="font-mono">{value}</span>;
    if (typeof value === 'string') return <span>{value}</span>;
    if (Array.isArray(value)) {
        return (
            <div className="flex flex-wrap gap-1 mt-0.5">
                {value.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-brand-black text-brand-white rounded text-xs font-mono">
                        {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                    </span>
                ))}
            </div>
        );
    }
    // Nested object — show as compact badge
    return (
        <span className="text-xs font-mono text-brand-gray3 bg-brand-gray2 px-2 py-0.5 rounded">
            {JSON.stringify(value)}
        </span>
    );
}

function JsonTable({ raw, label, accent }) {
    if (!raw) return null;

    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = raw; }

    // If it's not an object/array, just show the raw string
    if (typeof parsed !== 'object' || parsed === null) {
        return (
            <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${accent}`}>{label}</p>
                <div className="bg-brand-gray rounded-xl px-4 py-3 text-sm text-brand-black">{String(parsed)}</div>
            </div>
        );
    }

    // Normalise arrays-of-primitives vs objects
    const entries = Array.isArray(parsed)
        ? parsed.map((item, i) => [`[${i}]`, item])
        : Object.entries(parsed);

    return (
        <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${accent}`}>{label}</p>
            <div className="bg-brand-gray rounded-xl overflow-hidden divide-y divide-brand-gray2">
                {entries.map(([key, val]) => (
                    <div key={key} className="flex items-start gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-brand-gray3 font-mono min-w-[110px] pt-0.5 break-all">
                            {key}
                        </span>
                        <span className="text-xs text-brand-black font-medium flex-1 break-all">
                            <JsonValueRenderer value={val} />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Log detail modal body ────────────────────────────────────────────────────
function LogDetailBody({ log }) {
    return (
        <div className="space-y-4">
            {/* Header banner */}
            <div className="bg-brand-black text-brand-white rounded-xl p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-brand-gray3 font-medium mb-0.5">Log #{log.log_id}</p>
                    <p className="font-bold">{log.action_details}</p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold
                    ${ACTION_STYLES[log.action_type] || 'bg-brand-gray text-brand-gray3'}`}>
                    {log.action_type}
                </span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { label: 'Service', value: log.service_name, mono: true },
                    { label: 'Admin ID', value: log.admin_id ? `#${log.admin_id}` : '—' },
                    { label: 'Student ID', value: log.student_id ? `#${log.student_id}` : '—' },
                    { label: 'Timestamp', value: formatDate(log.created_at) },
                ].map(({ label, value, mono }) => (
                    <div key={label} className="bg-brand-gray rounded-xl p-3">
                        <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1">{label}</p>
                        <p className={`text-brand-black font-semibold text-sm ${mono ? 'font-mono' : ''}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Old / New values — rendered as key-value tables */}
            {(log.old_values || log.new_values) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <JsonTable raw={log.old_values} label="Old Values" accent="text-brand-red" />
                    <JsonTable raw={log.new_values} label="New Values" accent="text-green-600" />
                </div>
            )}
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AuditLogs() {
    const [page, setPage] = useState(1);
    const [actionType, setActionType] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [viewLog, setViewLog] = useState(null);

    const params = {
        page,
        limit: DEFAULT_LIMIT,
        ...(actionType && { actionType }),
        ...(serviceName && { serviceName }),
        ...(dateFrom && { dateFrom }),
    };

    const { data, isLoading } = useAuditLogs(params);

    const logs = data?.data?.logs || [];
    const totalPages = data?.data?.totalPages || 1;
    const total = data?.data?.total || 0;

    const clearFilters = () => {
        setActionType(''); setServiceName(''); setDateFrom('');
        setPage(1);
    };

    const hasFilters = actionType || serviceName || dateFrom;

    const viewFooter = (
        <button onClick={() => setViewLog(null)} className="btn-outline">Close</button>
    );

    return (
        <Layout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-in">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-black">Audit Logs</h1>
                        <p className="text-brand-gray3 mt-0.5">System audit trail — all recorded actions</p>
                    </div>
                </div>

                {/* Total Count Display */}
                {!isLoading && (
                    <div className="card p-6 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-brand-red rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiDatabase className="w-7 h-7 text-brand-white" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide mb-1.5">Total Audit Logs</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold text-brand-black">{total}</p>
                                    <p className="text-sm text-brand-gray3 font-medium">log{total !== 1 ? 's' : ''} recorded</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="card p-4 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 mb-1">
                        <FiFilter className="w-4 h-4 text-brand-gray3" />
                        <span className="text-xs font-semibold text-brand-gray3 uppercase tracking-wide">Filters</span>
                        {hasFilters && (
                            <button onClick={clearFilters} className="ml-auto text-xs text-brand-red font-semibold hover:underline flex items-center gap-1">
                                <FiX className="w-3 h-3" /> Clear all
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Action Type */}
                        <div className="relative">
                            <select value={actionType} onChange={(e) => { setActionType(e.target.value); setPage(1); }}
                                className="input appearance-none pr-8 text-sm">
                                <option value="">All Actions</option>
                                {ACTION_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                            {actionType && (
                                <button onClick={() => { setActionType(''); setPage(1); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray3 hover:text-brand-red">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Service Name */}
                        <div className="relative">
                            <select value={serviceName} onChange={(e) => { setServiceName(e.target.value); setPage(1); }}
                                className="input appearance-none pr-8 text-sm">
                                <option value="">All Services</option>
                                {SERVICE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {serviceName && (
                                <button onClick={() => { setServiceName(''); setPage(1); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray3 hover:text-brand-red">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Date From */}
                        <div className="relative">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                                className="input text-sm"
                                placeholder="Filter by date"
                            />
                            {dateFrom && (
                                <button onClick={() => { setDateFrom(''); setPage(1); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray3 hover:text-brand-red">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active filter badges */}
                {hasFilters && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {actionType && (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                ${ACTION_STYLES[actionType] || 'bg-brand-gray text-brand-gray3'}`}>
                                {actionType}
                                <button onClick={() => { setActionType(''); setPage(1); }} className="ml-0.5 hover:opacity-70">
                                    <FiX className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {serviceName && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-black text-brand-white rounded-full text-xs font-mono">
                                {serviceName}
                                <button onClick={() => { setServiceName(''); setPage(1); }} className="ml-0.5 hover:opacity-70">
                                    <FiX className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {dateFrom && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/20 text-brand-black border border-brand-yellow rounded-full text-xs font-medium">
                                <FiCalendar className="w-3 h-3" />
                                From: {dateFrom}
                                <button onClick={() => { setDateFrom(''); setPage(1); }} className="ml-0.5 hover:text-brand-red">
                                    <FiX className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Table */}
                <AuditLogTable logs={logs} loading={isLoading} onView={(log) => setViewLog(log)} />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 animate-fade-in">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                            className="btn-outline btn-sm disabled:opacity-40">Previous</button>
                        <div className="flex items-center gap-1">
                            {[...Array(Math.min(totalPages, 7))].map((_, i) => (
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

                {/* ── View Log Modal ── */}
                <Modal
                    open={!!viewLog}
                    onClose={() => setViewLog(null)}
                    title="Audit Log Detail"
                    subtitle={viewLog ? `${viewLog.action_type} — ${viewLog.service_name}` : ''}
                    icon={FiDatabase}
                    footer={viewFooter}
                    maxWidth="max-w-2xl"
                >
                    {viewLog && <LogDetailBody log={viewLog} />}
                </Modal>

            </div>
        </Layout>
    );
}
