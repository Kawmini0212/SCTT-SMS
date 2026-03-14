import { FiEye, FiActivity } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const ACTION_STYLES = {
    CREATE: 'bg-green-500 text-white border border-green-500',
    UPDATE: 'bg-brand-yellow text-brand-black border border-brand-yellow',
    DELETE: 'bg-brand-red text-brand-white border border-brand-red',
    VIEW: 'bg-blue-500 text-white border border-blue-500',
    LOGIN: 'bg-gray-500 text-white border border-gray-500',
    LOGOUT: 'bg-gray-400 text-white border border-gray-400',
};

function ActionBadge({ type }) {
    return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold
            ${ACTION_STYLES[type] || 'bg-brand-gray text-brand-gray3'}`}>
            {type}
        </span>
    );
}

export default function AuditLogTable({ logs = [], loading, onView }) {
    if (loading) {
        return (
            <div className="card p-12 flex justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!logs.length) {
        return (
            <div className="card p-12 text-center">
                <FiActivity className="w-12 h-12 mx-auto text-brand-gray2 mb-3" />
                <p className="text-brand-gray3 font-semibold">No audit logs found</p>
                <p className="text-brand-gray3 text-sm mt-1">Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-brand-black text-brand-white text-left">
                            <th className="px-5 py-3.5 font-semibold">ID</th>
                            <th className="px-5 py-3.5 font-semibold">Action</th>
                            <th className="px-5 py-3.5 font-semibold">Service</th>
                            <th className="px-5 py-3.5 font-semibold">Details</th>
                            <th className="px-5 py-3.5 font-semibold">Time</th>
                            <th className="px-5 py-3.5 font-semibold text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gray2">
                        {logs.map((log) => (
                            <tr key={log.log_id} className="hover:bg-brand-gray/60 transition-colors">
                                <td className="px-5 py-3.5 font-mono text-xs text-brand-gray3">
                                    #{log.log_id}
                                </td>
                                <td className="px-5 py-3.5">
                                    <ActionBadge type={log.action_type} />
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="inline-flex px-2 py-0.5 bg-brand-gray rounded text-xs font-mono text-brand-gray3 border border-brand-gray2">
                                        {log.service_name}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 max-w-xs">
                                    <p className="text-brand-black font-medium text-xs truncate">
                                        {log.action_details}
                                    </p>
                                </td>
                                <td className="px-5 py-3.5 text-xs text-brand-gray3 whitespace-nowrap">
                                    {formatDate(log.created_at)}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <button
                                        onClick={() => onView?.(log)}
                                        className="p-2 rounded-lg bg-brand-gray hover:bg-brand-yellow/20 transition-colors text-brand-gray3 hover:text-brand-black"
                                        title="View details"
                                    >
                                        <FiEye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
