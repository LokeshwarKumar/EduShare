
USE edumat_db;

DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username IN ('admin', 'superadmin'));
DELETE FROM users WHERE username IN ('admin', 'superadmin');

INSERT INTO users (username, email, password, first_name, last_name, department, semester, created_at, updated_at) VALUES
('admin', 'admin@edumat.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'Administration', NULL, NOW(), NOW());

SET @admin_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) VALUES
(@admin_id, (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')),
(@admin_id, (SELECT id FROM roles WHERE name = 'ROLE_USER'));

SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.password,
    GROUP_CONCAT(r.name) as roles
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
LEFT JOIN roles r ON ur.role_id = r.id 
WHERE u.username = 'admin';
