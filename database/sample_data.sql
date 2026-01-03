-- Sample Data for EduMat Database
-- Run this after creating the schema

USE edumat_db;

-- Insert roles
INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- Insert subjects
INSERT INTO subjects (name, description, department) VALUES
('Mathematics', 'Mathematics and related topics', 'Mathematics'),
('Physics', 'Physics and related topics', 'Physics'),
('Chemistry', 'Chemistry and related topics', 'Chemistry'),
('Computer Science', 'Computer Science and programming', 'Computer Science'),
('Electrical Engineering', 'Electrical Engineering topics', 'Engineering'),
('Mechanical Engineering', 'Mechanical Engineering topics', 'Engineering'),
('Civil Engineering', 'Civil Engineering topics', 'Engineering'),
('Biology', 'Biology and life sciences', 'Biology'),
('English', 'English language and literature', 'English'),
('History', 'History and historical studies', 'History'),
('Economics', 'Economics and financial studies', 'Economics'),
('Psychology', 'Psychology and mental health', 'Psychology');

-- Insert sample users (passwords are BCrypt encoded for "password123")
-- Admin user
INSERT INTO users (username, email, password, first_name, last_name, department, semester) VALUES
('admin', 'admin@edumat.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'Administration', NULL);

-- Get admin user ID for role assignment
SET @admin_id = LAST_INSERT_ID();

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES
(@admin_id, (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')),
(@admin_id, (SELECT id FROM roles WHERE name = 'ROLE_USER'));

-- Insert sample students
INSERT INTO users (username, email, password, first_name, last_name, department, semester) VALUES
('john_student', 'john@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Smith', 'Computer Science', 3),
('jane_student', 'jane@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Doe', 'Engineering', 2),
('mike_student', 'mike@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike', 'Johnson', 'Mathematics', 4),
('sarah_student', 'sarah@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Williams', 'Physics', 1),
('alex_student', 'alex@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alex', 'Brown', 'Chemistry', 5);

-- Get student IDs for role assignment
SET @john_id = (SELECT id FROM users WHERE username = 'john_student');
SET @jane_id = (SELECT id FROM users WHERE username = 'jane_student');
SET @mike_id = (SELECT id FROM users WHERE username = 'mike_student');
SET @sarah_id = (SELECT id FROM users WHERE username = 'sarah_student');
SET @alex_id = (SELECT id FROM users WHERE username = 'alex_student');

-- Assign user role to all students
INSERT INTO user_roles (user_id, role_id) VALUES
(@john_id, (SELECT id FROM roles WHERE name = 'ROLE_USER')),
(@jane_id, (SELECT id FROM roles WHERE name = 'ROLE_USER')),
(@mike_id, (SELECT id FROM roles WHERE name = 'ROLE_USER')),
(@sarah_id, (SELECT id FROM roles WHERE name = 'ROLE_USER')),
(@alex_id, (SELECT id FROM roles WHERE name = 'ROLE_USER'));

-- Insert sample materials
INSERT INTO materials (title, description, subject_id, department, semester, file_path, file_name, file_type, file_size, approval_status, uploaded_by) VALUES
('Introduction to Algorithms', 'Comprehensive guide to basic algorithms and data structures', (SELECT id FROM subjects WHERE name = 'Computer Science'), 'Computer Science', 3, '/uploads/intro_algorithms.pdf', 'Introduction_to_Algorithms.pdf', 'pdf', 2048576, 'APPROVED', @john_id),
('Calculus Fundamentals', 'Basic calculus concepts and problem solving techniques', (SELECT id FROM subjects WHERE name = 'Mathematics'), 'Mathematics', 4, '/uploads/calculus_fundamentals.pdf', 'Calculus_Fundamentals.pdf', 'pdf', 3145728, 'APPROVED', @mike_id),
('Physics Lab Manual', 'Complete laboratory manual for physics experiments', (SELECT id FROM subjects WHERE name = 'Physics'), 'Physics', 1, '/uploads/physics_lab_manual.pdf', 'Physics_Lab_Manual.pdf', 'pdf', 1048576, 'APPROVED', @sarah_id),
('Engineering Mathematics', 'Advanced mathematics for engineering students', (SELECT id FROM subjects WHERE name = 'Mathematics'), 'Engineering', 2, '/uploads/engg_mathematics.pdf', 'Engineering_Mathematics.pdf', 'pdf', 4194304, 'PENDING', @jane_id),
('Chemistry Notes', 'Organic and inorganic chemistry notes', (SELECT id FROM subjects WHERE name = 'Chemistry'), 'Chemistry', 5, '/uploads/chemistry_notes.pdf', 'Chemistry_Notes.pdf', 'pdf', 2621440, 'APPROVED', @alex_id),
('Data Structures', 'Complete notes on data structures and algorithms', (SELECT id FROM subjects WHERE name = 'Computer Science'), 'Computer Science', 3, '/uploads/data_structures.pdf', 'Data_Structures.pdf', 'pdf', 3670016, 'APPROVED', @john_id),
('Mechanical Engineering Basics', 'Introduction to mechanical engineering concepts', (SELECT id FROM subjects WHERE name = 'Mechanical Engineering'), 'Engineering', 2, '/uploads/mech_basics.pptx', 'Mechanical_Basics.pptx', 'pptx', 5242880, 'PENDING', @jane_id),
('Linear Algebra', 'Linear algebra concepts and applications', (SELECT id FROM subjects WHERE name = 'Mathematics'), 'Mathematics', 4, '/uploads/linear_algebra.pdf', 'Linear_Algebra.pdf', 'pdf', 2097152, 'REJECTED', @mike_id, 'Content needs improvement and more examples'),
('Web Development Guide', 'Complete guide to modern web development', (SELECT id FROM subjects WHERE name = 'Computer Science'), 'Computer Science', 3, '/uploads/web_dev_guide.zip', 'Web_Development_Guide.zip', 'zip', 8388608, 'APPROVED', @john_id),
('Quantum Physics', 'Introduction to quantum mechanics', (SELECT id FROM subjects WHERE name = 'Physics'), 'Physics', 1, '/uploads/quantum_physics.pdf', 'Quantum_Physics.pdf', 'pdf', 1572864, 'PENDING', @sarah_id);

-- Update some download counts to make it realistic
UPDATE materials SET download_count = 45 WHERE title = 'Introduction to Algorithms';
UPDATE materials SET download_count = 32 WHERE title = 'Calculus Fundamentals';
UPDATE materials SET download_count = 28 WHERE title = 'Physics Lab Manual';
UPDATE materials SET download_count = 67 WHERE title = 'Chemistry Notes';
UPDATE materials SET download_count = 51 WHERE title = 'Data Structures';
UPDATE materials SET download_count = 89 WHERE title = 'Web Development Guide';

-- Set approval dates for approved materials
UPDATE materials SET approval_date = DATE_SUB(NOW(), INTERVAL 30 DAY) WHERE approval_status = 'APPROVED';

-- Display summary
SELECT 'Database setup complete!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_subjects FROM subjects;
SELECT COUNT(*) as total_materials FROM materials;
SELECT approval_status, COUNT(*) as count FROM materials GROUP BY approval_status;
