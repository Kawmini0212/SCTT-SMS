const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Enrollment Service API',
            version: '1.0.0',
            description: 'Student enrollment microservice for SMS — handles course enrollments and course history per semester.',
            contact: { name: 'API Support', email: 'admin@kdu.ac.lk' }
        },
        servers: [{ url: 'http://localhost:5004', description: 'Development server' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http', scheme: 'bearer', bearerFormat: 'JWT',
                    description: 'JWT token from Auth Service login'
                }
            },
            schemas: {
                EnrollRequest: {
                    type: 'object',
                    required: ['studentId', 'courseIds', 'semester', 'academicYear'],
                    properties: {
                        studentId: { type: 'integer', example: 1 },
                        courseIds: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3] },
                        semester: { type: 'string', example: 'Semester 1' },
                        academicYear: { type: 'integer', example: 2026 }
                    }
                },
                UpdateEnrollment: {
                    type: 'object',
                    required: ['courseIds'],
                    properties: {
                        courseIds: {
                            type: 'array', items: { type: 'integer' }, example: [2, 4],
                            description: 'Full replacement list of course IDs for the given semester'
                        }
                    }
                },
                UpdateStatus: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['enrolled', 'completed', 'dropped', 'failed'],
                            example: 'completed'
                        }
                    }
                },
                EnrollmentRecord: {
                    type: 'object',
                    properties: {
                        enrollment_id: { type: 'integer' },
                        student_id: { type: 'integer' },
                        course_id: { type: 'integer' },
                        semester: { type: 'string' },
                        academic_year: { type: 'integer' },
                        status: { type: 'string', enum: ['enrolled', 'completed', 'dropped', 'failed'] },
                        enrolled_at: { type: 'string', format: 'date-time' },
                        completed_at: { type: 'string', format: 'date-time', nullable: true }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' }
                    }
                }
            }
        },
        tags: [
            { name: 'Enrollments', description: 'Enrollment management' },
            { name: 'History', description: 'Course history tracking' }
        ],
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
