const axios = require('axios');

const AUDIT_SERVICE_URL = process.env.AUDIT_SERVICE_URL || 'http://localhost:5005';

class AuditClient {
    async log(logData) {
        try {
            await axios.post(`${AUDIT_SERVICE_URL}/api/audit-logs`, logData, {
                timeout: 5000
            });
        } catch (error) {
            // Non-blocking — audit failure should never break a course operation
            console.error('Failed to send audit log:', error.message);
        }
    }
}

module.exports = new AuditClient();
