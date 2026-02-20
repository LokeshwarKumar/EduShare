
USE edumat_db;

SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.password as password_hash,
    GROUP_CONCAT(r.name) as roles
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
LEFT JOIN roles r ON ur.role_id = r.id 
GROUP BY u.id, u.username, u.email, u.first_name, u.last_name, u.password
ORDER BY u.id;

SELECT * FROM roles;

SELECT * FROM user_roles;

SELECT 
    username,
    password,
    CASE 
        WHEN password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
        THEN 'Password hash matches password123'
        ELSE 'Password hash does NOT match password123'
    END as password_check
FROM users 
WHERE username IN ('superadmin', 'admin');
