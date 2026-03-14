const { body, query, param } = require('express-validator');

const VALID_ACTION_TYPES = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT'];

// ── POST /api/audit-logs ───────────────────────────────────────────────────
const createLog = [
    body('adminId')
        .notEmpty().withMessage('adminId is required')
        .isInt({ min: 1 }).withMessage('adminId must be a positive integer'),

    body('studentId')
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('studentId must be a positive integer'),

    body('serviceName')
        .notEmpty().withMessage('serviceName is required')
        .isString().trim()
        .isLength({ max: 100 }).withMessage('serviceName must be at most 100 characters'),

    body('actionType')
        .notEmpty().withMessage('actionType is required')
        .isIn(VALID_ACTION_TYPES)
        .withMessage(`actionType must be one of: ${VALID_ACTION_TYPES.join(', ')}`),

    body('actionDetails')
        .optional({ nullable: true })
        .isString().trim(),

    body('oldValues')
        .optional({ nullable: true }),

    body('newValues')
        .optional({ nullable: true }),

    body('ipAddress')
        .optional({ nullable: true })
        .isString().trim()
        .isLength({ max: 45 }).withMessage('ipAddress must be at most 45 characters')
];

// ── GET /api/audit-logs ────────────────────────────────────────────────────
const listLogs = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),

    query('adminId')
        .optional()
        .isInt({ min: 1 }).withMessage('adminId must be a positive integer'),

    query('studentId')
        .optional()
        .isInt({ min: 1 }).withMessage('studentId must be a positive integer'),

    query('serviceName')
        .optional()
        .isString().trim(),

    query('actionType')
        .optional()
        .isIn(VALID_ACTION_TYPES)
        .withMessage(`actionType must be one of: ${VALID_ACTION_TYPES.join(', ')}`),

    query('dateFrom')
        .optional()
        .isDate().withMessage('dateFrom must be a valid date (YYYY-MM-DD)'),

    query('dateTo')
        .optional()
        .isDate().withMessage('dateTo must be a valid date (YYYY-MM-DD)')
];

// ── GET /api/audit-logs/:id ────────────────────────────────────────────────
const getById = [
    param('id')
        .isInt({ min: 1 }).withMessage('Log ID must be a positive integer')
];

module.exports = { createLog, listLogs, getById };
