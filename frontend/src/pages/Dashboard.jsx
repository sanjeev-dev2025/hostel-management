import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Users, Home, BedDouble, CreditCard, Loader2, 
  TrendingUp, CheckCircle, Clock 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="card p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
    </div>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorClass}`}>
      <Icon className="h-6 w-6" />
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    genderDist: [],
    paymentDist: [],
    roomDist: []
  });

  const fetchDashboardData = async () => {
    try {
      // Fetch all required data to compute stats
      // Note: For a real production app with massive data, this should be an aggregated backend endpoint.
      // Since no dashboard endpoint is in the OpenAPI schema, we fetch standard list endpoints.
      const [studentsRes, hostelsRes, roomsRes, paymentsRes] = await Promise.all([
        api.get('/studentlist/'),
        api.get('/hostel/'),
        api.get('/room/'),
        api.get('/payment/')
      ]);

      const students = studentsRes.data.results || studentsRes.data;
      const rooms = roomsRes.data.results || roomsRes.data;
      const payments = paymentsRes.data.results || paymentsRes.data;

      // Calculate Stats
      let occupiedCount = 0;
      let totalCapacity = 0;
      let totalOccupied = 0;

      rooms.forEach(r => {
        totalCapacity += r.capacity;
        totalOccupied += r.occupied;
        if (r.occupied >= r.capacity) occupiedCount++;
      });

      const paidCount = payments.filter(p => p.status === 'PAID').length;
      const pendingCount = payments.filter(p => p.status === 'PENDING').length;

      // Gender Distribution for charts
      const mCount = students.filter(s => s.gender === 'MALE').length;
      const fCount = students.filter(s => s.gender === 'FEMALE').length;
      const oCount = students.filter(s => s.gender === 'OTHERS').length;

      setStats({
        totalStudents: studentsRes.data.count || students.length,
        totalHostels: hostelsRes.data.count || (hostelsRes.data.results || hostelsRes.data).length,
        totalRooms: roomsRes.data.count || rooms.length,
        occupiedRooms: occupiedCount,
        availableRooms: (roomsRes.data.count || rooms.length) - occupiedCount,
        totalPayments: paymentsRes.data.count || payments.length,
        paidPayments: paidCount,
        pendingPayments: pendingCount,
        genderDist: [
          { name: 'Male', value: mCount },
          { name: 'Female', value: fCount },
          { name: 'Others', value: oCount }
        ].filter(d => d.value > 0),
        paymentDist: [
          { name: 'Paid', value: paidCount },
          { name: 'Pending', value: pendingCount }
        ],
        roomDist: [
          { name: 'Occupied Beds', value: totalOccupied },
          { name: 'Available Beds', value: totalCapacity - totalOccupied }
        ]
      });

    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center text-primary">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <h2 className="text-lg font-semibold">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  // Student Dashboard View
  if (user?.role === 'STUDENT') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, {user.username}!</h2>
          <p className="text-slate-500">Here's an overview of your account.</p>
        </div>
        <div className="card p-8 text-center border-t-4 border-t-primary">
          <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Everything looks good!</h3>
          <p className="text-slate-500 mt-2">Check your My Room and My Payments tabs for detailed information.</p>
        </div>
      </div>
    );
  }

  // Admin/Warden/Accountant Dashboard View
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, {user?.username}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Hostels" 
          value={stats.totalHostels} 
          icon={Home} 
          colorClass="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="Total Rooms" 
          value={stats.totalRooms} 
          icon={BedDouble} 
          colorClass="bg-teal-100 text-teal-600" 
        />
        <StatCard 
          title="Available Rooms" 
          value={stats.availableRooms} 
          icon={CheckCircle} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Occupied Rooms" 
          value={stats.occupiedRooms} 
          icon={Users} 
          colorClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Total Payments" 
          value={stats.totalPayments} 
          icon={CreditCard} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Paid Payments" 
          value={stats.paidPayments} 
          icon={TrendingUp} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Pending Payments" 
          value={stats.pendingPayments} 
          icon={Clock} 
          colorClass="bg-red-100 text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Status Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.paymentDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.paymentDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Paid' ? '#22C55E' : '#F59E0B'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Occupancy Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Bed Occupancy</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.roomDist}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {stats.roomDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Occupied Beds' ? '#EF4444' : '#14B8A6'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Gender Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Gender Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.genderDist}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.genderDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
