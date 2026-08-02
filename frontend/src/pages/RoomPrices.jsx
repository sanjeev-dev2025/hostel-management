import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { InputField, SelectField } from '../components/FormFields';

export default function RoomPrices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/roomprice/');
      setData(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load room prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const openModal = (price = null) => {
    if (price) {
      setEditingId(price.room_type);
      reset({
        room_type: price.room_type,
        monthly_fee: price.monthly_fee
      });
    } else {
      setEditingId(null);
      reset({ room_type: '', monthly_fee: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await api.put(`/roomprice/${editingId}/`, formData);
        toast.success('Room price updated successfully');
      } else {
        await api.post('/roomprice/', formData);
        toast.success('Room price created successfully');
      }
      setIsModalOpen(false);
      fetchPrices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (room_type) => {
    if (window.confirm(`Are you sure you want to delete price for ${room_type} room?`)) {
      try {
        await api.delete(`/roomprice/${room_type}/`);
        toast.success('Room price deleted');
        fetchPrices();
      } catch (error) {
        toast.error('Failed to delete room price');
      }
    }
  };

  const columns = [
    { 
        header: 'Room Type', 
        accessor: 'room_type', 
        className: 'font-medium text-slate-900',
        render: (row) => (
            <span className="font-semibold text-primary">{row.room_type}</span>
        )
    },
    { 
        header: 'Monthly Fee', 
        accessor: 'monthly_fee',
        render: (row) => (
            <span className="text-slate-700 font-medium">${row.monthly_fee}</span>
        )
    },
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
            onClick={() => handleDelete(row.room_type)}
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
          <h2 className="text-2xl font-bold text-slate-800">Room Prices</h2>
          <p className="text-sm text-slate-500">Manage monthly fees for different room types</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Set Price
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        emptyMessage="No room prices defined yet."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Room Price' : 'Add Room Price'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SelectField
            label="Room Type"
            name="room_type"
            register={register}
            rules={{ required: 'Room type is required' }}
            error={errors.room_type}
            disabled={!!editingId}
            options={[
              { value: 'SINGLE', label: 'Single' },
              { value: 'DOUBLE', label: 'Double' },
              { value: 'TRIPLE', label: 'Triple' }
            ]}
          />
          
          <InputField
            label="Monthly Fee"
            name="monthly_fee"
            type="number"
            step="0.01"
            register={register}
            rules={{ required: 'Monthly fee is required', min: 0 }}
            error={errors.monthly_fee}
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
              {editingId ? 'Save Changes' : 'Create Price'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
