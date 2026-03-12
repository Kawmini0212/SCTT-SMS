const db = require('../config/database');

class Course {
    // Create a new course
    static async create(data) {
        const { courseCode, courseName, credits, semester, year } = data;
        const [result] = await db.execute(
            `INSERT INTO courses (course_code, course_name, credits, semester, year)
       VALUES (?, ?, ?, ?, ?)`,
            [courseCode, courseName, credits, semester || null, year || null]
        );
        return { courseId: result.insertId };
    }

    // Find course by ID
    static async findById(courseId) {
        const [rows] = await db.execute(
            'SELECT * FROM courses WHERE course_id = ?',
            [courseId]
        );
        return rows[0];
    }

    // Find course by code
    static async findByCode(courseCode) {
        const [rows] = await db.execute(
            'SELECT * FROM courses WHERE course_code = ?',
            [courseCode]
        );
        return rows[0];
    }

    // Get all courses with pagination and search
    static async findAll(page = 1, limit = 10, searchTerm = '', semester = '') {
        const offset = (page - 1) * limit;
        let conditions = [];
        let params = [];

        if (searchTerm) {
            conditions.push('(course_code LIKE ? OR course_name LIKE ?)');
            params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
        if (semester) {
            conditions.push('semester = ?');
            params.push(semester);
        }

        const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

        const [rows] = await db.execute(
            `SELECT * FROM courses ${whereClause} ORDER BY course_code ASC LIMIT ${Math.abs(Number(limit))} OFFSET ${Math.abs(Number(offset))}`,
            params
        );
        const [[countRow]] = await db.execute(
            `SELECT COUNT(*) as total FROM courses ${whereClause}`,
            params
        );

        return {
            courses: rows,
            total: countRow.total,
            page,
            totalPages: Math.ceil(countRow.total / limit)
        };
    }

    // Get courses by IDs (used by Enrollment Service)
    static async findByIds(ids) {
        if (!ids || ids.length === 0) return [];
        const placeholders = ids.map(() => '?').join(',');
        const [rows] = await db.execute(
            `SELECT * FROM courses WHERE course_id IN (${placeholders})`,
            ids
        );
        return rows;
    }

    // Update course
    static async update(courseId, data) {
        const { courseName, credits, semester, year } = data;
        const [result] = await db.execute(
            `UPDATE courses
       SET course_name = ?, credits = ?, semester = ?, year = ?
       WHERE course_id = ?`,
            [courseName, credits, semester || null, year || null, courseId]
        );
        return result.affectedRows > 0;
    }

    // Delete course
    static async delete(courseId) {
        const [result] = await db.execute(
            'DELETE FROM courses WHERE course_id = ?',
            [courseId]
        );
        return result.affectedRows > 0;
    }

    // Get distinct semesters (useful for filter dropdowns)
    static async getDistinctSemesters() {
        const [rows] = await db.execute(
            'SELECT DISTINCT semester FROM courses WHERE semester IS NOT NULL ORDER BY semester'
        );
        return rows.map(r => r.semester);
    }
}

module.exports = Course;
