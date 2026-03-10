const express = require('express');
const authController = require('../controllers/authController');
const { loginValidation, registerValidation } = require('../middleware/validation');
const validate = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Administrator login
 *     description: Authenticate administrator and receive JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Administrator logout
 *     description: Logout administrator (client-side token removal)
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     tags: [Authentication]
 *     summary: Verify JWT token
 *     description: Verify if the provided JWT token is valid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
router.get('/verify', authController.verifyToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current administrator
 *     description: Get details of currently authenticated administrator
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Administrator details
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authController.me);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register new administrator
 *     description: Create a new administrator account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Administrator registered successfully
 *       400:
 *         description: Validation error or username/email already exists
 */
router.post('/register', registerValidation, validate, authController.register);

module.exports = router;
