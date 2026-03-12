const Course = require('../models/Course');
const auditClient = require('../utils/auditClient');

class CourseController {
    // GET /api/courses
    async getAllCourses(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '', semester = '' } = req.query;
            const result = await Course.findAll(
                parseInt(page),
                parseInt(limit),
                search,
                semester
            );
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/courses/:id
    async getCourseById(req, res, next) {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            res.json({ success: true, data: course });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/courses/by-ids  (used by Enrollment Service)
    async getCoursesByIds(req, res, next) {
        try {
            const { ids } = req.query;
            if (!ids) {
                return res.status(400).json({ success: false, message: 'ids query param required' });
            }

            const idArray = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            const courses = await Course.findByIds(idArray);

            res.json({ success: true, data: courses });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/courses/semesters
    async getSemesters(req, res, next) {
        try {
            const semesters = await Course.getDistinctSemesters();
            res.json({ success: true, data: semesters });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/courses
    async createCourse(req, res, next) {
        try {
            const data = req.body;

            // Check for duplicate course code
            const existing = await Course.findByCode(data.courseCode);
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'A course with this code already exists'
                });
            }

            const result = await Course.create(data);

            await auditClient.log({
                adminId: req.user.adminId,
                studentId: null,
                serviceName: 'course-service',
                actionType: 'CREATE',
                actionDetails: `Created course: ${data.courseCode} - ${data.courseName}`,
                newValues: JSON.stringify(data),
                ipAddress: req.ip
            });

            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/courses/:id
    async updateCourse(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;

            const existing = await Course.findById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            const updated = await Course.update(id, data);
            if (!updated) {
                return res.status(500).json({ success: false, message: 'Failed to update course' });
            }

            await auditClient.log({
                adminId: req.user.adminId,
                studentId: null,
                serviceName: 'course-service',
                actionType: 'UPDATE',
                actionDetails: `Updated course ID: ${id}`,
                oldValues: JSON.stringify(existing),
                newValues: JSON.stringify(data),
                ipAddress: req.ip
            });

            res.json({ success: true, message: 'Course updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/courses/:id
    async deleteCourse(req, res, next) {
        try {
            const { id } = req.params;

            const existing = await Course.findById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            const deleted = await Course.delete(id);
            if (!deleted) {
                return res.status(500).json({ success: false, message: 'Failed to delete course' });
            }

            await auditClient.log({
                adminId: req.user.adminId,
                studentId: null,
                serviceName: 'course-service',
                actionType: 'DELETE',
                actionDetails: `Deleted course: ${existing.course_code} - ${existing.course_name}`,
                oldValues: JSON.stringify(existing),
                ipAddress: req.ip
            });

            res.json({ success: true, message: 'Course deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseController();
