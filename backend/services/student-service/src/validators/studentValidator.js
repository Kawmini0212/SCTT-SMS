const { body, param, query } = require('express-validator');

const studentValidators = {
    create: [
        body('firstName')
            .trim()
            .notEmpty().withMessage('First name is required')
            .isLength({ min: 2, max: 100 }).withMessage('First name must be between 2 and 100 characters'),

        body('lastName')
            .trim()
            .notEmpty().withMessage('Last name is required')
            .isLength({ min: 2, max: 100 }).withMessage('Last name must be between 2 and 100 characters'),

        body('address')
            .trim()
            .notEmpty().withMessage('Address is required'),

        body('birthday')
            .notEmpty().withMessage('Birthday is required')
            .isDate().withMessage('Invalid date format'),

        body('idNumber')
            .trim()
            .notEmpty().withMessage('ID number is required')
            .matches(/^[A-Z0-9]+$/).withMessage('ID number must contain only uppercase letters and numbers'),

        body('degreeProgramId')
            .notEmpty().withMessage('Degree program is required')
            .isInt({ min: 1 }).withMessage('Invalid degree program ID'),

        body('currentYear')
            .optional()
            .isInt({ min: 1, max: 4 }).withMessage('Current year must be between 1 and 4'),

        body('currentSemester')
            .optional()
            .trim()
            .isIn(['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'])
            .withMessage('Invalid semester')
    ],

    update: [
        param('id').isInt({ min: 1 }).withMessage('Invalid student ID'),
        body('firstName').optional().trim().isLength({ min: 2, max: 100 }),
        body('lastName').optional().trim().isLength({ min: 2, max: 100 }),
        body('address').optional().trim(),
        body('birthday').optional().isDate(),
        body('degreeProgramId').optional().isInt({ min: 1 }),
        body('currentYear').optional().isInt({ min: 1, max: 4 }),
        body('currentSemester').optional().trim()
    ],

    getById: [
        param('id').isInt({ min: 1 }).withMessage('Invalid student ID')
    ],

    delete: [
        param('id').isInt({ min: 1 }).withMessage('Invalid student ID')
    ],

    list: [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('search').optional().trim()
    ]
};

module.exports = studentValidators;
