import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { InputField, SelectField, TextAreaField } from '../components/FormFields';

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' }
];

export default function Payments({ studentView = false }) {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      if (studentView) {
        const response = await api.get(`/payment/?page=${page}`);
        setData(response.data.results || response.data);
      } else {
        const response = await api.get(`/payment/?page=${page}`);
        setData(response.data.results || []);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          page: page
        });
      }
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/studentlist/');
      setStudents(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load students');
    }
  };

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, [studentView]);

  const openModal = (payment = null) => {
    if (payment) {
      setEditingId(payment.id); 
      reset({
        student: payment.student,
        billing_month: payment.billing_month,
        billing_year: payment.billing_year,
        status: payment.status,
        remarks: payment.remarks
      });
    } else {
      setEditingId(null);
      reset({ 
        student: '', 
        billing_month: new Date().getMonth() + 1, 
        billing_year: new Date().getFullYear(),
        status: 'PENDING',
        remarks: ''
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await api.patch(`/payment/${editingId}/`, formData);
        toast.success('Payment updated successfully');
      } else {
        await api.post('/payment/', formData);
        toast.success('Payment created successfully');
      }
      setIsModalOpen(false);
      fetchData(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await api.delete(`/payment/${id}/`);
        toast.success('Payment deleted');
        fetchData(pagination.page);
      } catch (error) {
        toast.error('Failed to delete payment');
      }
    }
  };

  const columns = [
    { 
      header: 'Student', 
      render: (row) => {
        const s = students.find(s => s.id === row.student);
        return s ? `${s.first_name} ${s.last_name}` : row.student;
      },
      className: 'font-medium text-slate-900'
    },
    { 
      header: 'Billing Period', 
      render: (row) => {
        const month = MONTHS.find(m => m.value === row.billing_month)?.label || row.billing_month;
        return `${month} ${row.billing_year}`;
      }
    },
    { 
      header: 'Amount', 
      render: (row) => <span className="font-semibold text-slate-700">${row.amount}</span>
    },
    { header: 'Payment Date', accessor: 'payment_date' },
    { 
        header: 'Status', 
        render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                row.status === 'PAID' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
                {row.status}
            </span>
        )
    },
    { header: 'Remarks', accessor: 'remarks', className: 'text-xs text-slate-500 max-w-[150px] truncate' }
  ];

  if (!studentView) {
    columns.push({
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => openModal(row)}
            className="p-1 text-slate-400 hover:text-primary transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-1 text-slate-400 hover:text-danger transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {studentView ? 'My Payments' : 'Payments'}
          </h2>
          <p className="text-sm text-slate-500">
            {studentView ? 'View your billing and payment history' : 'Manage student billing and payments'}
          </p>
        </div>
        {!studentView && (
          <button 
            onClick={() => openModal()}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={!studentView ? pagination : null}
        onPageChange={fetchData}
        emptyMessage={studentView ? "You have no payment records." : "No payments found."}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Payment' : 'Record Payment'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SelectField
            label="Student"
            name="student"
            register={register}
            rules={{ required: 'Student is required', valueAsNumber: true }}
            error={errors.student}
            options={students.map(s => ({ value: s.id, label: `${s.first_name} ${s.last_name} (${s.student_id})` }))}
            placeholder="Select a student"
            disabled={!!editingId} // Cannot change student on edit since it's the PK
          />
          
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Billing Month"
              name="billing_month"
              register={register}
              rules={{ required: 'Month is required', valueAsNumber: true }}
              error={errors.billing_month}
              options={MONTHS}
            />
            
            <InputField
              label="Billing Year"
              name="billing_year"
              type="number"
              register={register}
              rules={{ required: 'Year is required', min: 2000, max: 2100, valueAsNumber: true }}
              error={errors.billing_year}
            />
          </div>

          <SelectField
            label="Status"
            name="status"
            register={register}
            rules={{ required: 'Status is required' }}
            error={errors.status}
            options={[
              { value: 'PENDING', label: 'Pending' },
              { value: 'PAID', label: 'Paid' }
            ]}
          />

          <TextAreaField
            label="Remarks"
            name="remarks"
            register={register}
            error={errors.remarks}
            placeholder="Optional notes..."
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
              {editingId ? 'Save Changes' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
