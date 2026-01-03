-- Test script to verify admin user
USE edumat_db;

-- Check if admin user exists and has correct role
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

-- Check all roles
SELECT * FROM roles;

-- Check if sample data was inserted
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_materials FROM materials;
SELECT approval_status, COUNT(*) as count FROM materials GROUP BY approval_status;
