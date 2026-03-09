# Student Management System - Backend Setup Instructions

## Phase 1: Database Setup

### Step 1: Initialize Databases

Run the SQL initialization script to create all databases and tables:

```bash
# Option 1: Using mysql command line
mysql -u root -proot < init-database.sql

# Option 2: Using MySQL Workbench or phpMyAdmin
# Simply open and execute the init-database.sql file
```

This will create:
- ✅ `auth_db` - Administrator authentication
- ✅ `student_db` - Student data and degree programs
- ✅ `course_db` - Course information
- ✅ `enrollment_db` - Course enrollments
- ✅ `audit_db` - Audit logs

### Step 2: Verify Database Creation

```sql
SHOW DATABASES;
-- You should see all 5 databases listed
```

---

## Phase 2: Install Dependencies

Each microservice needs Node.js dependencies installed:

```bash
# Install dependencies for each service
cd services/auth-service && npm install
cd ../student-service && npm install
cd ../course-service && npm install
cd ../enrollment-service && npm install
cd ../audit-service && npm install
cd ../../api-gateway && npm install
```

---

## Phase 3: Configure Environment Variables

Each service has a `.env.example` file. Copy it to `.env` and update:

```bash
# Auth Service
cp services/auth-service/.env.example services/auth-service/.env

# Student Service
cp services/student-service/.env.example services/student-service/.env

# ... repeat for all services
```

---

## Phase 4: Start Services

### Development Mode (Individual Services)

```bash
# Terminal 1 - Auth Service
cd services/auth-service
npm run dev

# Terminal 2 - Student Service
cd services/student-service
npm run dev

# Terminal 3 - Course Service
cd services/course-service
npm run dev

# Terminal 4 - Enrollment Service
cd services/enrollment-service
npm run dev

# Terminal 5 - Audit Service
cd services/audit-service
npm run dev

# Terminal 6 - API Gateway
cd api-gateway
npm run dev
```

### Using Docker Compose (Recommended)

```bash
# Start all services at once
docker-compose -f docker-compose.dev.yml up

# Start specific service
docker-compose -f docker-compose.dev.yml up student-service

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

---

## Service Endpoints

Once running, services will be available at:

- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:5001
- **Student Service**: http://localhost:5002
- **Course Service**: http://localhost:5003
- **Enrollment Service**: http://localhost:5004
- **Audit Service**: http://localhost:5005

---

## Testing

### Test Auth Service

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Student Service (with auth token)

```bash
# Get all students
curl http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Next Steps

1. ✅ Database initialized
2. ⏳ Install dependencies for all services
3. ⏳ Configure environment variables
4. ⏳ Start services and test
