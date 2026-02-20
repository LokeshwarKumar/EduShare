
USE edumat_db;
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
WHERE u.username = 'superadmin';

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
