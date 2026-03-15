const EnrollmentController = require('../controllers/enrollmentController');
const Enrollment = require('../models/Enrollment');
const { studentClient, courseClient, auditClient } = require('../utils/serviceClients');

jest.mock('../models/Enrollment');
jest.mock('../utils/serviceClients');

describe('EnrollmentController', () => {
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
            headers: { authorization: 'Bearer token123' }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
    });

    describe('enroll', () => {
        test('should enroll student in courses successfully', async () => {
            const enrollData = {
                studentId: 1,
                courseIds: [1, 2],
                semester: 'Fall',
                academicYear: 2024
            };

            mockReq.body = enrollData;
            studentClient.getById.mockResolvedValue({ student_id: 1, student_number: 'STU001' });
            courseClient.getByIds.mockResolvedValue([{ course_id: 1 }, { course_id: 2 }]);
            Enrollment.enrollMany.mockResolvedValue([
                { courseId: 1, inserted: true },
                { courseId: 2, inserted: true }
            ]);

            await EnrollmentController.enroll(mockReq, mockRes, mockNext);

            expect(studentClient.getById).toHaveBeenCalledWith(1, 'token123');
            expect(courseClient.getByIds).toHaveBeenCalledWith([1, 2], 'token123');
            expect(Enrollment.enrollMany).toHaveBeenCalledWith(1, [1, 2], 'Fall', 2024);
            expect(auditClient.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        test('should return 400 if course IDs invalid', async () => {
            const enrollData = {
                studentId: 1,
                courseIds: [1, 999],
                semester: 'Fall',
                academicYear: 2024
            };

            mockReq.body = enrollData;
            studentClient.getById.mockResolvedValue({ student_id: 1 });
            courseClient.getByIds.mockResolvedValue([{ course_id: 1 }]);

            await EnrollmentController.enroll(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        test('should handle service errors', async () => {
            const enrollData = { studentId: 1, courseIds: [1], semester: 'Fall', academicYear: 2024 };
            const error = new Error('Service error');

            mockReq.body = enrollData;
            studentClient.getById.mockRejectedValue(error);

            await EnrollmentController.enroll(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getAllEnrollments', () => {
        test('should get all enrollments with pagination', async () => {
            mockReq.query = { page: 1, limit: 10 };
            Enrollment.findAll.mockResolvedValue({
                enrollments: [],
                totalCount: 0
            });

            await EnrollmentController.getAllEnrollments(mockReq, mockRes, mockNext);

            expect(Enrollment.findAll).toHaveBeenCalledWith(1, 10, expect.any(Object));
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should filter enrollments by studentId', async () => {
            mockReq.query = { page: 1, limit: 10, studentId: 1 };
            Enrollment.findAll.mockResolvedValue({ enrollments: [] });

            await EnrollmentController.getAllEnrollments(mockReq, mockRes, mockNext);

            expect(Enrollment.findAll).toHaveBeenCalledWith(1, 10, expect.objectContaining({
                studentId: 1
            }));
        });

        test('should filter enrollments by status', async () => {
            mockReq.query = { page: 1, limit: 10, status: 'completed' };
            Enrollment.findAll.mockResolvedValue({ enrollments: [] });

            await EnrollmentController.getAllEnrollments(mockReq, mockRes, mockNext);

            expect(Enrollment.findAll).toHaveBeenCalledWith(1, 10, expect.objectContaining({
                status: 'completed'
            }));
        });
    });

    describe('getStudentHistory', () => {
        test('should get student enrollment history', async () => {
            mockReq.params = { studentId: 1 };
            Enrollment.findByStudent.mockResolvedValue([
                { enrollment_id: 1, course_id: 1, semester: 'Fall', academic_year: 2024 }
            ]);
            studentClient.getById.mockResolvedValue({ student_id: 1 });
            courseClient.getByIds.mockResolvedValue([{ course_id: 1, course_name: 'Math 101' }]);

            await EnrollmentController.getStudentHistory(mockReq, mockRes, mockNext);

            expect(Enrollment.findByStudent).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should handle missing students', async () => {
            mockReq.params = { studentId: 999 };
            studentClient.getById.mockRejectedValue(new Error('Not found'));

            await EnrollmentController.getStudentHistory(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('getEnrollmentById', () => {
        test('should get enrollment by ID', async () => {
            mockReq.params = { id: 1 };
            Enrollment.findById.mockResolvedValue({
                enrollment_id: 1, student_id: 1, status: 'enrolled'
            });

            await EnrollmentController.getEnrollmentById(mockReq, mockRes, mockNext);

            expect(Enrollment.findById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should return 404 if enrollment not found', async () => {
            mockReq.params = { id: 999 };
            Enrollment.findById.mockResolvedValue(null);

            await EnrollmentController.getEnrollmentById(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('updateStatus', () => {
        test('should update enrollment status', async () => {
            mockReq.params = { id: 1 };
            mockReq.body = { status: 'completed' };
            Enrollment.findById.mockResolvedValue({ enrollment_id: 1 });
            Enrollment.updateStatus.mockResolvedValue({ enrollment_id: 1, status: 'completed' });

            await EnrollmentController.updateStatus(mockReq, mockRes, mockNext);

            expect(Enrollment.findById).toHaveBeenCalledWith(1);
            expect(Enrollment.updateStatus).toHaveBeenCalledWith(1, 'completed');
        });

        test('should return 404 if enrollment not found for update', async () => {
            mockReq.params = { id: 999 };
            mockReq.body = { status: 'completed' };
            Enrollment.findById.mockResolvedValue(null);

            await EnrollmentController.updateStatus(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });
});
