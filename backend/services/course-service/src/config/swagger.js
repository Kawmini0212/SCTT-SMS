const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Course Service API',
            version: '1.0.0',
            description: 'Course management microservice for Student Management System (SMS)',
            contact: {
                name: 'API Support',
                email: 'admin@kdu.ac.lk'
            }
        },
        servers: [
            {
                url: 'http://localhost:5003',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from Auth Service login'
                }
            },
            schemas: {
                Course: {
                    type: 'object',
                    required: ['courseCode', 'courseName', 'credits'],
                    properties: {
                        courseCode: {
                            type: 'string',
                            example: 'CS501',
                            description: 'Unique course code (uppercase letters and numbers)'
                        },
                        courseName: {
                            type: 'string',
                            example: 'Advanced Software Engineering',
                            description: 'Full name of the course'
                        },
                        credits: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 10,
                            example: 4,
                            description: 'Number of credit hours'
                        },
                        semester: {
                            type: 'string',
                            example: 'Semester 5',
                            description: 'Semester in which the course is offered'
                        }
                    }
                },
                CourseResponse: {
                    type: 'object',
                    properties: {
                        course_id: { type: 'integer', example: 1 },
                        course_code: { type: 'string', example: 'CS101' },
                        course_name: { type: 'string', example: 'Introduction to Programming' },
                        credits: { type: 'integer', example: 3 },
                        semester: { type: 'string', example: 'Semester 1' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                PaginatedCourses: {
                    type: 'object',
                    properties: {
                        courses: {
                            type: 'array',
                            items: { '$ref': '#/components/schemas/CourseResponse' }
                        },
                        total: { type: 'integer', example: 8 },
                        page: { type: 'integer', example: 1 },
                        totalPages: { type: 'integer', example: 1 }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Courses',
                description: 'Course management operations'
            }
        ],
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
