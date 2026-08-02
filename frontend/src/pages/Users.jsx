import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { InputField, SelectField } from '../components/FormFields';

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/userlist/?page=${page}`);
      setData(response.data.results || []);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: page
      });
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = () => {
    reset({ username: '', password: '', email: '', role: 'STUDENT' });
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      await api.post('/usercreate/', formData);
      toast.success('User created successfully');
      setIsModalOpen(false);
      fetchUsers(1);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create user');
    }
  };

  const columns = [
    { header: 'Username', accessor: 'username', className: 'font-medium text-slate-900' },
    { header: 'Email', accessor: 'email' },
    { 
        header: 'Role', 
        accessor: 'role',
        render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                row.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                row.role === 'WARDEN' ? 'bg-orange-100 text-orange-700' :
                row.role === 'ACCOUNTANT' ? 'bg-green-100 text-green-700' :
                'bg-blue-100 text-blue-700'
            }`}>
                {row.role}
            </span>
        )
    },
    { 
        header: 'Must Change Pwd', 
        accessor: 'must_change_password',
        render: (row) => (
            <span className={row.must_change_password ? 'text-warning font-semibold' : 'text-success'}>
                {row.must_change_password ? 'Yes' : 'No'}
            </span>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Users</h2>
          <p className="text-sm text-slate-500">Manage system users and their roles</p>
        </div>
        <button 
          onClick={openModal}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={pagination}
        onPageChange={fetchUsers}
        emptyMessage="No users found."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Username"
            name="username"
            register={register}
            rules={{ required: 'Username is required', maxLength: 150 }}
            error={errors.username}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            register={register}
            rules={{ required: 'Email is required' }}
            error={errors.email}
          />
          
          <SelectField
            label="Role"
            name="role"
            register={register}
            rules={{ required: 'Role is required' }}
            error={errors.role}
            options={[
              { value: 'STUDENT', label: 'Student' },
              { value: 'WARDEN', label: 'Warden' },
              { value: 'ACCOUNTANT', label: 'Accountant' },
              { value: 'ADMIN', label: 'Admin' }
            ]}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            rules={{ required: 'Password is required', minLength: 8 }}
            error={errors.password}
            placeholder="User must change this on first login"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
