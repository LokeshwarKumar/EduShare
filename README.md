<<<<<<< HEAD
# EduMat - College Material Sharing Platform

A comprehensive web application for college students to upload, share, and access study materials. Built with React (frontend) and Spring Boot (backend) with JWT authentication and role-based access control.

## 🚀 Features

### For Students/Users
- **User Authentication**: Secure registration and login system
- **Material Upload**: Upload PDFs, DOCs, PPTs, and ZIP files
- **Browse & Search**: Search materials by subject, department, semester, or keywords
- **Download**: Access approved materials with download tracking
- **My Materials**: View upload status (Pending/Approved/Rejected)

### For Administrators
- **Admin Dashboard**: Comprehensive overview with statistics
- **Approval System**: Review and approve/reject user uploads
- **Direct Upload**: Admin uploads are auto-approved
- **User Management**: Manage registered users
- **Material Management**: Delete inappropriate content

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **HTML/CSS/JavaScript** - Core web technologies

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database access
- **Hibernate** - ORM implementation
- **JWT** - Token-based authentication
- **MySQL** - Database
- **Maven** - Build tool

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EduMat
```

### 2. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE edumat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Run Schema and Sample Data
```bash
mysql -u root -p edumat_db < database/schema.sql
mysql -u root -p edumat_db < database/sample_data.sql
```

### 3. Backend Configuration

#### Navigate to Backend
```bash
cd backend
```

#### Configure Database Connection
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edumat_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

#### Build and Run Backend
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

#### Navigate to Frontend
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start Frontend
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔐 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `password123`

### Student Accounts
- **Username**: `john_student`
- **Password**: `password123`

- **Username**: `jane_student`
- **Password**: `password123`

- **Username**: `mike_student`
- **Password**: `password123`

## 📁 Project Structure

```
EduMat/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/edumat/
│   │   │   │   ├── config/      # Security and data config
│   │   │   │   ├── controller/  # REST controllers
│   │   │   │   ├── dto/         # Data transfer objects
│   │   │   │   ├── exception/   # Exception handling
│   │   │   │   ├── model/       # JPA entities
│   │   │   │   ├── repository/  # JPA repositories
│   │   │   │   ├── security/    # Security components
│   │   │   │   └── services/   # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/           # React context
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   └── package.json
├── database/                   # Database scripts
│   ├── schema.sql             # Database schema
│   └── sample_data.sql       # Sample data
└── README.md
```

## 🔧 Configuration

### Backend Configuration (`application.properties`)

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/edumat_db
spring.datasource.username=root
spring.datasource.password=password

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
app.file.upload-dir=./uploads

# JWT Configuration
app.jwt.secret=mySecretKey123456789012345678901234567890
app.jwt.expiration-ms=86400000

# CORS Configuration
app.cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend. This is set in `package.json`:
```json
{
  "proxy": "http://localhost:8080"
}
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signin`
Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@edumat.com",
  "roles": ["ROLE_ADMIN"]
}
```

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Computer Science",
  "semester": 3
}
```

### Material Endpoints

#### GET `/api/materials/public`
Get all approved materials with optional filters.

**Query Parameters:**
- `keyword`: Search by title or description
- `subjectId`: Filter by subject ID
- `department`: Filter by department
- `semester`: Filter by semester

#### POST `/api/materials/upload`
Upload a new material (requires authentication).

**Request:** `multipart/form-data`
- `material`: JSON object with material details
- `file`: The actual file

#### GET `/api/materials/download/{id}`
Download a material file.

#### GET `/api/materials/my`
Get current user's uploaded materials (requires authentication).

### Admin Endpoints

#### GET `/api/admin/dashboard`
Get dashboard statistics (requires admin role).

#### GET `/api/admin/materials/pending`
Get materials pending approval.

#### POST `/api/admin/materials/{id}/approve`
Approve a material.

#### POST `/api/admin/materials/{id}/reject`
Reject a material.

## 🎯 Usage Guide

### For Students

1. **Register**: Create an account with your details
2. **Login**: Access the platform with your credentials
3. **Browse Materials**: Search and filter available materials
4. **Upload**: Share your study materials (requires admin approval)
5. **Download**: Access approved materials

### For Administrators

1. **Login**: Use admin credentials
2. **Dashboard**: View platform statistics
3. **Review Materials**: Approve or reject pending uploads
4. **Manage Users**: View and manage user accounts
5. **Upload**: Directly upload materials (auto-approved)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for users and admins
- **Password Encryption**: BCrypt encryption for stored passwords
- **CORS Configuration**: Cross-origin resource sharing setup
- **File Upload Validation**: File type and size restrictions
- **Input Validation**: Comprehensive input validation and sanitization

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check Java version (requires Java 17+)
- Verify database connection details
- Check if MySQL is running

#### Frontend Connection Issues
- Ensure backend is running on port 8080
- Check CORS configuration
- Verify proxy settings in package.json

#### Database Connection Errors
- Verify MySQL credentials
- Check if database exists
- Ensure MySQL service is running

#### File Upload Issues
- Check upload directory permissions
- Verify file size limits (max 10MB)
- Ensure supported file types (PDF, DOC, PPT, ZIP)

### Logs and Debugging

#### Backend Logs
Check console output for Spring Boot application logs.

#### Frontend Logs
Use browser developer tools to check:
- Console errors
- Network requests
- React component state

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file: `mvn clean package`
2. Deploy to your preferred server
3. Configure environment variables
4. Set up production database

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to a web server
3. Configure server routing for SPA
4. Set up environment variables

### Production Considerations
- Use environment variables for sensitive data
- Set up proper logging and monitoring
- Configure backup strategies
- Implement SSL/TLS certificates
- Set up proper CORS for production domains
=======
# EduShare
This project is a materials and documents sharing website for students where users and admins upload academic PDFs. User uploads are visible only after admin approval to ensure quality. I mainly worked on the backend using Spring Boot, building secure REST APIs, JWT authentication, and role-based access control, with React used for the frontend.
>>>>>>> ac7dfa464b0f98450ff7470c83c09635222b53e3
