const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Audit Service API',
            version: '1.0.0',
            description: 'Audit log microservice for SMS — records all administrative actions across services and provides rich query/filter endpoints.',
            contact: { name: 'API Support', email: 'admin@kdu.ac.lk' }
        },
        servers: [{ url: 'http://localhost:5005', description: 'Development server' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http', scheme: 'bearer', bearerFormat: 'JWT',
                    description: 'JWT token from Auth Service login'
                }
            },
            schemas: {
                CreateAuditLog: {
                    type: 'object',
                    required: ['adminId', 'serviceName', 'actionType'],
                    properties: {
                        adminId: { type: 'integer', example: 1, description: 'ID of the admin performing the action' },
                        studentId: { type: 'integer', example: 5, nullable: true, description: 'Affected student ID (optional)' },
                        serviceName: { type: 'string', example: 'enrollment-service', description: 'Name of the calling microservice' },
                        actionType: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT'], example: 'CREATE' },
                        actionDetails: { type: 'string', example: 'Enrolled student KDU2025001 in 3 courses', description: 'Human-readable summary' },
                        oldValues: { type: 'string', description: 'JSON string of previous state (for UPDATE/DELETE)', nullable: true },
                        newValues: { type: 'string', description: 'JSON string of new state (for CREATE/UPDATE)', nullable: true },
                        ipAddress: { type: 'string', example: '127.0.0.1', nullable: true }
                    }
                },
                AuditLog: {
                    type: 'object',
                    properties: {
                        log_id: { type: 'integer' },
                        admin_id: { type: 'integer' },
                        student_id: { type: 'integer', nullable: true },
                        service_name: { type: 'string' },
                        action_type: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT'] },
                        action_details: { type: 'string', nullable: true },
                        old_values: { type: 'object', nullable: true },
                        new_values: { type: 'object', nullable: true },
                        ip_address: { type: 'string', nullable: true },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                AuditLogStats: {
                    type: 'object',
                    properties: {
                        byActionType: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    action_type: { type: 'string' },
                                    count: { type: 'integer' }
                                }
                            }
                        },
                        byService: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    service_name: { type: 'string' },
                                    count: { type: 'integer' }
                                }
                            }
                        },
                        last7Days: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    date: { type: 'string', format: 'date' },
                                    count: { type: 'integer' }
                                }
                            }
                        },
                        total: { type: 'integer' }
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
            { name: 'Audit Logs', description: 'Audit log ingest and query' },
            { name: 'Stats', description: 'Aggregate statistics' }
        ]
    },
    apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
