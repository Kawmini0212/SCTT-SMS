const AuditController = require('../controllers/auditController');
const AuditLog = require('../models/AuditLog');

jest.mock('../models/AuditLog');

describe('AuditController', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
            ip: '127.0.0.1'
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
    });

    describe('createLog', () => {
        test('should create audit log successfully', async () => {
            const logData = {
                adminId: 1,
                studentId: 5,
                serviceName: 'student-service',
                actionType: 'CREATE',
                actionDetails: 'Created new student',
                newValues: JSON.stringify({ name: 'John Doe' }),
                ipAddress: '127.0.0.1'
            };

            mockReq.body = logData;
            AuditLog.create.mockResolvedValue({ log_id: 1, ...logData });

            await AuditController.createLog(mockReq, mockRes, mockNext);

            expect(AuditLog.create).toHaveBeenCalledWith(logData);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, message: 'Audit log created' })
            );
        });

        test('should use request IP if not provided', async () => {
            const logData = {
                adminId: 1,
                serviceName: 'student-service',
                actionType: 'CREATE'
            };

            mockReq.body = logData;
            mockReq.ip = '192.168.1.1';
            AuditLog.create.mockResolvedValue({ log_id: 1 });

            await AuditController.createLog(mockReq, mockRes, mockNext);

            expect(AuditLog.create).toHaveBeenCalledWith(
                expect.objectContaining({ ipAddress: '192.168.1.1' })
            );
        });

        test('should handle database errors', async () => {
            const error = new Error('DB error');
            mockReq.body = { adminId: 1 };
            AuditLog.create.mockRejectedValue(error);

            await AuditController.createLog(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });

        test('should handle optional fields', async () => {
            const logData = {
                adminId: 1,
                serviceName: 'course-service',
                actionType: 'UPDATE',
                oldValues: JSON.stringify({ credits: 3 }),
                newValues: JSON.stringify({ credits: 4 })
            };

            mockReq.body = logData;
            AuditLog.create.mockResolvedValue({ log_id: 1 });

            await AuditController.createLog(mockReq, mockRes, mockNext);

            expect(AuditLog.create).toHaveBeenCalledWith(expect.objectContaining(logData));
        });
    });

    describe('getLogs', () => {
        test('should get logs with pagination', async () => {
            mockReq.query = { page: 1, limit: 20 };
            AuditLog.findAll.mockResolvedValue({
                logs: [{ log_id: 1, actionType: 'CREATE' }],
                totalCount: 1
            });

            await AuditController.getLogs(mockReq, mockRes, mockNext);

            expect(AuditLog.findAll).toHaveBeenCalledWith(1, 20, expect.any(Object));
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should filter by adminId', async () => {
            mockReq.query = { page: 1, limit: 20, adminId: 1 };
            AuditLog.findAll.mockResolvedValue({ logs: [] });

            await AuditController.getLogs(mockReq, mockRes, mockNext);

            expect(AuditLog.findAll).toHaveBeenCalledWith(1, 20, expect.objectContaining({
                adminId: 1
            }));
        });

        test('should filter by studentId', async () => {
            mockReq.query = { page: 1, limit: 20, studentId: 5 };
            AuditLog.findAll.mockResolvedValue({ logs: [] });

            await AuditController.getLogs(mockReq, mockRes, mockNext);

            expect(AuditLog.findAll).toHaveBeenCalledWith(1, 20, expect.objectContaining({
                studentId: 5
            }));
        });

        test('should filter by serviceName', async () => {
            mockReq.query = { page: 1, limit: 20, serviceName: 'student-service' };
            AuditLog.findAll.mockResolvedValue({ logs: [] });

            await AuditController.getLogs(mockReq, mockRes, mockNext);

            expect(AuditLog.findAll).toHaveBeenCalledWith(1, 20, expect.objectContaining({
                serviceName: 'student-service'
            }));
        });

        test('should filter by actionType', async () => {
            mockReq.query = { page: 1, limit: 20, actionType: 'CREATE' };
            AuditLog.findAll.mockResolvedValue({ logs: [] });

            await AuditController.getLogs(mockReq, mockRes, mockNext);

            expect(AuditLog.findAll).toHaveBeenCalledWith(1, 20, expect.objectContaining({
                actionType: 'CREATE'
            }));
        });

        test('should filter by date range', async () => {
            mockReq.query = { page: 1, limit: 20, dateFrom: '2024-01-01', dateTo: '2024-12-31' };
            AuditLog.findAll.mockResolvedValue({ logs: [] });

            await AuditController.getLogs(mockReq, mockRes, mockNext);

            expect(AuditLog.findAll).toHaveBeenCalledWith(1, 20, expect.objectContaining({
                dateFrom: '2024-01-01',
                dateTo: '2024-12-31'
            }));
        });

        test('should use default pagination', async () => {
            mockReq.query = {};
            AuditLog.findAll.mockResolvedValue({ logs: [] });

            await AuditController.getLogs(mockReq, mockRes, mockNext);

            expect(AuditLog.findAll).toHaveBeenCalledWith(1, 20, expect.any(Object));
        });
    });

    describe('getStats', () => {
        test('should get audit statistics', async () => {
            const mockStats = {
                totalLogs: 150,
                logsByService: { 'student-service': 45 }
            };

            AuditLog.getStats.mockResolvedValue(mockStats);

            await AuditController.getStats(mockReq, mockRes, mockNext);

            expect(AuditLog.getStats).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockStats
            });
        });

        test('should handle empty stats', async () => {
            AuditLog.getStats.mockResolvedValue({});

            await AuditController.getStats(mockReq, mockRes, mockNext);

            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: {}
            });
        });

        test('should handle stats errors', async () => {
            const error = new Error('DB error');
            AuditLog.getStats.mockRejectedValue(error);

            await AuditController.getStats(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getLogById', () => {
        test('should get log by ID successfully', async () => {
            mockReq.params = { id: 1 };
            AuditLog.findById.mockResolvedValue({
                log_id: 1, adminId: 1, actionType: 'CREATE'
            });

            await AuditController.getLogById(mockReq, mockRes, mockNext);

            expect(AuditLog.findById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should return 404 if log not found', async () => {
            mockReq.params = { id: 999 };
            AuditLog.findById.mockResolvedValue(null);

            await AuditController.getLogById(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        test('should handle retrieveErrors', async () => {
            const error = new Error('DB error');
            mockReq.params = { id: 1 };
            AuditLog.findById.mockRejectedValue(error);

            await AuditController.getLogById(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
