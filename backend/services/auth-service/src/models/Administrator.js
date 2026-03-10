const db = require('../config/database');

class Administrator {
    // Find administrator by username
    static async findByUsername(username) {
        const [rows] = await db.execute(
            'SELECT * FROM administrators WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    // Find administrator by ID
    static async findById(adminId) {
        const [rows] = await db.execute(
            'SELECT admin_id, username, email, full_name, is_active, created_at, last_login FROM administrators WHERE admin_id = ?',
            [adminId]
        );
        return rows[0];
    }

    // Find administrator by email
    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM administrators WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Update last login timestamp
    static async updateLastLogin(adminId) {
        const [result] = await db.execute(
            'UPDATE administrators SET last_login = NOW() WHERE admin_id = ?',
            [adminId]
        );
        return result.affectedRows > 0;
    }

    // Create new administrator
    static async create(adminData) {
        const { username, email, passwordHash, fullName } = adminData;

        const [result] = await db.execute(
            `INSERT INTO administrators (username, email, password_hash, full_name)
       VALUES (?, ?, ?, ?)`,
            [username, email, passwordHash, fullName]
        );

        return { adminId: result.insertId };
    }

    // Update administrator
    static async update(adminId, adminData) {
        const { fullName, email, isActive } = adminData;

        const [result] = await db.execute(
            `UPDATE administrators 
       SET full_name = ?, email = ?, is_active = ?
       WHERE admin_id = ?`,
            [fullName, email, isActive, adminId]
        );

        return result.affectedRows > 0;
    }

    // Update password
    static async updatePassword(adminId, passwordHash) {
        const [result] = await db.execute(
            'UPDATE administrators SET password_hash = ? WHERE admin_id = ?',
            [passwordHash, adminId]
        );
        return result.affectedRows > 0;
    }

    // Get all administrators
    static async findAll() {
        const [rows] = await db.execute(
            'SELECT admin_id, username, email, full_name, is_active, created_at, last_login FROM administrators ORDER BY created_at DESC'
        );
        return rows;
    }
}

module.exports = Administrator;
