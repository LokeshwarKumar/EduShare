USE edumat_db;

UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE username = 'admin';

SELECT username, email, password, first_name, last_name
FROM users 
WHERE username = 'admin';
