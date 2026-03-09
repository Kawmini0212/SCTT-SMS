const db = require('../config/database');

class Student {
    // Create new student
    static async create(studentData) {
        const { firstName, lastName, address, birthday, idNumber, degreeProgramId, currentYear, currentSemester } = studentData;
        const studentNumber = await this.generateStudentNumber();

        const [result] = await db.execute(
            `INSERT INTO students (student_number, first_name, last_name, address, birthday, id_number, degree_program_id, current_year, current_semester)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [studentNumber, firstName, lastName, address, birthday, idNumber, degreeProgramId, currentYear || 1, currentSemester || 'Semester 1']
        );

        return { studentId: result.insertId, studentNumber };
    }

    // Find student by ID
    static async findById(studentId) {
        const [rows] = await db.execute(
            `SELECT s.*, dp.program_name, dp.program_code, dp.duration_years
       FROM students s
       LEFT JOIN degree_programs dp ON s.degree_program_id = dp.degree_program_id
       WHERE s.student_id = ?`,
            [studentId]
        );
        return rows[0];
    }

    // Find by student number
    static async findByStudentNumber(studentNumber) {
        const [rows] = await db.execute(
            `SELECT s.*, dp.program_name, dp.program_code
       FROM students s
       LEFT JOIN degree_programs dp ON s.degree_program_id = dp.degree_program_id
       WHERE s.student_number = ?`,
            [studentNumber]
        );
        return rows[0];
    }

    // Find by ID number
    static async findByIdNumber(idNumber) {
        const [rows] = await db.execute(
            'SELECT * FROM students WHERE id_number = ?',
            [idNumber]
        );
        return rows[0];
    }

    // Get all students with pagination and search
    static async findAll(page = 1, limit = 10, searchTerm = '') {
        // Ensure page and limit are integers
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        let baseQuery = `
      SELECT s.*, dp.program_name, dp.program_code
      FROM students s
      LEFT JOIN degree_programs dp ON s.degree_program_id = dp.degree_program_id
    `;
        let countQuery = 'SELECT COUNT(*) as total FROM students s';
        let searchParams = [];

        if (searchTerm) {
            const searchCondition = `
        WHERE s.student_number LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ? OR s.id_number LIKE ?
      `;
            baseQuery += searchCondition;
            countQuery += searchCondition;
            const searchPattern = `%${searchTerm}%`;
            searchParams = [searchPattern, searchPattern, searchPattern, searchPattern];
        }

        // Inline LIMIT/OFFSET as integers (mysql2 prepared statements don't accept
        // integer bindings for LIMIT/OFFSET via execute() in some versions)
        const dataQuery = baseQuery + ` ORDER BY s.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await db.execute(dataQuery, searchParams);
        const [countResult] = await db.execute(countQuery, searchParams);

        return {
            students: rows,
            total: countResult[0].total,
            page,
            totalPages: Math.ceil(countResult[0].total / limit)
        };
    }

    // Get students by IDs (used by Enrollment Service)
    static async findByIds(ids) {
        if (!ids || ids.length === 0) return [];
        const placeholders = ids.map(() => '?').join(',');
        const [rows] = await db.execute(
            `SELECT s.*, dp.program_name, dp.program_code
       FROM students s
       LEFT JOIN degree_programs dp ON s.degree_program_id = dp.degree_program_id
       WHERE s.student_id IN (${placeholders})`,
            ids
        );
        return rows;
    }


    // Update student
    static async update(studentId, studentData) {
        const { firstName, lastName, address, birthday, degreeProgramId, currentYear, currentSemester } = studentData;

        const [result] = await db.execute(
            `UPDATE students 
       SET first_name = ?, last_name = ?, address = ?, birthday = ?, degree_program_id = ?, current_year = ?, current_semester = ?
       WHERE student_id = ?`,
            [firstName, lastName, address, birthday, degreeProgramId, currentYear, currentSemester, studentId]
        );

        return result.affectedRows > 0;
    }

    // Delete student
    static async delete(studentId) {
        const [result] = await db.execute(
            'DELETE FROM students WHERE student_id = ?',
            [studentId]
        );
        return result.affectedRows > 0;
    }

    // Generate unique student number (e.g., STU2026001)
    static async generateStudentNumber() {
        const year = new Date().getFullYear();
        const [rows] = await db.execute(
            `SELECT student_number FROM students 
       WHERE student_number LIKE ? 
       ORDER BY student_number DESC LIMIT 1`,
            [`STU${year}%`]
        );

        if (rows.length === 0) {
            return `STU${year}001`;
        }

        const lastNumber = parseInt(rows[0].student_number.slice(-3));
        const newNumber = String(lastNumber + 1).padStart(3, '0');
        return `STU${year}${newNumber}`;
    }
}

module.exports = Student;
