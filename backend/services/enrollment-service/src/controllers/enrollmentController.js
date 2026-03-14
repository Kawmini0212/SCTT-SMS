const Enrollment = require('../models/Enrollment');
const { studentClient, courseClient, auditClient } = require('../utils/serviceClients');

class EnrollmentController {

    // ── POST /api/enrollments ─────────────────────────────────────────────────
    // Enroll a student in one or more courses for a specific semester
    async enroll(req, res, next) {
        try {
            const { studentId, courseIds, semester, academicYear } = req.body;
            const token = req.headers.authorization?.split(' ')[1];

            // 1. Verify student exists
            const student = await studentClient.getById(studentId, token);

            // 2. Verify all courses exist
            const courses = await courseClient.getByIds(courseIds, token);
            if (courses.length !== courseIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more course IDs are invalid'
                });
            }

            // 3. Enroll
            const results = await Enrollment.enrollMany(studentId, courseIds, semester, academicYear);
            const newlyEnrolled = results.filter(r => r.inserted);

            await auditClient.log({
                adminId: req.user.adminId,
                studentId,
                serviceName: 'enrollment-service',
                actionType: 'CREATE',
                actionDetails: `Enrolled student ${student.student_number} in ${newlyEnrolled.length} course(s) for ${semester} ${academicYear}`,
                newValues: JSON.stringify({ studentId, courseIds, semester, academicYear }),
                ipAddress: req.ip
            });

