const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth Service API',
            version: '1.0.0',
            description: 'Authentication microservice for Student Management System',
            contact: {
                name: 'API Support',
                email: 'admin@kdu.ac.lk'
            }
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Login: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            example: 'admin'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'admin123'
                        }
                    }
                },
                Register: {
                    type: 'object',
                    required: ['username', 'email', 'password', 'fullName'],
                    properties: {
                        username: {
                            type: 'string',
                            example: 'newadmin'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'newadmin@kdu.ac.lk'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'password123'
                        },
                        fullName: {
                            type: 'string',
                            example: 'John Doe'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                },
                                admin: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', example: 1 },
                                        username: { type: 'string', example: 'admin' },
                                        email: { type: 'string', example: 'admin@kdu.ac.lk' },
                                        fullName: { type: 'string', example: 'System Administrator' }
                                    }
                                }
                            }
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        },
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
                name: 'Authentication',
                description: 'Authentication endpoints'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
