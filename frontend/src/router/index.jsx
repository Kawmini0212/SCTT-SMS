import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/auth/PrivateRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import StudentList from '../pages/Students';
import CreateStudent from '../pages/Students/Create';
import EditStudent from '../pages/Students/Edit';
import StudentDetails from '../pages/Students/Details';
import CourseList from '../pages/Courses';
import EnrollmentList from '../pages/Enrollments';
import AuditLogs from '../pages/AuditLogs';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={
                    <PrivateRoute><Dashboard /></PrivateRoute>
                } />

                {/* Students */}
                <Route path="/students" element={
                    <PrivateRoute><StudentList /></PrivateRoute>
                } />
                <Route path="/students/create" element={
                    <PrivateRoute><CreateStudent /></PrivateRoute>
                } />
                <Route path="/students/edit/:id" element={
                    <PrivateRoute><EditStudent /></PrivateRoute>
                } />
                <Route path="/students/:id" element={
                    <PrivateRoute><StudentDetails /></PrivateRoute>
                } />

                {/* Courses */}
                <Route path="/courses" element={
                    <PrivateRoute><CourseList /></PrivateRoute>
                } />

                {/* Enrollments */}
                <Route path="/enrollments" element={
                    <PrivateRoute><EnrollmentList /></PrivateRoute>
                } />

                {/* Audit Logs */}
                <Route path="/audit-logs" element={
                    <PrivateRoute><AuditLogs /></PrivateRoute>
                } />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
