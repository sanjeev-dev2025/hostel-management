import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { InputField, SelectField } from '../components/FormFields';

export default function Hostels() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hostel/');
      // API returns paginated data: { count, results, next, previous }
      setData(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const openModal = (hostel = null) => {
    if (hostel) {
      setEditingId(hostel.name); // Using name as path param according to schema: /hostel/{name}/
      reset({
        name: hostel.name,
        gender: hostel.gender
      });
    } else {
      setEditingId(null);
      reset({ name: '', gender: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await api.put(`/hostel/${editingId}/`, formData);
        toast.success('Hostel updated successfully');
      } else {
        await api.post('/hostel/', formData);
        toast.success('Hostel created successfully');
      }
      setIsModalOpen(false);
      fetchHostels();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (name) => {
    if (window.confirm(`Are you sure you want to delete hostel ${name}?`)) {
      try {
        await api.delete(`/hostel/${name}/`);
        toast.success('Hostel deleted');
        fetchHostels();
      } catch (error) {
        toast.error('Failed to delete hostel');
      }
    }
  };

  const columns = [
    { header: 'Hostel Name', accessor: 'name', className: 'font-medium text-slate-900' },
    { 
        header: 'Gender', 
        accessor: 'gender',
        render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.gender === 'MALE' ? 'bg-blue-100 text-blue-700' :
                row.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' :
                'bg-slate-100 text-slate-700'
            }`}>
                {row.gender}
            </span>
        )
    },
    { header: 'Created At', accessor: 'created_at' },
    {
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
            onClick={() => handleDelete(row.name)}
            className="p-1 text-slate-400 hover:text-danger transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hostels</h2>
          <p className="text-sm text-slate-500">Manage hostel buildings and configurations</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Hostel
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        emptyMessage="No hostels found. Click 'Add Hostel' to create one."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Hostel' : 'Add New Hostel'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Hostel Name"
            name="name"
            register={register}
            rules={{ required: 'Name is required', maxLength: 30 }}
            error={errors.name}
            disabled={!!editingId} // Usually can't change primary key (name in this case)
          />
          
          <SelectField
            label="Gender"
            name="gender"
            register={register}
            rules={{ required: 'Gender is required' }}
            error={errors.gender}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHERS', label: 'Others' }
            ]}
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
              {editingId ? 'Save Changes' : 'Create Hostel'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
