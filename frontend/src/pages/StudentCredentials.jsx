import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import DataTable from '../components/DataTable';

export default function StudentCredentials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });

  const fetchCredentials = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/student-credentials/?page=${page}`);
      setData(response.data.results || []);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: page
      });
    } catch (error) {
      toast.error('Failed to load student credentials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const columns = [
    { header: 'Student Name', accessor: 'student_name', className: 'font-medium text-slate-900' },
    { header: 'Student ID Code', accessor: 'student_id_code' },
    { header: 'Username', accessor: 'username' },
    { 
        header: 'Temporary Password', 
        accessor: 'temporary_password',
        render: (row) => (
            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 text-sm">
                {row.temporary_password}
            </span>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Credentials</h2>
          <p className="text-sm text-slate-500">View auto-generated temporary credentials for students</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={pagination}
        onPageChange={fetchCredentials}
        emptyMessage="No student credentials found."
      />
    </div>
  );
}
