const express = require('express');
const ctrl = require('../controllers/enrollmentController');
const v = require('../validators/enrollmentValidator');
const validate = require('../validators/validateRequest');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     tags: [Enrollments]
 *     summary: Enroll a student in courses
 *     description: Enroll a student in one or more courses for a specific semester and academic year
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollRequest'
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *       400:
 *         description: Invalid student or course IDs
 *       401:
 *         description: Unauthorized
 */
router.post('/', v.enroll, validate, ctrl.enroll);

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     tags: [Enrollments]
 *     summary: List all enrollments
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: studentId
 *         schema: { type: integer }
 *       - in: query
 *         name: courseId
 *         schema: { type: integer }
 *       - in: query
 *         name: semester
 *         schema: { type: string }
 *       - in: query
 *         name: academicYear
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [enrolled, completed, dropped, failed] }
 *     responses:
 *       200:
 *         description: Paginated enrollment list
 */
router.get('/', v.list, validate, ctrl.getAllEnrollments);

/**
 * @swagger
 * /api/enrollments/student/{studentId}/history:
 *   get:
 *     tags: [History]
 *     summary: Get full course history for a student
 *     description: Returns all enrollments grouped by semester — maintains student course history throughout the degree (SRS requirement)
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Course history grouped by semester
 *       404:
 *         description: Student not found
 */
router.get('/student/:studentId/history', v.studentHistory, validate, ctrl.getStudentHistory);

/**
 * @swagger
 * /api/enrollments/student/{studentId}/semester:
 *   get:
 *     tags: [Enrollments]
 *     summary: Get enrollments for a specific semester
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: semester
 *         required: true
 *         schema: { type: string }
 *         example: Semester 1
 *       - in: query
 *         name: academicYear
 *         required: true
 *         schema: { type: integer }
 *         example: 2026
 *     responses:
 *       200:
 *         description: Enriched list of enrollments for the semester
 */
router.get('/student/:studentId/semester', v.studentSemester, validate, ctrl.getStudentSemesterEnrollments);

/**
 * @swagger
 * /api/enrollments/student/{studentId}/semester:
 *   put:
 *     tags: [Enrollments]
 *     summary: Change a student's courses for a semester
 *     description: >
 *       Replaces enrolled courses for a given student/semester/year combination.
 *       Courses not in the new list are marked 'dropped'; new courses are added.
 *       This implements the SRS requirement for administrators to change student courses every semester.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UpdateEnrollment'
 *               - type: object
 *                 required: [semester, academicYear]
 *                 properties:
 *                   semester:     { type: string, example: "Semester 1" }
 *                   academicYear: { type: integer, example: 2026 }
 *     responses:
 *       200:
 *         description: Courses updated — returns added and dropped course ID lists
 *       400:
 *         description: Invalid course IDs
 *       404:
 *         description: Student not found
 */
router.put('/student/:studentId/semester', v.updateSemester, validate, ctrl.updateSemesterCourses);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   get:
 *     tags: [Enrollments]
 *     summary: Get enrollment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Enrollment record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnrollmentRecord'
 *       404:
 *         description: Not found
 */
router.get('/:id', v.getById, validate, ctrl.getEnrollmentById);

/**
 * @swagger
 * /api/enrollments/{id}/status:
 *   patch:
 *     tags: [Enrollments]
 *     summary: Update enrollment status
 *     description: Mark an enrollment as completed, dropped, or failed
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
 *             $ref: '#/components/schemas/UpdateStatus'
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Enrollment not found
 */
router.patch('/:id/status', v.updateStatus, validate, ctrl.updateStatus);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     tags: [Enrollments]
 *     summary: Delete enrollment record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Enrollment deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', v.delete, validate, ctrl.deleteEnrollment);

module.exports = router;
