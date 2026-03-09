const express = require('express');
const studentController = require('../controllers/studentController');
const studentValidators = require('../validators/studentValidator');
const validate = require('../validators/validateRequest');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/students:
 *   get:
 *     tags: [Students]
 *     summary: Get all students
 *     description: Retrieve paginated list of students with optional search. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by student number, name, or ID number
 *     responses:
 *       200:
 *         description: List of students
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 */
router.get('/', studentValidators.list, validate, studentController.getAllStudents);

/**
 * @swagger
 * /api/students/by-ids:
 *   get:
 *     tags: [Students]
 *     summary: Get students by IDs
 *     description: Retrieve multiple students by their IDs (used by Enrollment Service)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated student IDs (e.g., "1,2,3")
 *     responses:
 *       200:
 *         description: Array of students
 *       400:
 *         description: Missing ids parameter
 */
router.get('/by-ids', studentController.getStudentsByIds);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Get student by ID
 *     description: Retrieve detailed information about a specific student. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *       404:
 *         description: Student not found
 */
router.get('/:id', studentValidators.getById, validate, studentController.getStudentById);

/**
 * @swagger
 * /api/students:
 *   post:
 *     tags: [Students]
 *     summary: Create new student
 *     description: Register a new student (auto-generates student number). Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Validation error or ID number already exists
 */
router.post('/', studentValidators.create, validate, studentController.createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     tags: [Students]
 *     summary: Update student
 *     description: Update existing student information. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
router.put('/:id', studentValidators.update, validate, studentController.updateStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Delete student
 *     description: Remove a student from the system. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete('/:id', studentValidators.delete, validate, studentController.deleteStudent);

module.exports = router;
