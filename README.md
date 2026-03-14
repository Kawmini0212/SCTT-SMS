# Student Management System

A comprehensive, production-ready Student Management System built with a microservices architecture.

## 🏗️ Architecture Overview

This project follows a **microservices architecture** with a separate frontend application:

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    (React + Vite)                           │
│                   Port: 5173 (dev)                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ HTTP/REST + JWT Authentication
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼──────┐
│   Auth      │  │  Student   │
│  Service    │  │  Service   │
│  Port 5001  │  │  Port 5002 │
└─────────────┘  └────────────┘
       │                │
       │         ┌──────▼──────┐
       │         │   Course    │
       │         │  Service    │
       │         │  Port 5003  │
       │         └─────────────┘
       │                │
       │         ┌──────▼──────┐
       │         │ Enrollment  │
       │         │  Service    │
       │         │  Port 5004  │
       │         └─────────────┘
       │                │
       └─────────┬──────┘
                 │
          ┌──────▼──────┐
          │    Audit    │
          │   Service   │
          │  Port 5005  │
          └─────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────┐  ┌────────┐  ┌────▼─────┐  ┌──────────┐  ┌──────────┐
│auth_db │  │student │  │course_db │  │enrollment│  │ audit_db │
│        │  │  _db   │  │          │  │   _db    │  │          │
└────────┘  └────────┘  └──────────┘  └──────────┘  └──────────┘
          MySQL Databases (5 separate databases)
```

## 📦 Components

### Backend Services

1. **Auth Service** (Port 5001)
   - Administrator authentication
   - JWT token generation and validation
   - User session management

2. **Student Service** (Port 5002)
   - Student CRUD operations
   - Degree program management
   - Student search and filtering

3. **Course Service** (Port 5003)
   - Course management
   - Semester organization
   - Course search and filtering

4. **Enrollment Service** (Port 5004)
   - Student course enrollments
   - Enrollment status management
   - Academic history tracking

5. **Audit Service** (Port 5005)
   - System activity logging
   - Statistics and reporting
   - Audit trail for all operations

### Frontend Application

- **React 19** with modern hooks
- **Vite** for fast development
- **TanStack Query** for server state
- **Tailwind CSS** for styling
- **Zustand** for client state
- Complete integration with all backend services

## 🎯 Key Features

### ✅ Complete CRUD Operations
- Students management
- Courses management
- Enrollments management
- Degree programs

### ✅ Advanced Features
- Search and filtering
- Pagination
- Form validation
- Real-time updates
- Activity auditing
- Statistics dashboards

### ✅ Security
- JWT-based authentication
- Protected routes
- Auto-logout on expiration
- Secure API communication

### ✅ User Experience
- Responsive design
- Toast notifications
- Loading states
- Error handling
- Confirmation dialogs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### 1. Database Setup

```bash
cd backend
mysql -u root -proot < init-database.sql
```

This creates 5 databases:
- `auth_db` - Administrators
- `student_db` - Students and degree programs
- `course_db` - Courses
- `enrollment_db` - Enrollments
- `audit_db` - Audit logs

### 2. Backend Setup

Install dependencies for all services:

```bash
cd backend

# Install each service
cd services/auth-service && npm install && cd ../..
cd services/student-service && npm install && cd ../..
cd services/course-service && npm install && cd ../..
cd services/enrollment-service && npm install && cd ../..
cd services/audit-service && npm install && cd ../..
```

Configure environment (copy `.env.example` to `.env` for each service):

```bash
cd services/auth-service && cp .env.example .env
cd ../student-service && cp .env.example .env
cd ../course-service && cp .env.example .env
cd ../enrollment-service && cp .env.example .env
cd ../audit-service && cp .env.example .env
```

Start all services (separate terminals):

```bash
# Terminal 1
cd backend/services/auth-service && npm run dev

# Terminal 2
cd backend/services/student-service && npm run dev

# Terminal 3
cd backend/services/course-service && npm run dev

# Terminal 4
cd backend/services/enrollment-service && npm run dev

# Terminal 5
cd backend/services/audit-service && npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Access at: **http://localhost:5173**

### 4. Login

Default administrator credentials:
```
Username: admin
Password: admin123
```

## 📚 Documentation

### Backend
- [Backend README](backend/README.md) - Complete backend setup guide
- API Documentation available at `http://localhost:500X/api-docs` for each service

### Frontend
- [Frontend README](frontend/README.md) - Frontend overview and features
- [Setup Guide](frontend/SETUP_GUIDE.md) - Detailed setup instructions
- [Integration Guide](frontend/INTEGRATION_GUIDE.md) - Backend API integration
- [Verification](frontend/VERIFICATION.md) - Complete feature checklist

## 🗂️ Project Structure

