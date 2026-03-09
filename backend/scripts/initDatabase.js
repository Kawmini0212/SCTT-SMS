const mysql = require('mysql2/promise');

async function initializeDatabase() {
    let connection;

    try {
        console.log('🔄 Connecting to MySQL...');

        // Connect without specifying a database
        connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'root',
            multipleStatements: true
        });

        console.log('✓ Connected to MySQL successfully\n');

        // Create databases
        console.log('📦 Creating databases...');
        await connection.query('CREATE DATABASE IF NOT EXISTS auth_db');
        await connection.query('CREATE DATABASE IF NOT EXISTS student_db');
        await connection.query('CREATE DATABASE IF NOT EXISTS course_db');
        await connection.query('CREATE DATABASE IF NOT EXISTS enrollment_db');
        await connection.query('CREATE DATABASE IF NOT EXISTS audit_db');
        console.log('✓ Databases created\n');

        // AUTH DATABASE
        console.log('📝 Setting up auth_db...');
        await connection.query('USE auth_db');
        await connection.query('DROP TABLE IF EXISTS administrators');
        await connection.query(`
      CREATE TABLE administrators (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB
    `);

        // Insert default admin (password: admin123)
        await connection.query(`
      INSERT INTO administrators (username, email, password_hash, full_name) VALUES
      ('admin', 'admin@kdu.ac.lk', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator')
    `);
        console.log('✓ auth_db setup complete (1 admin user created)\n');

        // STUDENT DATABASE
        console.log('📝 Setting up student_db...');
        await connection.query('USE student_db');
        await connection.query('DROP TABLE IF EXISTS students');
        await connection.query('DROP TABLE IF EXISTS degree_programs');

        await connection.query(`
      CREATE TABLE degree_programs (
        degree_program_id INT AUTO_INCREMENT PRIMARY KEY,
        program_name VARCHAR(255) NOT NULL,
        program_code VARCHAR(50) UNIQUE NOT NULL,
        duration_years INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_program_code (program_code)
      ) ENGINE=InnoDB
    `);

        await connection.query(`
      CREATE TABLE students (
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        student_number VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        address TEXT,
        birthday DATE NOT NULL,
        id_number VARCHAR(50) UNIQUE NOT NULL,
        degree_program_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_student_number (student_number),
        INDEX idx_id_number (id_number),
        INDEX idx_degree_program (degree_program_id)
      ) ENGINE=InnoDB
    `);

        // Insert sample degree programs
        await connection.query(`
      INSERT INTO degree_programs (program_name, program_code, duration_years) VALUES
      ('Bachelor of Software Engineering', 'BSE', 4),
      ('Bachelor of Computer Science', 'BCS', 4),
      ('Bachelor of Information Technology', 'BIT', 4),
      ('Bachelor of Data Science', 'BDS', 4)
    `);
        console.log('✓ student_db setup complete (4 degree programs created)\n');

        // COURSE DATABASE
        console.log('📝 Setting up course_db...');
        await connection.query('USE course_db');
        await connection.query('DROP TABLE IF EXISTS courses');

        await connection.query(`
      CREATE TABLE courses (
        course_id INT AUTO_INCREMENT PRIMARY KEY,
        course_code VARCHAR(50) UNIQUE NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        credits INT NOT NULL,
        semester VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_course_code (course_code)
      ) ENGINE=InnoDB
    `);

        // Insert sample courses
        await connection.query(`
      INSERT INTO courses (course_code, course_name, credits, semester) VALUES
      ('CS101', 'Introduction to Programming', 3, 'Semester 1'),
      ('CS102', 'Data Structures and Algorithms', 4, 'Semester 2'),
      ('CS201', 'Database Management Systems', 4, 'Semester 3'),
      ('CS202', 'Web Technologies', 3, 'Semester 4'),
      ('CS301', 'Software Engineering', 4, 'Semester 5'),
      ('CS302', 'Computer Networks', 3, 'Semester 6'),
      ('CS401', 'Artificial Intelligence', 4, 'Semester 7'),
      ('CS402', 'Cloud Computing', 3, 'Semester 8')
    `);
        console.log('✓ course_db setup complete (8 courses created)\n');

        // ENROLLMENT DATABASE
        console.log('📝 Setting up enrollment_db...');
        await connection.query('USE enrollment_db');
        await connection.query('DROP TABLE IF EXISTS enrollments');

        await connection.query(`
      CREATE TABLE enrollments (
        enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        semester VARCHAR(50) NOT NULL,
        academic_year INT NOT NULL,
        status ENUM('enrolled', 'completed', 'dropped', 'failed') DEFAULT 'enrolled',
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        INDEX idx_student_enrollment (student_id),
        INDEX idx_course_enrollment (course_id),
        INDEX idx_semester (semester, academic_year),
        UNIQUE KEY unique_enrollment (student_id, course_id, semester, academic_year)
      ) ENGINE=InnoDB
    `);
        console.log('✓ enrollment_db setup complete\n');

        // AUDIT DATABASE
        console.log('📝 Setting up audit_db...');
        await connection.query('USE audit_db');
        await connection.query('DROP TABLE IF EXISTS audit_logs');

        await connection.query(`
      CREATE TABLE audit_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        student_id INT NULL,
        service_name VARCHAR(100) NOT NULL,
        action_type ENUM('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT') NOT NULL,
        action_details TEXT,
        old_values JSON NULL,
        new_values JSON NULL,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_admin_logs (admin_id),
        INDEX idx_student_logs (student_id),
        INDEX idx_service (service_name),
        INDEX idx_action_type (action_type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB
    `);
        console.log('✓ audit_db setup complete\n');

        // Verify
        console.log('✅ All databases initialized successfully!\n');
        console.log('📊 Summary:');
        console.log('   - auth_db: 1 admin user (username: admin, password: admin123)');
        console.log('   - student_db: 4 degree programs, 0 students');
        console.log('   - course_db: 8 courses');
        console.log('   - enrollment_db: ready for enrollments');
        console.log('   - audit_db: ready for audit logs\n');

    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run initialization
initializeDatabase();
