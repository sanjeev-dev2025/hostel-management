import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, User, Home, BedDouble, 
  CalendarCheck, CreditCard, LogOut, DollarSign, X, Shield, Key
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'WARDEN', 'ACCOUNTANT', 'STUDENT'] },
    { name: 'Users', path: '/dashboard/users', icon: Shield, roles: ['ADMIN'] },
    { name: 'Students', path: '/dashboard/students', icon: Users, roles: ['ADMIN', 'WARDEN', 'ACCOUNTANT'] },
    { name: 'Student Credentials', path: '/dashboard/student-credentials', icon: Key, roles: ['ADMIN'] },
    { name: 'Hostels', path: '/dashboard/hostels', icon: Home, roles: ['ADMIN', 'WARDEN'] },
    { name: 'Rooms', path: '/dashboard/rooms', icon: BedDouble, roles: ['ADMIN', 'WARDEN'] },
    { name: 'Room Prices', path: '/dashboard/room-prices', icon: DollarSign, roles: ['ADMIN'] },
    { name: 'Room Allotments', path: '/dashboard/allotments', icon: CalendarCheck, roles: ['ADMIN', 'WARDEN'] },
    { name: 'Payments', path: '/dashboard/payments', icon: CreditCard, roles: ['ADMIN', 'ACCOUNTANT'] },
    
    // Student specific
    { name: 'My Profile', path: '/dashboard/profile', icon: User, roles: ['STUDENT'] },
    { name: 'My Room', path: '/dashboard/my-room', icon: BedDouble, roles: ['STUDENT'] },
    { name: 'My Payments', path: '/dashboard/my-payments', icon: CreditCard, roles: ['STUDENT'] },
    
    // Generic Profile (for staff)
    { name: 'Profile', path: '/dashboard/profile', icon: User, roles: ['ADMIN', 'WARDEN', 'ACCOUNTANT'] },
  ];

  const navItems = allNavItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Hostel</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Management System</p>
        </div>
        <button className="md:hidden text-slate-400 hover:text-white" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="px-4 py-2 border-b border-slate-700/50 mb-4 flex flex-col">
        <span className="text-sm font-semibold">{user?.username}</span>
        <span className="text-xs text-primary font-medium">{user?.role}</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={`${item.name}-${item.path}`}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onClose} // close on mobile after click
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-slate-300 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
