const AuditLog = require('../models/AuditLog');

class AuditController {

    // ── POST /api/audit-logs ──────────────────────────────────────────────────
    // Internal endpoint — called by peer services (no auth required)
    async createLog(req, res, next) {
        try {
            const {
                adminId,
                studentId,
                serviceName,
                actionType,
                actionDetails,
                oldValues,
                newValues,
                ipAddress
            } = req.body;

            const result = await AuditLog.create({
                adminId,
                studentId,
                serviceName,
                actionType,
                actionDetails,
                oldValues,
                newValues,
                ipAddress: ipAddress || req.ip
            });

            res.status(201).json({
                success: true,
                message: 'Audit log created',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // ── GET /api/audit-logs ───────────────────────────────────────────────────
    // Paginated, filterable list — JWT required
    async getLogs(req, res, next) {
        try {
            const {
                page = 1,
                limit = 20,
                adminId,
                studentId,
                serviceName,
                actionType,
                dateFrom,
                dateTo
            } = req.query;

            const result = await AuditLog.findAll(
                parseInt(page),
                parseInt(limit),
                {
                    adminId: adminId ? parseInt(adminId) : null,
                    studentId: studentId ? parseInt(studentId) : null,
                    serviceName: serviceName || null,
                    actionType: actionType || null,
                    dateFrom: dateFrom || null,
                    dateTo: dateTo || null
                }
            );

            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    // ── GET /api/audit-logs/stats ─────────────────────────────────────────────
    // Aggregate statistics — JWT required
    async getStats(req, res, next) {
        try {
            const stats = await AuditLog.getStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }

    // ── GET /api/audit-logs/:id ───────────────────────────────────────────────
    // Single log detail — JWT required
    async getLogById(req, res, next) {
        try {
            const log = await AuditLog.findById(req.params.id);
            if (!log) {
                return res.status(404).json({ success: false, message: 'Audit log not found' });
            }
            res.json({ success: true, data: log });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuditController();
