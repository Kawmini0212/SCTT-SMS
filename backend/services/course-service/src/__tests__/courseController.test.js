const CourseController = require('../controllers/courseController');
const Course = require('../models/Course');
const auditClient = require('../utils/auditClient');

jest.mock('../models/Course');
jest.mock('../utils/auditClient');

describe('CourseController', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: { adminId: 1 },
            ip: '127.0.0.1'
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
    });

    describe('getAllCourses', () => {
        test('should get all courses with pagination', async () => {
            mockReq.query = { page: 1, limit: 10 };
            Course.findAll.mockResolvedValue({
                courses: [
                    { courseId: 1, courseName: 'Math 101', courseCode: 'MATH101' }
                ],
                totalCount: 1
            });

            await CourseController.getAllCourses(mockReq, mockRes, mockNext);

            expect(Course.findAll).toHaveBeenCalledWith(1, 10, '', '');
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should filter courses by search term', async () => {
            mockReq.query = { page: 1, limit: 10, search: 'Math' };
            Course.findAll.mockResolvedValue({ courses: [] });

            await CourseController.getAllCourses(mockReq, mockRes, mockNext);

            expect(Course.findAll).toHaveBeenCalledWith(1, 10, 'Math', '');
        });

        test('should filter courses by semester', async () => {
            mockReq.query = { page: 1, limit: 10, semester: 'Fall' };
            Course.findAll.mockResolvedValue({ courses: [] });

            await CourseController.getAllCourses(mockReq, mockRes, mockNext);

            expect(Course.findAll).toHaveBeenCalledWith(1, 10, '', 'Fall');
        });
    });

    describe('getCourseById', () => {
        test('should get course by ID successfully', async () => {
            mockReq.params = { id: 1 };
            Course.findById.mockResolvedValue({
                courseId: 1, courseName: 'Math 101'
            });

            await CourseController.getCourseById(mockReq, mockRes, mockNext);

            expect(Course.findById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should return 404 if course not found', async () => {
            mockReq.params = { id: 999 };
            Course.findById.mockResolvedValue(null);

            await CourseController.getCourseById(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getCoursesByIds', () => {
        test('should get courses by ID list', async () => {
            mockReq.query = { ids: '1,2' };
            Course.findByIds.mockResolvedValue([
                { courseId: 1 }, { courseId: 2 }
            ]);

            await CourseController.getCoursesByIds(mockReq, mockRes, mockNext);

            expect(Course.findByIds).toHaveBeenCalledWith([1, 2]);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        test('should return 400 if ids param missing', async () => {
            mockReq.query = {};

            await CourseController.getCoursesByIds(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        test('should filter invalid IDs', async () => {
            mockReq.query = { ids: '1,invalid,2' };
            Course.findByIds.mockResolvedValue([]);

            await CourseController.getCoursesByIds(mockReq, mockRes, mockNext);

            expect(Course.findByIds).toHaveBeenCalledWith([1, 2]);
        });
    });

    describe('getSemesters', () => {
        test('should get all distinct semesters', async () => {
            Course.getDistinctSemesters.mockResolvedValue(['Fall', 'Spring']);

            await CourseController.getSemesters(mockReq, mockRes, mockNext);

            expect(Course.getDistinctSemesters).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });
    });

    describe('createCourse', () => {
        test('should create a course successfully', async () => {
            const courseData = {
                courseName: 'Math 101',
                courseCode: 'MATH101',
                credits: 3
            };

            mockReq.body = courseData;
            Course.findByCode.mockResolvedValue(null);
            Course.create.mockResolvedValue({ courseId: 1, ...courseData });

            await CourseController.createCourse(mockReq, mockRes, mockNext);

            expect(Course.findByCode).toHaveBeenCalledWith(courseData.courseCode);
            expect(Course.create).toHaveBeenCalledWith(courseData);
            expect(auditClient.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        test('should return 400 if course code exists', async () => {
            mockReq.body = { courseName: 'Math 101', courseCode: 'MATH101' };
            Course.findByCode.mockResolvedValue({ courseId: 1 });

            await CourseController.createCourse(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateCourse', () => {
        test('should update course successfully', async () => {
            const courseData = { courseName: 'Advanced Math 101' };

            mockReq.params = { id: 1 };
            mockReq.body = courseData;
            Course.findById.mockResolvedValue({ courseId: 1 });
            Course.update.mockResolvedValue({ courseId: 1, ...courseData });

            await CourseController.updateCourse(mockReq, mockRes, mockNext);

            expect(Course.findById).toHaveBeenCalledWith(1);
            expect(Course.update).toHaveBeenCalledWith(1, courseData);
            expect(auditClient.log).toHaveBeenCalled();
        });

        test('should return 404 if course not found for update', async () => {
            mockReq.params = { id: 999 };
            mockReq.body = { courseName: 'Math 101' };
            Course.findById.mockResolvedValue(null);

            await CourseController.updateCourse(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });
});
