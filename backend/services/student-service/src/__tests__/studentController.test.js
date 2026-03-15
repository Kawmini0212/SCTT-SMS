const StudentController = require('../controllers/studentController');
const Student = require('../models/Student');
const auditClient = require('../utils/auditClient');

jest.mock('../models/Student');
jest.mock('../utils/auditClient');

describe('StudentController', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: { adminId: 1 },
            ip: '127.0.0.1',
            headers: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
    });

    describe('createStudent', () => {
        test('should create a student successfully', async () => {
            const studentData = {
                idNumber: 'STU001',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            mockReq.body = studentData;
            Student.findByIdNumber.mockResolvedValue(null);
            Student.create.mockResolvedValue({
                studentId: 1,
                ...studentData
            });

            await StudentController.createStudent(mockReq, mockRes, mockNext);

            expect(Student.findByIdNumber).toHaveBeenCalledWith(studentData.idNumber);
            expect(Student.create).toHaveBeenCalledWith(studentData);
            expect(auditClient.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Student created successfully'
                })
            );
        });

        test('should return 400 if student with ID number already exists', async () => {
            const studentData = {
                idNumber: 'STU001',
                firstName: 'John',
                lastName: 'Doe'
            };

            mockReq.body = studentData;
            Student.findByIdNumber.mockResolvedValue({ studentId: 1, idNumber: 'STU001' });

            await StudentController.createStudent(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.stringContaining('already exists')
                })
            );
        });

        test('should call next with error on exception', async () => {
            const error = new Error('Database error');
            mockReq.body = { idNumber: 'STU001' };
            Student.findByIdNumber.mockRejectedValue(error);

            await StudentController.createStudent(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getAllStudents', () => {
        test('should get all students with pagination', async () => {
            const mockStudents = {
                students: [
                    { studentId: 1, firstName: 'John', lastName: 'Doe' },
                    { studentId: 2, firstName: 'Jane', lastName: 'Smith' }
                ],
                totalCount: 2,
                page: 1,
                limit: 10
            };

            mockReq.query = { page: 1, limit: 10 };
            Student.findAll.mockResolvedValue(mockStudents);

            await StudentController.getAllStudents(mockReq, mockRes, mockNext);

            expect(Student.findAll).toHaveBeenCalledWith(1, 10, '');
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockStudents
            });
        });

        test('should filter students by search term', async () => {
            const mockResult = {
                students: [{ studentId: 1, firstName: 'John' }],
                totalCount: 1
            };

            mockReq.query = { page: 1, limit: 10, search: 'John' };
            Student.findAll.mockResolvedValue(mockResult);

            await StudentController.getAllStudents(mockReq, mockRes, mockNext);

            expect(Student.findAll).toHaveBeenCalledWith(1, 10, 'John');
        });

        test('should use default pagination parameters', async () => {
            mockReq.query = {};
            Student.findAll.mockResolvedValue({ students: [], totalCount: 0 });

            await StudentController.getAllStudents(mockReq, mockRes, mockNext);

            expect(Student.findAll).toHaveBeenCalledWith(1, 10, '');
        });

        test('should handle database errors', async () => {
            const error = new Error('Database error');
            Student.findAll.mockRejectedValue(error);

            await StudentController.getAllStudents(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getStudentById', () => {
        test('should get student by ID successfully', async () => {
            const mockStudent = {
                studentId: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            mockReq.params = { id: 1 };
            Student.findById.mockResolvedValue(mockStudent);

            await StudentController.getStudentById(mockReq, mockRes, mockNext);

            expect(Student.findById).toHaveBeenCalledWith(1);
            expect(auditClient.log).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockStudent
            });
        });

        test('should return 404 if student not found', async () => {
            mockReq.params = { id: 999 };
            Student.findById.mockResolvedValue(null);

            await StudentController.getStudentById(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Student not found'
                })
            );
        });

        test('should log view action to audit service', async () => {
            mockReq.params = { id: 1 };
            Student.findById.mockResolvedValue({ studentId: 1 });

            await StudentController.getStudentById(mockReq, mockRes, mockNext);

            expect(auditClient.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    actionType: 'VIEW'
                })
            );
        });
    });

    describe('getStudentsByIds', () => {
        test('should get students by ID list', async () => {
            const mockStudents = [
                { studentId: 1, firstName: 'John' },
                { studentId: 2, firstName: 'Jane' }
            ];

            mockReq.query = { ids: '1,2' };
            Student.findByIds.mockResolvedValue(mockStudents);

            await StudentController.getStudentsByIds(mockReq, mockRes, mockNext);

            expect(Student.findByIds).toHaveBeenCalledWith([1, 2]);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockStudents
            });
        });

        test('should return 400 if ids param is missing', async () => {
            mockReq.query = {};

            await StudentController.getStudentsByIds(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        test('should filter out invalid ID values', async () => {
            mockReq.query = { ids: '1,invalid,2,abc' };
            Student.findByIds.mockResolvedValue([]);

            await StudentController.getStudentsByIds(mockReq, mockRes, mockNext);

            expect(Student.findByIds).toHaveBeenCalledWith([1, 2]);
        });
    });
});
