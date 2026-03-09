const db = require('../config/database');

class DegreeProgram {
    // Get all degree programs
    static async findAll() {
        const [rows] = await db.execute(
            'SELECT * FROM degree_programs ORDER BY program_name'
        );
        return rows;
    }

    // Find by ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM degree_programs WHERE degree_program_id = ?',
            [id]
        );
        return rows[0];
    }

    // Find by program code
    static async findByCode(code) {
        const [rows] = await db.execute(
            'SELECT * FROM degree_programs WHERE program_code = ?',
            [code]
        );
        return rows[0];
    }

    // Create new degree program
    static async create(data) {
        const { programName, programCode, durationYears } = data;

        const [result] = await db.execute(
            `INSERT INTO degree_programs (program_name, program_code, duration_years)
       VALUES (?, ?, ?)`,
            [programName, programCode, durationYears]
        );

        return { degreeProgramId: result.insertId };
    }

    // Update degree program
    static async update(id, data) {
        const { programName, programCode, durationYears } = data;

        const [result] = await db.execute(
            `UPDATE degree_programs 
       SET program_name = ?, program_code = ?, duration_years = ?
       WHERE degree_program_id = ?`,
            [programName, programCode, durationYears, id]
        );

        return result.affectedRows > 0;
    }

    // Delete degree program
    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM degree_programs WHERE degree_program_id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = DegreeProgram;
