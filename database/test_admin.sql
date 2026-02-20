
USE edumat_db;

SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    GROUP_CONCAT(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';

SELECT * FROM roles;

SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_materials FROM materials;
SELECT approval_status, COUNT(*) as count FROM materials GROUP BY approval_status;
