const express = require('express');
const courseController = require('../controllers/courseController');
const courseValidators = require('../validators/courseValidator');
const validate = require('../validators/validateRequest');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All course routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags: [Courses]
 *     summary: Get all courses
 *     description: Retrieve paginated list of courses with optional search and semester filter
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Items per page (max 100)
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by course code or name
 *       - in: query
 *         name: semester
 *         schema: { type: string }
 *         description: Filter by semester (e.g. "Semester 1")
 *     responses:
 *       200:
 *         description: Paginated list of courses
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaginatedCourses'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', courseValidators.list, validate, courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/semesters:
 *   get:
 *     tags: [Courses]
 *     summary: Get distinct semester labels
 *     description: Returns a list of all unique semester values available in the course catalogue
 *     responses:
 *       200:
 *         description: List of semesters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { type: string }
 *                   example: ["Semester 1", "Semester 2"]
 */
router.get('/semesters', courseController.getSemesters);

/**
 * @swagger
 * /api/courses/by-ids:
 *   get:
 *     tags: [Courses]
 *     summary: Get multiple courses by IDs
 *     description: Retrieve multiple courses in one call (used internally by Enrollment Service)
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema: { type: string }
 *         description: Comma-separated course IDs (e.g. "1,2,3")
 *     responses:
 *       200:
 *         description: List of courses matching the provided IDs
 *       400:
 *         description: ids query param required
 */
router.get('/by-ids', courseController.getCoursesByIds);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Get course by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CourseResponse'
 *       404:
 *         description: Course not found
 */
router.get('/:id', courseValidators.getById, validate, courseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     tags: [Courses]
 *     summary: Create a new course
 *     description: Add a new course to the catalogue. Course code must be unique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     courseId: { type: integer, example: 9 }
 *       400:
 *         description: Validation error or course code already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', courseValidators.create, validate, courseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     tags: [Courses]
 *     summary: Update a course
 *     description: Update course name, credits, or semester. Course code cannot be changed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseName, credits]
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: Advanced Software Engineering
 *               credits:
 *                 type: integer
 *                 example: 4
 *               semester:
 *                 type: string
 *                 example: Semester 5
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.put('/:id', courseValidators.update, validate, courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     tags: [Courses]
 *     summary: Delete a course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete('/:id', courseValidators.delete, validate, courseController.deleteCourse);

module.exports = router;
