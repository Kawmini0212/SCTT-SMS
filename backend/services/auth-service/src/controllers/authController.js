const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Administrator = require('../models/Administrator');

class AuthController {
    // Login
    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            // Find administrator
            const admin = await Administrator.findByUsername(username);
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if active
            if (!admin.is_active) {
                return res.status(403).json({
                    success: false,
                    message: 'Account is disabled'
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, admin.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    adminId: admin.admin_id,
                    username: admin.username,
                    email: admin.email
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // Update last login
            await Administrator.updateLastLogin(admin.admin_id);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    admin: {
                        id: admin.admin_id,
                        username: admin.username,
                        email: admin.email,
                        fullName: admin.full_name
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Verify token
    async verifyToken(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            res.json({
                success: true,
                data: decoded
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    }

    // Get current user
    async me(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const admin = await Administrator.findById(decoded.adminId);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Administrator not found'
                });
            }

            res.json({
                success: true,
                data: {
                    id: admin.admin_id,
                    username: admin.username,
                    email: admin.email,
                    fullName: admin.full_name,
                    isActive: admin.is_active
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Logout (client-side handled, but we can log the action)
    async logout(req, res) {
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    }

    // Register new administrator (protected endpoint)
    async register(req, res, next) {
        try {
            const { username, email, password, fullName } = req.body;

            // Check if username exists
            const existingUsername = await Administrator.findByUsername(username);
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Check if email exists
            const existingEmail = await Administrator.findByEmail(email);
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create administrator
            const result = await Administrator.create({
                username,
                email,
                passwordHash,
                fullName
            });

            res.status(201).json({
                success: true,
                message: 'Administrator registered successfully',
                data: {
                    adminId: result.adminId
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
