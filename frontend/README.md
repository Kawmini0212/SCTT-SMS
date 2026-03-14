# Student Management System - Frontend

Modern React-based frontend for the Student Management System microservices architecture.

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **date-fns** - Date formatting

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client modules
│   │   ├── auditApi.js
│   │   ├── authApi.js
│   │   ├── axiosConfig.js
│   │   ├── courseApi.js
│   │   ├── enrollmentApi.js
│   │   └── studentApi.js
│   ├── assets/           # Static assets
│   ├── components/       # Reusable React components
│   │   ├── auditLogs/    # Audit log components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Shared UI components
│   │   ├── courses/      # Course management components
│   │   ├── enrollments/  # Enrollment management components
│   │   ├── layout/       # Layout components
│   │   └── students/     # Student management components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── router/           # Routing configuration
│   ├── store/            # State management
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Application entry point
│   └── theme.js          # Theme configuration
├── .env                  # Environment variables
├── .env.example          # Environment template
└── package.json
```

## 🏗️ Architecture

### Microservices Integration

The frontend connects to 5 backend microservices:

1. **Auth Service** (Port 5001) - Administrator authentication
2. **Student Service** (Port 5002) - Student & degree program management
3. **Course Service** (Port 5003) - Course management
4. **Enrollment Service** (Port 5004) - Student enrollments
5. **Audit Service** (Port 5005) - Audit logging

### State Management

- **Server State**: TanStack Query for caching and synchronization
- **Client State**: Zustand for authentication state
- **Form State**: React Hook Form for validation

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Backend microservices running (see [backend/README.md](../backend/README.md))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default ports should work)
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Application available at: **http://localhost:5173**

### Build for Production

```bash
npm run build    # Create optimized build
npm run preview  # Preview production build
```

## 🔐 Authentication

### Default Administrator
```
Username: admin
Password: admin123
```

### Flow
1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in localStorage
4. All API calls include token in Authorization header
5. On 401 response, auto-logout and redirect to login

## 📄 Available Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview statistics and quick actions |
| `/students` | Student list, create, edit, view, delete |
| `/courses` | Course list, create, edit, view, delete |
| `/enrollments` | Enrollment management and student history |
| `/audit-logs` | System activity logs and statistics |

## 🎨 Theme & Styling

Custom color palette in `theme.js`:

```javascript
'brand-black': '#1a1a1a'
'brand-red': '#dc2626'
'brand-yellow': '#fbbf24'
'brand-gray': '#f3f4f6'
```

Fully responsive design with mobile, tablet, and desktop breakpoints.

## 🧩 Key Features

✅ Administrator authentication with JWT  
✅ Student management (CRUD)  
✅ Course management (CRUD)  
✅ Enrollment management  
✅ Degree program management  
✅ Audit log viewing  
✅ Search and filtering  
✅ Pagination  
✅ Form validation  
✅ Error handling  
✅ Toast notifications  
✅ Responsive design  
✅ Protected routes  

## 🔌 API Hooks

All API interactions use custom React Query hooks:

**Student Hooks**: `useStudents`, `useStudent`, `useCreateStudent`, `useUpdateStudent`, `useDeleteStudent`  
**Course Hooks**: `useCourses`, `useSemesters`, `useCreateCourse`, `useUpdateCourse`, `useDeleteCourse`  
**Enrollment Hooks**: `useEnrollments`, `useEnroll`, `useUpdateEnrollmentStatus`  
**Audit Hooks**: `useAuditLogs`, `useAuditStats`  

## 🐛 Error Handling

- Network errors → Toast notifications
- 401 Unauthorized → Auto-logout and redirect
- Validation errors → Inline form errors
- Server errors → User-friendly messages

## 📦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Student Service URL | `http://localhost:5002/api` |
| `VITE_AUTH_URL` | Auth Service URL | `http://localhost:5001/api` |
| `VITE_APP_NAME` | Application name | `Student Management System` |

## 🧪 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Backend API Documentation](../backend/README.md)
