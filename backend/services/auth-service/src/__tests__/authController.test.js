const AuthController = require('../controllers/authController');
const Administrator = require('../models/Administrator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/Administrator');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
            headers: {},
            ip: '127.0.0.1'
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();

        process.env.JWT_SECRET = 'test-secret-key';
        process.env.JWT_EXPIRES_IN = '24h';

        jest.clearAllMocks();
    });

    describe('login', () => {
        test('should login successfully with valid credentials', async () => {
            const mockAdmin = {
                admin_id: 1,
                username: 'admin',
                email: 'admin@example.com',
                full_name: 'Admin User',
                password_hash: 'hashed_password',
                is_active: true
            };

            mockReq.body = { username: 'admin', password: 'password123' };

            Administrator.findByUsername.mockResolvedValue(mockAdmin);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('valid_token');

            await AuthController.login(mockReq, mockRes, mockNext);

            expect(Administrator.findByUsername).toHaveBeenCalledWith('admin');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockAdmin.password_hash);
            expect(jwt.sign).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Login successful'
                })
            );
        });

        test('should return 401 if user not found', async () => {
            mockReq.body = { username: 'nonexistent', password: 'password' };
            Administrator.findByUsername.mockResolvedValue(null);

            await AuthController.login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Invalid credentials'
                })
            );
        });

        test('should return 403 if account is disabled', async () => {
            const mockAdmin = {
                admin_id: 1,
                username: 'admin',
                is_active: false,
                password_hash: 'hashed'
            };

            mockReq.body = { username: 'admin', password: 'password' };
            Administrator.findByUsername.mockResolvedValue(mockAdmin);

            await AuthController.login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
        });

        test('should return 401 if password is invalid', async () => {
            const mockAdmin = {
                admin_id: 1,
                username: 'admin',
                is_active: true,
                password_hash: 'hashed_password'
            };

            mockReq.body = { username: 'admin', password: 'wrongpassword' };
            Administrator.findByUsername.mockResolvedValue(mockAdmin);
            bcrypt.compare.mockResolvedValue(false);

            await AuthController.login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        test('should handle database errors', async () => {
            const error = new Error('Database error');
            mockReq.body = { username: 'admin', password: 'password' };
            Administrator.findByUsername.mockRejectedValue(error);

            await AuthController.login(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('verifyToken', () => {
        test('should verify valid token', async () => {
            const mockToken = 'valid_token';
            const decodedData = { adminId: 1, username: 'admin' };

            mockReq.headers.authorization = `Bearer ${mockToken}`;
            jwt.verify.mockReturnValue(decodedData);

            await AuthController.verifyToken(mockReq, mockRes, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: decodedData
            });
        });

        test('should return 401 if no token provided', async () => {
            mockReq.headers.authorization = undefined;

            await AuthController.verifyToken(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        test('should return 401 for invalid token', async () => {
            mockReq.headers.authorization = 'Bearer invalid_token';
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await AuthController.verifyToken(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });
    });

    describe('me', () => {
        test('should return current user info from token', async () => {
            const mockToken = 'valid_token';
            const userData = { adminId: 1, username: 'admin' };
            const mockAdmin = {
                admin_id: 1,
                username: 'admin',
                email: 'admin@example.com',
                full_name: 'Admin User',
                is_active: true
            };

            mockReq.headers.authorization = `Bearer ${mockToken}`;
            jwt.verify.mockReturnValue(userData);
            Administrator.findById.mockResolvedValue(mockAdmin);

            await AuthController.me(mockReq, mockRes, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
            expect(Administrator.findById).toHaveBeenCalledWith(userData.adminId);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: expect.objectContaining({
                    username: 'admin'
                })
            });
        });

        test('should return 401 if no token provided', async () => {
            mockReq.headers.authorization = undefined;

            await AuthController.me(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        test('should return 404 if administrator not found', async () => {
            const mockToken = 'valid_token';
            mockReq.headers.authorization = `Bearer ${mockToken}`;
            jwt.verify.mockReturnValue({ adminId: 999 });
            Administrator.findById.mockResolvedValue(null);

            await AuthController.me(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Administrator not found'
                })
            );
        });
    });
});
