const { body, param, query } = require('express-validator');

const VALID_STATUSES = ['enrolled', 'completed', 'dropped', 'failed'];
const currentYear = new Date().getFullYear();

const enrollmentValidators = {
    enroll: [
        body('studentId')
            .notEmpty().withMessage('studentId is required')
            .isInt({ min: 1 }).withMessage('studentId must be a positive integer'),

        body('courseIds')
            .isArray({ min: 1 }).withMessage('courseIds must be a non-empty array')
            .custom(ids => ids.every(id => Number.isInteger(id) && id > 0))
            .withMessage('Each courseId must be a positive integer'),

        body('semester')
            .trim().notEmpty().withMessage('semester is required')
            .isLength({ max: 50 }).withMessage('semester max 50 chars'),

        body('academicYear')
            .notEmpty().withMessage('academicYear is required')
            .isInt({ min: 2000, max: currentYear + 5 })
            .withMessage(`academicYear must be between 2000 and ${currentYear + 5}`)
    ],

    updateSemester: [
        param('studentId').isInt({ min: 1 }).withMessage('Invalid studentId'),

        body('semester')
            .trim().notEmpty().withMessage('semester is required'),

        body('academicYear')
            .notEmpty().withMessage('academicYear is required')
            .isInt({ min: 2000 }).withMessage('academicYear must be >= 2000'),

        body('courseIds')
            .isArray().withMessage('courseIds must be an array')
            .custom(ids => ids.every(id => Number.isInteger(id) && id > 0))
            .withMessage('Each courseId must be a positive integer')
    ],

    updateStatus: [
        param('id').isInt({ min: 1 }).withMessage('Invalid enrollment ID'),

        body('status')
            .notEmpty().withMessage('status is required')
            .isIn(VALID_STATUSES).withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`)
    ],

    getById: [
        param('id').isInt({ min: 1 }).withMessage('Invalid enrollment ID')
    ],

    delete: [
        param('id').isInt({ min: 1 }).withMessage('Invalid enrollment ID')
    ],

    list: [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('studentId').optional().isInt({ min: 1 }),
        query('courseId').optional().isInt({ min: 1 }),
        query('semester').optional().trim(),
        query('academicYear').optional().isInt({ min: 2000 }),
        query('status').optional().isIn(VALID_STATUSES)
    ],

    studentHistory: [
        param('studentId').isInt({ min: 1 }).withMessage('Invalid studentId')
    ],

    studentSemester: [
        param('studentId').isInt({ min: 1 }).withMessage('Invalid studentId'),
        query('semester').notEmpty().withMessage('semester query param required'),
        query('academicYear').notEmpty().isInt({ min: 2000 }).withMessage('academicYear required')
    ]
};

module.exports = enrollmentValidators;
