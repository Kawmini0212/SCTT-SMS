const db = require('../config/database');

class Enrollment {
    // ── Enroll a student in multiple courses for a semester ──────────────────
    static async enrollMany(studentId, courseIds, semester, academicYear) {
        const results = [];
        for (const courseId of courseIds) {
            const [result] = await db.execute(
                `INSERT IGNORE INTO enrollments
           (student_id, course_id, semester, academic_year, status)
         VALUES (?, ?, ?, ?, 'enrolled')`,
                [studentId, courseId, semester, academicYear]
            );
            results.push({ courseId, enrollmentId: result.insertId, inserted: result.affectedRows > 0 });
        }
        return results;
    }

    // ── Find a single enrollment by ID ───────────────────────────────────────
    static async findById(enrollmentId) {
        const [rows] = await db.execute(
            'SELECT * FROM enrollments WHERE enrollment_id = ?',
            [enrollmentId]
        );
        return rows[0];
    }

    // ── Get all enrollments for a student (full history) ─────────────────────
    static async findByStudent(studentId) {
        const [rows] = await db.execute(
            `SELECT * FROM enrollments
       WHERE student_id = ?
       ORDER BY academic_year DESC, semester ASC, enrolled_at DESC`,
            [studentId]
        );
        return rows;
    }

    // ── Get enrollments for a student in a specific semester+year ────────────
    static async findByStudentAndSemester(studentId, semester, academicYear) {
        const [rows] = await db.execute(
            `SELECT * FROM enrollments
       WHERE student_id = ? AND semester = ? AND academic_year = ?
       ORDER BY course_id ASC`,
            [studentId, semester, academicYear]
        );
        return rows;
    }

    // ── Get all enrollments for a course ─────────────────────────────────────
    static async findByCourse(courseId) {
        const [rows] = await db.execute(
            `SELECT * FROM enrollments
       WHERE course_id = ?
       ORDER BY academic_year DESC, semester ASC`,
            [courseId]
        );
        return rows;
    }

    // ── Update status of a single enrollment ─────────────────────────────────
    static async updateStatus(enrollmentId, status) {
        const completedAt = status === 'completed' ? new Date() : null;
        const [result] = await db.execute(
            `UPDATE enrollments
       SET status = ?, completed_at = ?
       WHERE enrollment_id = ?`,
            [status, completedAt, enrollmentId]
        );
        return result.affectedRows > 0;
    }

    // ── Replace all enrollments for a student in a semester ──────────────────
    // Drops removed courses, adds new ones (preserves existing if unchanged)
    static async replaceSemesterEnrollments(studentId, semester, academicYear, newCourseIds) {
        // Get current enrolled course IDs
        const [current] = await db.execute(
            `SELECT course_id FROM enrollments
       WHERE student_id = ? AND semester = ? AND academic_year = ? AND status = 'enrolled'`,
            [studentId, semester, academicYear]
        );
        const currentIds = current.map(r => r.course_id);
        const toAdd = newCourseIds.filter(id => !currentIds.includes(id));
        const toRemove = currentIds.filter(id => !newCourseIds.includes(id));

        // Drop removed
        for (const courseId of toRemove) {
            await db.execute(
                `UPDATE enrollments SET status = 'dropped'
         WHERE student_id = ? AND course_id = ? AND semester = ? AND academic_year = ?`,
                [studentId, courseId, semester, academicYear]
            );
        }
        // Add new
        for (const courseId of toAdd) {
            await db.execute(
                `INSERT IGNORE INTO enrollments
           (student_id, course_id, semester, academic_year, status)
         VALUES (?, ?, ?, ?, 'enrolled')`,
                [studentId, courseId, semester, academicYear]
            );
        }
        return { added: toAdd, dropped: toRemove };
    }

    // ── Delete a single enrollment ────────────────────────────────────────────
    static async delete(enrollmentId) {
        const [result] = await db.execute(
            'DELETE FROM enrollments WHERE enrollment_id = ?',
            [enrollmentId]
        );
        return result.affectedRows > 0;
    }

    // ── Paginated list of all enrollments (admin view) ───────────────────────
    static async findAll(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const conditions = [];
        const params = [];

        if (filters.studentId) { conditions.push('student_id = ?'); params.push(filters.studentId); }
        if (filters.courseId) { conditions.push('course_id = ?'); params.push(filters.courseId); }
        if (filters.semester) { conditions.push('semester = ?'); params.push(filters.semester); }
        if (filters.academicYear) { conditions.push('academic_year = ?'); params.push(filters.academicYear); }
        if (filters.status) { conditions.push('status = ?'); params.push(filters.status); }

        const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

        const [rows] = await db.execute(
            `SELECT * FROM enrollments ${where}
       ORDER BY academic_year DESC, enrolled_at DESC
       LIMIT ${Math.abs(Number(limit))} OFFSET ${Math.abs(Number(offset))}`,
            params
        );
        const [[countRow]] = await db.execute(
            `SELECT COUNT(*) as total FROM enrollments ${where}`,
            params
        );

        return {
            enrollments: rows,
            total: countRow.total,
            page,
            totalPages: Math.ceil(countRow.total / limit)
        };
    }
}

module.exports = Enrollment;
