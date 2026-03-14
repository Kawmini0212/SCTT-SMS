const express = require('express');
const ctrl = require('../controllers/auditController');
const v = require('../validators/auditValidator');
const validate = require('../validators/validateRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/audit-logs   — NO AUTH (internal endpoint called by peer services)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/audit-logs:
 *   post:
 *     tags: [Audit Logs]
 *     summary: Create an audit log entry (internal)
 *     description: >
 *       Internal endpoint consumed by all peer microservices (student-service,
 *       course-service, enrollment-service, auth-service) to record admin actions.
 *       No JWT token required — this endpoint is not exposed to end users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAuditLog'
 *     responses:
 *       201:
 *         description: Audit log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Audit log created" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     logId: { type: integer, example: 1 }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', v.createLog, validate, ctrl.createLog);

// ─────────────────────────────────────────────────────────────────────────────
// All routes below require JWT authentication
// ─────────────────────────────────────────────────────────────────────────────
router.use(auth);

/**
 * @swagger
 * /api/audit-logs/stats:
 *   get:
 *     tags: [Stats]
 *     summary: Get audit log statistics
 *     description: Returns aggregate counts grouped by action type, service, and daily counts for the last 7 days.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/AuditLogStats'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', ctrl.getStats);

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     tags: [Audit Logs]
 *     summary: List audit logs with filters and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *         description: Records per page (max 100)
 *       - in: query
 *         name: adminId
 *         schema: { type: integer }
 *         description: Filter by admin ID
 *       - in: query
 *         name: studentId
 *         schema: { type: integer }
 *         description: Filter by affected student ID
 *       - in: query
 *         name: serviceName
 *         schema: { type: string }
 *         example: enrollment-service
 *         description: Filter by originating service
 *       - in: query
 *         name: actionType
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT]
 *         description: Filter by action type
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date }
 *         example: "2026-01-01"
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date }
 *         example: "2026-12-31"
 *         description: End date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Paginated audit log list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:       { type: array, items: { $ref: '#/components/schemas/AuditLog' } }
 *                     total:      { type: integer }
 *                     page:       { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', v.listLogs, validate, ctrl.getLogs);

/**
 * @swagger
 * /api/audit-logs/{id}:
 *   get:
 *     tags: [Audit Logs]
 *     summary: Get a single audit log by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Audit log primary key
 *     responses:
 *       200:
 *         description: Audit log detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Audit log not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', v.getById, validate, ctrl.getLogById);

module.exports = router;
