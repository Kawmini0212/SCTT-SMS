const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Service API',
            version: '1.0.0',
            description: 'Student management microservice for Student Management System',
            contact: {
                name: 'API Support',
                email: 'admin@kdu.ac.lk'
            }
        },
        servers: [
            {
                url: 'http://localhost:5002',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token from Auth Service login'
                }
            },
            schemas: {
                Student: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'address', 'birthday', 'idNumber', 'degreeProgramId'],
                    properties: {
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        address: { type: 'string', example: '123 Main St, Colombo' },
                        birthday: { type: 'string', format: 'date', example: '2002-05-15' },
                        idNumber: { type: 'string', example: '200212345678' },
                        degreeProgramId: { type: 'integer', example: 1 }
                    }
                },
                StudentResponse: {
                    type: 'object',
                    properties: {
                        student_id: { type: 'integer' },
                        student_number: { type: 'string', example: 'STU2026001' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        address: { type: 'string' },
                        birthday: { type: 'string', format: 'date' },
                        id_number: { type: 'string' },
                        degree_program_id: { type: 'integer' },
                        program_name: { type: 'string' },
                        program_code: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                DegreeProgram: {
                    type: 'object',
                    required: ['programName', 'programCode', 'durationYears'],
                    properties: {
                        programName: { type: 'string', example: 'Bachelor of Software Engineering' },
                        programCode: { type: 'string', example: 'BSE' },
                        durationYears: { type: 'integer', example: 4 }
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
                        message: { type: 'string' },
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
                name: 'Students',
                description: 'Student management endpoints'
            },
            {
                name: 'Degree Programs',
                description: 'Degree program management endpoints'
            }
        ],
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
