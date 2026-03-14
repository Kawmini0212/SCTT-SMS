# Frontend Setup Guide

Complete step-by-step guide to set up and run the Student Management System frontend.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **Backend services** running (see [../backend/README.md](../backend/README.md))
- ✅ **Database** initialized with sample data

### Verify Prerequisites

```bash
# Check Node.js version
node --version
# Should show v18.0.0 or higher

# Check npm version
npm --version
# Should show 8.0.0 or higher
```

---

## 🚀 Quick Start

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React 19
- Vite
- React Router DOM
- TanStack Query
- Axios
- Tailwind CSS
- And more...

**Time:** ~2-3 minutes depending on internet speed

### Step 3: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

The default `.env` file should look like this:

```env
VITE_API_URL=http://localhost:5002/api
VITE_AUTH_URL=http://localhost:5001/api
VITE_APP_NAME=Student Management System
```

**Note:** If your backend services are running on different ports, update these URLs accordingly.

### Step 4: Ensure Backend Services Are Running

The frontend requires these backend services to be active:

| Service | Port | Status Check |
|---------|------|--------------|
| Auth Service | 5001 | http://localhost:5001/health |
| Student Service | 5002 | http://localhost:5002/health |
| Course Service | 5003 | http://localhost:5003/health |
| Enrollment Service | 5004 | http://localhost:5004/health |
| Audit Service | 5005 | http://localhost:5005/health |

You can check if services are running by opening these URLs in your browser or using curl:

```bash
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health
curl http://localhost:5004/health
curl http://localhost:5005/health
```

Each should return: `{"status":"ok","service":"service-name","timestamp":"..."}`

### Step 5: Start Development Server

```bash
npm run dev
```

You should see output similar to:

```
VITE v7.2.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the login page.

### Step 7: Login

Use the default administrator credentials:

```
Username: admin
Password: admin123
```

**Success!** You should now be on the Dashboard.

---

## 🔍 Verify Installation

### Test Authentication

1. Login with admin/admin123
2. Check that you're redirected to `/dashboard`
3. Verify your name appears in the navbar

### Test Students Module

1. Click "Students" in the sidebar
2. You should see a list of students (if you have sample data)
3. Try searching for a student
4. Try creating a new student

### Test Courses Module

1. Click "Courses" in the sidebar
2. You should see a list of courses
3. Try filtering by semester
4. Try creating a new course

### Test Enrollments Module

1. Click "Enrollments" in the sidebar
2. You should see enrollment records
3. Try enrolling a student in a course
4. View student enrollment history

### Test Audit Logs

1. Click "Audit Logs" in the sidebar
2. You should see logged actions
3. View statistics at the top

---

## 🛠️ Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 📁 Project Structure Overview

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API client modules (5 files)
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # React components
│   │   ├── auditLogs/     # Audit log components
│   │   ├── auth/          # Auth components (PrivateRoute)
│   │   ├── common/        # Reusable UI (Button, Modal, etc.)
│   │   ├── courses/       # Course components
│   │   ├── enrollments/   # Enrollment components
│   │   ├── layout/        # Layout (Navbar, Sidebar)
│   │   └── students/      # Student components
│   ├── hooks/             # Custom React hooks (6 files)
│   ├── pages/             # Page components
│   │   ├── AuditLogs/
│   │   ├── Courses/
│   │   ├── Enrollments/
│   │   ├── Students/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   ├── router/            # Routing configuration
│   ├── store/             # Zustand state (auth)
│   ├── utils/             # Utilities (validators, formatters)
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   ├── theme.js           # Tailwind theme config
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── eslint.config.js       # ESLint configuration
```

---

## 🎨 Customization

### Change Application Name

Edit `.env`:
```env
VITE_APP_NAME=Your Custom Name
```

### Change Theme Colors

Edit `theme.js`:
```javascript
colors: {
  'brand-black': '#1a1a1a',
  'brand-red': '#dc2626',     // Change to your primary color
  'brand-yellow': '#fbbf24',  // Change to your accent color
  // ...
}
```

### Change Backend URLs

Edit `.env`:
```env
VITE_API_URL=http://your-server:5002/api
VITE_AUTH_URL=http://your-server:5001/api
```

---

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Cannot connect to backend"

