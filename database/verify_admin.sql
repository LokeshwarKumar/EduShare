-- Verify admin user exists and is correct
USE edumat_db;

-- Check if admin user exists
SELECT 'ADMIN USER CHECK' as info, username, email, first_name, last_name, password, created_at
FROM users 
WHERE username = 'admin';

-- Check admin roles
SELECT 'ADMIN ROLES CHECK' as info, u.username, r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';

-- Compare with a working user (if any)
SELECT 'WORKING USER COMPARISON' as info, username, email, first_name, last_name, password
FROM users 
WHERE username != 'admin' 
LIMIT 1;
