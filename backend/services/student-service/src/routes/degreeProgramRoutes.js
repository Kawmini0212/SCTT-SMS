const express = require('express');
const degreeProgramController = require('../controllers/degreeProgramController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/degree-programs:
 *   get:
 *     tags: [Degree Programs]
 *     summary: Get all degree programs
 *     description: Retrieve list of all available degree programs. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of degree programs
 */
router.get('/', degreeProgramController.getAllPrograms);

/**
 * @swagger
 * /api/degree-programs/{id}:
 *   get:
 *     tags: [Degree Programs]
 *     summary: Get degree program by ID
 *     description: Retrieve detailed information about a specific degree program. Requires JWT authentication.
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
 *         description: Degree program details
 *       404:
 *         description: Degree program not found
 */
router.get('/:id', degreeProgramController.getProgramById);

/**
 * @swagger
 * /api/degree-programs:
 *   post:
 *     tags: [Degree Programs]
 *     summary: Create new degree program
 *     description: Create a new degree program. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DegreeProgram'
 *     responses:
 *       201:
 *         description: Degree program created
 *       400:
 *         description: Program code already exists
 */
router.post('/', degreeProgramController.createProgram);

/**
 * @swagger
 * /api/degree-programs/{id}:
 *   put:
 *     tags: [Degree Programs]
 *     summary: Update degree program
 *     description: Update an existing degree program. Requires JWT authentication.
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
 *             $ref: '#/components/schemas/DegreeProgram'
 *     responses:
 *       200:
 *         description: Degree program updated
 *       404:
 *         description: Degree program not found
 */
router.put('/:id', degreeProgramController.updateProgram);

/**
 * @swagger
 * /api/degree-programs/{id}:
 *   delete:
 *     tags: [Degree Programs]
 *     summary: Delete degree program
 *     description: Delete a degree program from the system. Requires JWT authentication.
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
 *         description: Degree program deleted
 *       404:
 *         description: Degree program not found
 */
router.delete('/:id', degreeProgramController.deleteProgram);

module.exports = router;