**Symptoms:** Login fails, no data loads, network errors in console

**Solutions:**
1. Verify backend services are running
2. Check `.env` file has correct URLs
3. Check browser console for CORS errors
4. Ensure backend CORS is enabled for `http://localhost:5173`

### Issue: "401 Unauthorized" errors

**Solution:**
1. Logout and login again
2. Clear localStorage: `localStorage.clear()` in browser console
3. Check token expiration (default 24h)
4. Verify JWT_SECRET matches between auth service and other services

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
npm install

# If still failing, check import paths in error message
```

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue: Slow development server

**Solution:**
1. Close other applications
2. Disable browser extensions
3. Clear Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Issue: ESLint errors

**Solution:**
```bash
# Auto-fix lint issues
npm run lint -- --fix
```

---

## 🔐 Security Notes

### Development Mode

- JWT tokens stored in `localStorage`
- Auto-logout on 401 response
- HTTPS not required (local development)

### Production Mode

**Important Security Considerations:**

1. **Use HTTPS**
   - Deploy behind SSL/TLS
   - Update `.env` with `https://` URLs

2. **Secure Token Storage**
   - Consider using httpOnly cookies instead of localStorage
   - Implement refresh token rotation

3. **Environment Variables**
   - Never commit `.env` to git
   - Use environment-specific `.env` files
   - Set variables in deployment platform (Vercel, Netlify, etc.)

4. **Content Security Policy**
   - Configure CSP headers
   - Whitelist allowed domains

---

## 📦 Building for Production

### Step 1: Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Step 2: Preview Build Locally

```bash
npm run preview
```

Opens the production build at http://localhost:4173

### Step 3: Deploy

The `dist/` folder contains static files ready to deploy to:

- **Vercel**
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod --dir=dist
  ```

- **Apache/Nginx**
  - Copy `dist/` contents to web root
  - Configure SPA routing (see deployment guide)

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

---

## 📊 Performance

### Development Mode
- Hot Module Replacement (HMR)
- Fast Refresh for React
- Source maps enabled

### Production Mode
- Minified JavaScript
- CSS optimization
- Tree shaking
- Code splitting
- Gzip-ready assets

**Typical Build Size:**
- JS: ~200KB (gzipped)
- CSS: ~20KB (gzipped)
- Total: <1MB with all assets

---

## 🧪 Testing the Frontend

### Manual Testing Checklist

**Authentication:**
- [ ] Can login with valid credentials
- [ ] Cannot login with invalid credentials
- [ ] Auto-logout on token expiration
- [ ] Logout button works
- [ ] Protected routes redirect to login

**Students Module:**
- [ ] View student list
- [ ] Search students
- [ ] Create new student
- [ ] Edit existing student
- [ ] View student details
- [ ] Delete student

**Courses Module:**
- [ ] View course list
- [ ] Search courses
- [ ] Filter by semester
- [ ] Create new course
- [ ] Edit existing course
- [ ] Delete course

**Enrollments Module:**
- [ ] View enrollments
- [ ] Enroll student in courses
- [ ] Update enrollment status
- [ ] View student history
- [ ] Change semester courses
- [ ] Delete enrollment

**Audit Logs:**
- [ ] View audit logs
- [ ] Filter by action type
- [ ] Filter by service
- [ ] View statistics

**Responsive Design:**
- [ ] Works on mobile (< 640px)
- [ ] Works on tablet (640px - 1024px)
- [ ] Works on desktop (> 1024px)

---

## 📝 Next Steps

After successful setup:

1. ✅ Explore all pages
2. ✅ Test CRUD operations
3. ✅ Customize theme and branding
4. ✅ Add your own features
5. ✅ Deploy to production

---

## 📖 Additional Documentation

- [README.md](README.md) - Project overview and features
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Backend API integration details
- [../backend/README.md](../backend/README.md) - Backend setup instructions

---

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify backend services are running
4. Check `.env` configuration

---

## 🎉 Success!

Your frontend is now set up and running! You have a complete Student Management System with:

- ✅ Modern React 19 application
- ✅ Full microservices integration
- ✅ Beautiful responsive UI
- ✅ Complete CRUD operations
- ✅ Authentication and authorization
- ✅ Real-time data updates
- ✅ Production-ready build

**Enjoy building!** 🚀
