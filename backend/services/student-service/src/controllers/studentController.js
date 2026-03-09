const Student = require('../models/Student');
const auditClient = require('../utils/auditClient');

class StudentController {
    // Create new student
    async createStudent(req, res, next) {
        try {
            const studentData = req.body;

            // Check if ID number already exists
            const existingStudent = await Student.findByIdNumber(studentData.idNumber);
            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    message: 'Student with this ID number already exists'
                });
            }

            const result = await Student.create(studentData);

            // Log the action
            await auditClient.log({
                adminId: req.user.adminId,
                studentId: result.studentId,
                serviceName: 'student-service',
                actionType: 'CREATE',
                actionDetails: 'Created new student',
                newValues: JSON.stringify(studentData),
                ipAddress: req.ip
            });

            res.status(201).json({
                success: true,
                message: 'Student created successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all students
    async getAllStudents(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const result = await Student.findAll(parseInt(page), parseInt(limit), search);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // Get student by ID
    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await Student.findById(id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Log the view action
            await auditClient.log({
                adminId: req.user.adminId,
                studentId: parseInt(id),
                serviceName: 'student-service',
                actionType: 'VIEW',
                actionDetails: 'Viewed student details',
                ipAddress: req.ip
            });

            res.json({
                success: true,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    // Get students by IDs (used by Enrollment Service)
    async getStudentsByIds(req, res, next) {
        try {
            const { ids } = req.query;
            if (!ids) {
                return res.status(400).json({ success: false, message: 'ids query param required' });
            }

            const idArray = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            const students = await Student.findByIds(idArray);

            res.json({ success: true, data: students });
        } catch (error) {
            next(error);
        }
    }

    // Update student
    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const studentData = req.body;

            const existingStudent = await Student.findById(id);
            if (!existingStudent) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const updated = await Student.update(id, studentData);

            if (updated) {
                //  Log the update
                await auditClient.log({
                    adminId: req.user.adminId,
                    studentId: parseInt(id),
                    serviceName: 'student-service',
                    actionType: 'UPDATE',
                    actionDetails: 'Updated student details',
                    oldValues: JSON.stringify(existingStudent),
                    newValues: JSON.stringify(studentData),
                    ipAddress: req.ip
                });

                res.json({
                    success: true,
                    message: 'Student updated successfully'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update student'
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // Delete student
    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;

            const student = await Student.findById(id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const deleted = await Student.delete(id);

            if (deleted) {
                // Log the deletion
                await auditClient.log({
                    adminId: req.user.adminId,
                    studentId: parseInt(id),
                    serviceName: 'student-service',
                    actionType: 'DELETE',
                    actionDetails: 'Deleted student',
                    oldValues: JSON.stringify(student),
                    ipAddress: req.ip
                });

                res.json({
                    success: true,
                    message: 'Student deleted successfully'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete student'
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();
