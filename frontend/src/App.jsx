import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Students from './pages/Students';
import StudentCredentials from './pages/StudentCredentials';
import Hostels from './pages/Hostels';
import Rooms from './pages/Rooms';
import RoomPrices from './pages/RoomPrices';
import RoomAllotments from './pages/RoomAllotments';
import Payments from './pages/Payments';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.must_change_password && user.role === 'STUDENT') {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">403 - Forbidden</h2>
          <p className="text-slate-600 mb-6">You do not have permission to access this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

const MustChangePasswordRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (!(user.must_change_password && user.role === 'STUDENT')) return <Navigate to="/dashboard" replace />;
    return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<MustChangePasswordRoute><ChangePassword /></MustChangePasswordRoute>} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
        {/* Profile (Everyone) */}
        <Route path="profile" element={<Profile />} />

        {/* Users (ADMIN) */}
        <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>} />

        {/* Students (ADMIN, WARDEN, ACCOUNTANT) */}
        <Route path="students" element={<ProtectedRoute allowedRoles={['ADMIN', 'WARDEN', 'ACCOUNTANT']}><Students /></ProtectedRoute>} />
        
        {/* Student Credentials (ADMIN) */}
        <Route path="student-credentials" element={<ProtectedRoute allowedRoles={['ADMIN']}><StudentCredentials /></ProtectedRoute>} />

        {/* Hostels & Rooms (ADMIN, WARDEN) */}
        <Route path="hostels" element={<ProtectedRoute allowedRoles={['ADMIN', 'WARDEN']}><Hostels /></ProtectedRoute>} />
        <Route path="rooms" element={<ProtectedRoute allowedRoles={['ADMIN', 'WARDEN']}><Rooms /></ProtectedRoute>} />
        <Route path="allotments" element={<ProtectedRoute allowedRoles={['ADMIN', 'WARDEN']}><RoomAllotments /></ProtectedRoute>} />

        {/* Room Prices (ADMIN) */}
        <Route path="room-prices" element={<ProtectedRoute allowedRoles={['ADMIN']}><RoomPrices /></ProtectedRoute>} />

        {/* Payments (ADMIN, ACCOUNTANT) */}
        <Route path="payments" element={<ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNTANT']}><Payments /></ProtectedRoute>} />

        {/* Student Specific Routes */}
        <Route path="my-room" element={<ProtectedRoute allowedRoles={['STUDENT']}><RoomAllotments studentView={true} /></ProtectedRoute>} />
        <Route path="my-payments" element={<ProtectedRoute allowedRoles={['STUDENT']}><Payments studentView={true} /></ProtectedRoute>} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
