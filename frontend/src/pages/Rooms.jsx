import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { InputField, SelectField } from '../components/FormFields';

export default function Rooms() {
  const [data, setData] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchRooms = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/room/?page=${page}`);
      setData(response.data.results || []);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: page
      });
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
    try {
      // Assuming hostel list endpoint might be paginated, we should get all or enough
      const response = await api.get('/hostel/');
      setHostels(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load hostels for dropdown');
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchHostels();
  }, []);

  const openModal = (room = null) => {
    if (room) {
      setEditingId(room.id);
      reset({
        room_number: room.room_number,
        room_type: room.room_type,
        capacity: room.capacity,
        occupied: room.occupied,
        hostel: room.hostel
      });
    } else {
      setEditingId(null);
      reset({ room_number: '', room_type: 'SINGLE', capacity: 1, occupied: 0, hostel: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await api.put(`/room/${editingId}/`, formData);
        toast.success('Room updated successfully');
      } else {
        await api.post('/room/', formData);
        toast.success('Room created successfully');
      }
      setIsModalOpen(false);
      fetchRooms(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/room/${id}/`);
        toast.success('Room deleted');
        fetchRooms(pagination.page);
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const columns = [
    { header: 'Room No', accessor: 'room_number', className: 'font-bold text-slate-800' },
    { header: 'Type', accessor: 'room_type' },
    { header: 'Hostel ID', accessor: 'hostel' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Occupied', accessor: 'occupied' },
    { 
        header: 'Available Beds', 
        render: (row) => row.capacity - row.occupied 
    },
    { 
        header: 'Status', 
        render: (row) => {
            const isFull = row.occupied >= row.capacity;
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    isFull ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                }`}>
                    {isFull ? 'FULL' : 'AVAILABLE'}
                </span>
            );
        }
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
            onClick={() => handleDelete(row.id)}
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
          <h2 className="text-2xl font-bold text-slate-800">Rooms</h2>
          <p className="text-sm text-slate-500">Manage all hostel rooms and capacity</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={pagination}
        onPageChange={fetchRooms}
        emptyMessage="No rooms found."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Room Number"
            name="room_number"
            register={register}
            rules={{ required: 'Room number is required', maxLength: 10 }}
            error={errors.room_number}
          />
          
          <SelectField
            label="Hostel"
            name="hostel"
            register={register}
            rules={{ required: 'Hostel is required', valueAsNumber: true }}
            error={errors.hostel}
            options={hostels.map(h => ({ value: h.id, label: h.name }))}
            placeholder="Select a hostel"
          />

          <SelectField
            label="Room Type"
            name="room_type"
            register={register}
            rules={{ required: 'Room type is required' }}
            error={errors.room_type}
            options={[
              { value: 'SINGLE', label: 'Single' },
              { value: 'DOUBLE', label: 'Double' },
              { value: 'TRIPLE', label: 'Triple' }
            ]}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Capacity"
              name="capacity"
              type="number"
              register={register}
              rules={{ required: 'Capacity is required', min: 1, valueAsNumber: true }}
              error={errors.capacity}
            />
            
            <InputField
              label="Occupied"
              name="occupied"
              type="number"
              register={register}
              rules={{ required: 'Occupied count is required', min: 0, valueAsNumber: true }}
              error={errors.occupied}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
