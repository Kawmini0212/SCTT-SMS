const db = require('../config/database');

class AuditLog {

    // ── Insert a new audit log entry ──────────────────────────────────────────
    static async create({ adminId, studentId, serviceName, actionType, actionDetails, oldValues, newValues, ipAddress }) {
        const [result] = await db.execute(
            `INSERT INTO audit_logs
             (admin_id, student_id, service_name, action_type, action_details, old_values, new_values, ip_address)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                adminId,
                studentId || null,
                serviceName,
                actionType,
                actionDetails || null,
                oldValues ? JSON.stringify(oldValues) : null,
                newValues ? JSON.stringify(newValues) : null,
                ipAddress || null
            ]
        );
        return { logId: result.insertId };
    }

    // ── Get a single log by primary key ───────────────────────────────────────
    static async findById(logId) {
        const [rows] = await db.execute(
            'SELECT * FROM audit_logs WHERE log_id = ?',
            [logId]
        );
        return rows[0] || null;
    }

    // ── Paginated, filterable log list ────────────────────────────────────────
    static async findAll(page = 1, limit = 20, filters = {}) {
        const offset = (page - 1) * limit;
        const conditions = [];
        const params = [];

        if (filters.adminId) { conditions.push('admin_id = ?'); params.push(filters.adminId); }
        if (filters.studentId) { conditions.push('student_id = ?'); params.push(filters.studentId); }
        if (filters.serviceName) { conditions.push('service_name = ?'); params.push(filters.serviceName); }
        if (filters.actionType) { conditions.push('action_type = ?'); params.push(filters.actionType); }
        if (filters.dateFrom) { conditions.push('created_at >= ?'); params.push(filters.dateFrom); }
        if (filters.dateTo) { conditions.push('created_at <= ?'); params.push(filters.dateTo + ' 23:59:59'); }

        const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

        const [rows] = await db.execute(
            `SELECT * FROM audit_logs ${where}
             ORDER BY created_at DESC
             LIMIT ${Math.abs(Number(limit))} OFFSET ${Math.abs(Number(offset))}`,
            params
        );
        const [[countRow]] = await db.execute(
            `SELECT COUNT(*) as total FROM audit_logs ${where}`,
            params
        );

        return {
            logs: rows,
            total: countRow.total,
            page,
            totalPages: Math.ceil(countRow.total / limit)
        };
    }

    // ── Summary statistics ────────────────────────────────────────────────────
    static async getStats() {
        const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM audit_logs');

        const [byActionType] = await db.execute(
            `SELECT action_type, COUNT(*) as count
             FROM audit_logs
             GROUP BY action_type
             ORDER BY count DESC`
        );

        const [byService] = await db.execute(
            `SELECT service_name, COUNT(*) as count
             FROM audit_logs
             GROUP BY service_name
             ORDER BY count DESC`
        );

        const [last7Days] = await db.execute(
            `SELECT DATE(created_at) as date, COUNT(*) as count
             FROM audit_logs
             WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY DATE(created_at)
             ORDER BY date ASC`
        );

        return { total, byActionType, byService, last7Days };
    }
}

module.exports = AuditLog;