```
TestApp/
├── backend/
│   ├── init-database.sql          # Database initialization
│   ├── package.json               # Root package.json
│   ├── scripts/                   # Utility scripts
│   └── services/
│       ├── auth-service/
│       ├── student-service/
│       ├── course-service/
│       ├── enrollment-service/
│       └── audit-service/
│
├── frontend/
│   ├── src/
│   │   ├── api/                   # API clients
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom hooks
│   │   ├── pages/                 # Page components
│   │   ├── router/                # Routing config
│   │   ├── store/                 # State management
│   │   └── utils/                 # Utilities
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── vite.config.js
│
└── Guides/
    └── Implementation documentation
```

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js + Express
- **Database:** MySQL 8
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs, helmet, cors
- **Validation:** express-validator
- **Documentation:** Swagger UI

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios
- **State Management:**
  - Server State: TanStack Query 5
  - Client State: Zustand 5
- **Forms:** React Hook Form 7
- **Styling:** Tailwind CSS 3
- **Icons:** React Icons
- **Notifications:** React Toastify

## 🔐 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection

## 📊 Database Schema

### auth_db
- `administrators` - System administrators

### student_db
- `students` - Student records
- `degree_programs` - Degree programs

### course_db
- `courses` - Course information

### enrollment_db
- `enrollments` - Student course enrollments

### audit_db
- `audit_logs` - System activity logs

## 🧪 Testing

### Test Backend Services

```bash
# Login test
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get students (with token)
curl http://localhost:5002/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Frontend

1. Login with admin/admin123
2. Navigate through all pages
3. Test CRUD operations
4. Verify responsive design

## 📈 API Endpoints Summary

| Service | Port | Base URL | Endpoints |
|---------|------|----------|-----------|
| Auth | 5001 | /api/auth | login, logout, me, verify |
| Student | 5002 | /api/students | CRUD + degree-programs |
| Course | 5003 | /api/courses | CRUD + semesters |
| Enrollment | 5004 | /api/enrollments | CRUD + history |
| Audit | 5005 | /api/audit-logs | list, stats, view |

## 🌐 Deployment

### Backend
- Can be deployed to any Node.js hosting (Heroku, AWS, DigitalOcean)
- Each service can scale independently
- Use PM2 for process management
- Configure reverse proxy (Nginx)

### Frontend
- Static build deployable to Vercel, Netlify, or any CDN
- Configure environment variables for production URLs
- Enable HTTPS

### Database
- MySQL 8+ on dedicated server or cloud (AWS RDS, etc.)
- Configure backups
- Set up monitoring

## 🔄 Development Workflow

1. **Database First:** Initialize databases
2. **Backend Services:** Start all microservices
3. **Frontend:** Connect to running services
4. **Test:** Manual testing via UI
5. **Deploy:** Build and deploy to production

## 📝 Environment Variables

### Backend (per service)
```env
PORT=500X
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=service_db
JWT_SECRET=your-secret-key
```

### Frontend
```env
VITE_API_URL=http://localhost:5002/api
VITE_AUTH_URL=http://localhost:5001/api
VITE_APP_NAME=Student Management System
```

## 🐛 Troubleshooting

### Backend Issues
- Check database connection
- Verify service ports are free
- Check environment variables
- Review service logs

### Frontend Issues
- Verify backend services are running
- Check browser console for errors
- Clear localStorage if auth issues
- Check .env configuration

## 🤝 Contributing

1. Follow the existing code structure
2. Use ES6+ features
3. Add proper error handling
4. Document new endpoints
5. Test thoroughly

## 📄 License

This project is for educational purposes.

## 👥 Default Users

**Administrator:**
- Username: `admin`
- Password: `admin123`

## 🎓 Use Cases

### Academic Institutions
- Student registration
- Course management
- Enrollment tracking
- Academic records

### Training Centers
- Student enrollment
- Course scheduling
- Progress tracking
- Certificate management

### Educational Organizations
- Learner management
- Program administration
- Attendance tracking
- Performance monitoring

## 🚧 Future Enhancements

- [ ] Student portal (separate login)
- [ ] Grade management
- [ ] Attendance tracking
- [ ] Report generation (PDF)
- [ ] Email notifications
- [ ] Payment integration
- [ ] Document uploads
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Export to Excel
- [ ] Batch operations
- [ ] Role-based access control

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review troubleshooting section
3. Check service health endpoints
4. Review browser/server console logs

## 🎉 Success Metrics

### Backend
- ✅ 5 microservices running
- ✅ 5 databases initialized
- ✅ 40+ API endpoints
- ✅ Complete CRUD operations
- ✅ JWT authentication
- ✅ Audit logging

### Frontend
- ✅ 10+ pages
- ✅ 30+ components
- ✅ 25+ React Query hooks
- ✅ Full backend integration
- ✅ Responsive design
- ✅ Production-ready build

---

**Status: Production Ready** ✅

This is a complete, fully-functional Student Management System ready for deployment and use!

**Get Started:** See [Backend Setup](backend/README.md) and [Frontend Setup](frontend/SETUP_GUIDE.md) for detailed instructions.
