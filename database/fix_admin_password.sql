-- Fix admin password with a working hash
USE edumat_db;

-- Update admin password with a known working hash for "admin123"
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE username = 'admin';

-- Verify the update
SELECT username, email, password, first_name, last_name
FROM users 
WHERE username = 'admin';