            res.status(201).json({
                success: true,
                message: `Student enrolled in ${newlyEnrolled.length} course(s)`,
                data: { results }
            });
        } catch (error) {
            next(error);
        }
    }

    // ── GET /api/enrollments ──────────────────────────────────────────────────
    // Paginated list with filters (admin view)
    async getAllEnrollments(req, res, next) {
        try {
            const { page = 1, limit = 10, studentId, courseId, semester, academicYear, status } = req.query;
            const token = req.headers.authorization?.split(' ')[1];
            
            const result = await Enrollment.findAll(parseInt(page), parseInt(limit), {
                studentId: studentId ? parseInt(studentId) : null,
                courseId: courseId ? parseInt(courseId) : null,
                semester,
                academicYear: academicYear ? parseInt(academicYear) : null,
                status
            });

            // Enrich with student and course details
            if (result.enrollments.length > 0) {
                const studentIds = [...new Set(result.enrollments.map(e => e.student_id))];
                const courseIds = [...new Set(result.enrollments.map(e => e.course_id))];

                // Fetch students and courses in parallel
                const [students, courses] = await Promise.all([
                    studentClient.getByIds(studentIds, token).catch(() => []),
                    courseClient.getByIds(courseIds, token).catch(() => [])
                ]);

                // Create maps for quick lookup
                const studentMap = Object.fromEntries(students.map(s => [s.student_id, s]));
                const courseMap = Object.fromEntries(courses.map(c => [c.course_id, c]));

                // Enrich each enrollment
                result.enrollments = result.enrollments.map(e => {
                    const student = studentMap[e.student_id];
                    const course = courseMap[e.course_id];
                    
                    return {
                        ...e,
                        student_name: student ? `${student.first_name} ${student.last_name}` : null,
                        student_number: student?.student_number || null,
                        course_name: course?.course_name || null,
                        course_code: course?.course_code || null
                    };
                });
            }

            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    // ── GET /api/enrollments/:id ──────────────────────────────────────────────
    async getEnrollmentById(req, res, next) {
        try {
            const enrollment = await Enrollment.findById(req.params.id);
            if (!enrollment) {
                return res.status(404).json({ success: false, message: 'Enrollment not found' });
            }
            res.json({ success: true, data: enrollment });
        } catch (error) {
            next(error);
        }
    }

    // ── GET /api/enrollments/student/:studentId ───────────────────────────────
    // Full course history for a student across all semesters
    async getStudentHistory(req, res, next) {
        try {
            const { studentId } = req.params;
            const token = req.headers.authorization?.split(' ')[1];

            // Verify student exists
            const student = await studentClient.getById(studentId, token);
            const enrollments = await Enrollment.findByStudent(studentId);

            // Enrich with course details
            const courseIds = [...new Set(enrollments.map(e => e.course_id))];
            let courseMap = {};
            if (courseIds.length > 0) {
                const courses = await courseClient.getByIds(courseIds, token);
                courseMap = Object.fromEntries(courses.map(c => [c.course_id, c]));
            }

            // Group by semester + academic_year
            const history = {};
            for (const e of enrollments) {
                const key = `${e.academic_year}_${e.semester}`;
                if (!history[key]) {
                    history[key] = {
                        semester: e.semester,
                        academicYear: e.academic_year,
                        courses: []
                    };
                }
                history[key].courses.push({
                    enrollmentId: e.enrollment_id,
                    courseId: e.course_id,
                    courseCode: courseMap[e.course_id]?.course_code || 'N/A',
                    courseName: courseMap[e.course_id]?.course_name || 'N/A',
                    credits: courseMap[e.course_id]?.credits || 0,
                    status: e.status,
                    enrolledAt: e.enrolled_at,
                    completedAt: e.completed_at,
                    updatedAt: e.updated_at
                });
            }

            res.json({
                success: true,
                data: {
                    student: {
                        id: student.student_id,
                        studentNumber: student.student_number,
                        name: `${student.first_name} ${student.last_name}`
                    },
                    history: Object.values(history)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // ── GET /api/enrollments/student/:studentId/semester ──────────────────────
    // Enrollments for a specific semester (used for "change courses" feature)
    async getStudentSemesterEnrollments(req, res, next) {
        try {
            const { studentId } = req.params;
            const { semester, academicYear } = req.query;
            const token = req.headers.authorization?.split(' ')[1];

            if (!semester || !academicYear) {
                return res.status(400).json({
                    success: false,
                    message: 'semester and academicYear query params are required'
                });
            }

            const enrollments = await Enrollment.findByStudentAndSemester(
                studentId, semester, parseInt(academicYear)
            );

            // Enrich with course details
            const courseIds = enrollments.map(e => e.course_id);
            let courseMap = {};
            if (courseIds.length > 0) {
                const courses = await courseClient.getByIds(courseIds, token);
                courseMap = Object.fromEntries(courses.map(c => [c.course_id, c]));
            }

            const enriched = enrollments.map(e => ({
                enrollmentId: e.enrollment_id,
                courseId: e.course_id,
                courseCode: courseMap[e.course_id]?.course_code || 'N/A',
                courseName: courseMap[e.course_id]?.course_name || 'N/A',
                credits: courseMap[e.course_id]?.credits || 0,
                status: e.status,
                enrolledAt: e.enrolled_at,
                completedAt: e.completed_at,
                updatedAt: e.updated_at
            }));

            res.json({ success: true, data: enriched });
        } catch (error) {
            next(error);
        }
    }

    // ── PUT /api/enrollments/student/:studentId/semester ──────────────────────
    // Change a student's courses for a given semester (SRS requirement)
    async updateSemesterCourses(req, res, next) {
        try {
            const { studentId } = req.params;
            const { semester, academicYear, courseIds } = req.body;
            const token = req.headers.authorization?.split(' ')[1];

            // Verify student
            const student = await studentClient.getById(studentId, token);

            // Verify all courses exist
            if (courseIds.length > 0) {
                const courses = await courseClient.getByIds(courseIds, token);
                if (courses.length !== courseIds.length) {
                    return res.status(400).json({ success: false, message: 'One or more course IDs are invalid' });
                }
            }

            const diff = await Enrollment.replaceSemesterEnrollments(
                studentId, semester, academicYear, courseIds
            );

            await auditClient.log({
                adminId: req.user.adminId,
                studentId: parseInt(studentId),
                serviceName: 'enrollment-service',
                actionType: 'UPDATE',
                actionDetails: `Changed courses for student ${student.student_number} — ${semester} ${academicYear}: +${diff.added.length} added, -${diff.dropped.length} dropped`,
                newValues: JSON.stringify({ courseIds, semester, academicYear }),
                ipAddress: req.ip
            });

            res.json({
                success: true,
                message: 'Semester courses updated successfully',
                data: diff
            });
        } catch (error) {
            next(error);
        }
    }

    // ── PATCH /api/enrollments/:id/status ─────────────────────────────────────
    // Mark an enrollment as completed / dropped / failed
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const enrollment = await Enrollment.findById(id);
            if (!enrollment) {
                return res.status(404).json({ success: false, message: 'Enrollment not found' });
            }

            await Enrollment.updateStatus(id, status);

            await auditClient.log({
                adminId: req.user.adminId,
                studentId: enrollment.student_id,
                serviceName: 'enrollment-service',
                actionType: 'UPDATE',
                actionDetails: `Updated enrollment #${id} status: ${enrollment.status} → ${status}`,
                oldValues: JSON.stringify({ status: enrollment.status }),
                newValues: JSON.stringify({ status }),
                ipAddress: req.ip
            });

            res.json({ success: true, message: `Enrollment status updated to '${status}'` });
        } catch (error) {
            next(error);
        }
    }

    // ── DELETE /api/enrollments/:id ───────────────────────────────────────────
    async deleteEnrollment(req, res, next) {
        try {
            const { id } = req.params;
            const enrollment = await Enrollment.findById(id);
            if (!enrollment) {
                return res.status(404).json({ success: false, message: 'Enrollment not found' });
            }

            await Enrollment.delete(id);

            await auditClient.log({
                adminId: req.user.adminId,
                studentId: enrollment.student_id,
                serviceName: 'enrollment-service',
                actionType: 'DELETE',
                actionDetails: `Deleted enrollment #${id}`,
                oldValues: JSON.stringify(enrollment),
                ipAddress: req.ip
            });

            res.json({ success: true, message: 'Enrollment deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EnrollmentController();
