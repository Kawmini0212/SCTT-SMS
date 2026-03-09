const mysql = require('mysql2/promise');

async function updateAdminPassword() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'Kawmini',
            database: 'auth_db'
        });

        // Update admin password with correct hash for 'admin123'
        const correctHash = '$2a$10$g5j2T9B/9s/IAVzq0RXzFOy1Y/NjFsH.Q07Qjj4o1PQfQQNLI23gG';

        await connection.query(
            'UPDATE administrators SET password_hash = ? WHERE username = ?',
            [correctHash, 'admin']
        );

        console.log('✅ Admin password updated successfully!');
        console.log('   Username: admin');
        console.log('   Password: admin123');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateAdminPassword();
