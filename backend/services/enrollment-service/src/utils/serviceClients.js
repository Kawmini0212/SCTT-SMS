const axios = require('axios');

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:5002';
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || 'http://localhost:5003';
const AUDIT_SERVICE_URL = process.env.AUDIT_SERVICE_URL || 'http://localhost:5005';

// Helper: forward the calling admin's token 
function authHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Student Service client 
const studentClient = {
    async getById(studentId, token) {
        try {
            const res = await axios.get(
                `${STUDENT_SERVICE_URL}/api/students/${studentId}`,
                { headers: authHeader(token), timeout: 5000 }
            );
            return res.data.data;
        } catch (err) {
            throw new Error(`Student not found (id: ${studentId})`);
        }
    },
    
    async getByIds(studentIds, token) {
        try {
            const res = await axios.get(
                `${STUDENT_SERVICE_URL}/api/students/by-ids`,
                {
                    params: { ids: studentIds.join(',') },
                    headers: authHeader(token),
                    timeout: 5000
                }
            );
            return res.data.data; // array of student objects
        } catch (err) {
            console.error('Failed to fetch student details:', err.message);
            return []; // Return empty array instead of throwing
        }
    },

    async updateAcademicInfo(studentId, currentYear, currentSemester, token) {
        try {
            const res = await axios.put(
                `${STUDENT_SERVICE_URL}/api/students/${studentId}`,
                { currentYear, currentSemester },
                { headers: authHeader(token), timeout: 5000 }
            );
            return res.data.data;
        } catch (err) {
            console.error('Failed to update student academic info:', err.message);
            // Don't throw - enrollment should still succeed even if this fails
        }
    }
};

// Course Service client 
const courseClient = {
    async getByIds(courseIds, token) {
        try {
            const res = await axios.get(
                `${COURSE_SERVICE_URL}/api/courses/by-ids`,
                {
                    params: { ids: courseIds.join(',') },
                    headers: authHeader(token),
                    timeout: 5000
                }
            );
            return res.data.data; // array of course objects
        } catch (err) {
            throw new Error('Failed to fetch course details');
        }
    }
};

// Audit Service client 
const auditClient = {
    async log(logData) {
        try {
            await axios.post(`${AUDIT_SERVICE_URL}/api/audit-logs`, logData, { timeout: 5000 });
        } catch (err) {
            console.error('Failed to send audit log:', err.message);
        }
    }
};

module.exports = { studentClient, courseClient, auditClient };
