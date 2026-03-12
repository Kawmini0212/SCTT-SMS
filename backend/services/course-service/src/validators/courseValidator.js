const { body, param, query } = require('express-validator');

const courseValidators = {
    create: [
        body('courseCode')
            .trim()
            .notEmpty().withMessage('Course code is required')
            .isLength({ min: 2, max: 50 }).withMessage('Course code must be 2–50 characters')
            .matches(/^[A-Z0-9]+$/).withMessage('Course code must contain only uppercase letters and numbers'),

        body('courseName')
            .trim()
            .notEmpty().withMessage('Course name is required')
            .isLength({ min: 3, max: 255 }).withMessage('Course name must be 3–255 characters'),

        body('credits')
            .notEmpty().withMessage('Credits are required')
            .isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),

        body('semester')
            .optional()
            .trim()
            .isLength({ max: 50 }).withMessage('Semester must be at most 50 characters'),

        body('year')
            .optional()
            .isInt({ min: 1, max: 4 }).withMessage('Year must be between 1 and 4')
    ],

    update: [
        param('id').isInt({ min: 1 }).withMessage('Invalid course ID'),

        body('courseName')
            .trim()
            .notEmpty().withMessage('Course name is required')
            .isLength({ min: 3, max: 255 }).withMessage('Course name must be 3–255 characters'),

        body('credits')
            .notEmpty().withMessage('Credits are required')
            .isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),

        body('semester')
            .optional()
            .trim()
            .isLength({ max: 50 }).withMessage('Semester must be at most 50 characters'),

        body('year')
            .optional()
            .isInt({ min: 1, max: 4 }).withMessage('Year must be between 1 and 4')
    ],

    getById: [
        param('id').isInt({ min: 1 }).withMessage('Invalid course ID')
    ],

    delete: [
        param('id').isInt({ min: 1 }).withMessage('Invalid course ID')
    ],

    list: [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
        query('search').optional().trim(),
        query('semester').optional().trim()
    ]
};

module.exports = courseValidators;
