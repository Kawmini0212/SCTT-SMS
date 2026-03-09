-- Student Management System - Database Initialization Script
-- This creates all databases and tables for the microservices architecture

-- ============================================
-- CREATE DATABASES
-- ============================================

CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS student_db;
CREATE DATABASE IF NOT EXISTS course_db;
CREATE DATABASE IF NOT EXISTS enrollment_db;
CREATE DATABASE IF NOT EXISTS audit_db;

-- ============================================
-- AUTH DATABASE
-- ============================================

USE auth_db;

DROP TABLE IF EXISTS administrators;

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
) ENGINE=InnoDB;

-- Insert default admin user (password: admin123)
-- Password hash generated with bcrypt, 10 rounds
-- To generate new hash: node backend/scripts/generateHash.js
INSERT INTO administrators (username, email, password_hash, full_name) VALUES
('admin', 'admin@kdu.ac.lk', '$2a$10$g5j2T9B/9s/IAVzq0RXzFOy1Y/NjFsH.Q07Qjj4o1PQfQQNLI23gG', 'System Administrator');

-- ============================================
-- STUDENT DATABASE
-- ============================================

USE student_db;

DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS degree_programs;

CREATE TABLE degree_programs (
    degree_program_id INT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    program_code VARCHAR(50) UNIQUE NOT NULL,
    duration_years INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_program_code (program_code)
) ENGINE=InnoDB;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address TEXT,
    birthday DATE NOT NULL,
    id_number VARCHAR(50) UNIQUE NOT NULL,
    degree_program_id INT NOT NULL,
    current_year INT DEFAULT 1,
    current_semester VARCHAR(50) DEFAULT 'Semester 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_number (student_number),
    INDEX idx_id_number (id_number),
    INDEX idx_degree_program (degree_program_id)
) ENGINE=InnoDB;

-- Insert sample degree programs
INSERT INTO degree_programs (program_name, program_code, duration_years) VALUES
('Bachelor of Software Engineering', 'BSE', 4),
('Bachelor of Computer Science', 'BCS', 4),
('Bachelor of Information Technology', 'BIT', 4),
('Bachelor of Data Science', 'BDS', 4);

-- ============================================
-- COURSE DATABASE
-- ============================================

USE course_db;

DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    semester VARCHAR(50),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_course_code (course_code)
) ENGINE=InnoDB;

-- Insert sample courses
INSERT INTO courses (course_code, course_name, credits, semester, year) VALUES
('CS101', 'Introduction to Programming', 3, 'Semester 1', 1),
('CS102', 'Data Structures and Algorithms', 4, 'Semester 2', 1),
('CS201', 'Database Management Systems', 4, 'Semester 3', 2),
('CS202', 'Web Technologies', 3, 'Semester 4', 2),
('CS301', 'Software Engineering', 4, 'Semester 5', 3),
('CS302', 'Computer Networks', 3, 'Semester 6', 3),
('CS401', 'Artificial Intelligence', 4, 'Semester 7', 4),
('CS402', 'Cloud Computing', 3, 'Semester 8', 4);

-- ============================================
-- ENROLLMENT DATABASE
-- ============================================

USE enrollment_db;

DROP TABLE IF EXISTS enrollments;

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
) ENGINE=InnoDB;

-- ============================================
-- AUDIT DATABASE
-- ============================================

USE audit_db;

DROP TABLE IF EXISTS audit_logs;

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
) ENGINE=InnoDB;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show all databases
SHOW DATABASES;

-- Show table counts
SELECT 'auth_db' as database_name, COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'auth_db'
UNION ALL
SELECT 'student_db', COUNT(*) FROM information_schema.tables WHERE table_schema = 'student_db'
UNION ALL
SELECT 'course_db', COUNT(*) FROM information_schema.tables WHERE table_schema = 'course_db'
UNION ALL
SELECT 'enrollment_db', COUNT(*) FROM information_schema.tables WHERE table_schema = 'enrollment_db'
UNION ALL
SELECT 'audit_db', COUNT(*) FROM information_schema.tables WHERE table_schema = 'audit_db';
