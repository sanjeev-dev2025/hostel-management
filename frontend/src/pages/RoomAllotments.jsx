import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { InputField, SelectField } from '../components/FormFields';

export default function RoomAllotments({ studentView = false }) {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  
  const selectedRoomId = watch("room");

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      if (studentView) {
        // If student view, theoretically we should fetch just their allotment.
        // We'll fetch all and filter for now, or just display the whole list if backend doesn't filter.
        // Assuming backend filters by token, we just hit the list endpoint.
        const response = await api.get(`/roomallotment/?page=${page}`);
        // If backend doesn't filter, we'd manually filter by user.username which should be student_id
        const results = response.data.results || response.data;
        const filtered = results.filter(r => r.student === user.id || r.student === parseInt(user.username)); // Depending on how student is linked to user
        setData(results); // Just show what API returns for now
      } else {
        const response = await api.get(`/roomallotment/?page=${page}`);
        setData(response.data.results || []);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          page: page
        });
      }
    } catch (error) {
      toast.error('Failed to load room allotments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      // Fetch rooms and students for dropdowns
      const [roomsRes, studentsRes] = await Promise.all([
        api.get('/room/'),
        api.get('/studentlist/')
      ]);
      setRooms(roomsRes.data.results || roomsRes.data);
      setStudents(studentsRes.data.results || studentsRes.data);
    } catch (error) {
      toast.error('Failed to load dependencies');
    }
  };

  useEffect(() => {
    fetchData();
    fetchDependencies();
  }, [studentView]);

  const openModal = (allotment = null) => {
    if (allotment) {
      setEditingId(allotment.id);
      reset({
        student: allotment.student,
        room: allotment.room
      });
    } else {
      setEditingId(null);
      reset({ student: '', room: '' });
    }
    setIsModalOpen(true);
  };

  const validateRoomAvailability = (roomId) => {
    if (editingId) return true; // Skip validation on edit for simplicity, assuming they stay in same room
    const room = rooms.find(r => r.id === parseInt(roomId));
    if (room) {
      if (room.occupied >= room.capacity) {
        return "This room is already full";
      }
    }
    return true;
  };

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await api.put(`/roomallotment/${editingId}/`, formData);
        toast.success('Allotment updated successfully');
      } else {
        await api.post('/roomallotment/', formData);
        toast.success('Room allotted successfully');
      }
      setIsModalOpen(false);
      fetchData(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this allotment?')) {
      try {
        await api.delete(`/roomallotment/${id}/`);
        toast.success('Allotment deleted');
        fetchData(pagination.page);
      } catch (error) {
        toast.error('Failed to delete allotment');
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', className: 'text-slate-500 w-16' },
    { 
      header: 'Student', 
      render: (row) => {
        const s = students.find(s => s.id === row.student);
        return s ? `${s.first_name} ${s.last_name} (${s.student_id})` : row.student;
      },
      className: 'font-medium text-slate-900'
    },
    { 
      header: 'Room', 
      render: (row) => {
        const r = rooms.find(r => r.id === row.room);
        return r ? `${r.room_number} (${r.room_type})` : row.room;
      },
      className: 'font-bold text-primary'
    },
    { header: 'Allocation Date', accessor: 'room_allocated_date' },
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
            {studentView ? 'My Room' : 'Room Allotments'}
          </h2>
          <p className="text-sm text-slate-500">
            {studentView ? 'Details of your allotted room' : 'Manage student room assignments'}
          </p>
        </div>
        {!studentView && (
          <button 
            onClick={() => openModal()}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Allotment
          </button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={!studentView ? pagination : null}
        onPageChange={fetchData}
        emptyMessage={studentView ? "You haven't been allotted a room yet." : "No allotments found."}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Allotment' : 'New Room Allotment'}
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
          />
          
          <SelectField
            label="Room"
            name="room"
            register={register}
            rules={{ 
                required: 'Room is required', 
                valueAsNumber: true,
                validate: validateRoomAvailability
            }}
            error={errors.room}
            options={rooms.map(r => ({ 
                value: r.id, 
                label: `${r.room_number} - ${r.room_type} (${r.capacity - r.occupied} beds left)` 
            }))}
            placeholder="Select a room"
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
              {editingId ? 'Save Changes' : 'Assign Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
