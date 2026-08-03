import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { InputField, SelectField, TextAreaField } from '../components/FormFields';

export default function Students() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStudents = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const endpoint = search 
        ? `/studentlist/?page=${page}&search=${encodeURIComponent(search)}` 
        : `/studentlist/?page=${page}`;
      const response = await api.get(endpoint);
      
      setData(response.data.results || []);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: page
      });
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (student = null) => {
    if (student) {
      setEditingId(student.student_id);
      reset({
        first_name: student.first_name,
        last_name: student.last_name,
        address: student.address,
        phone_number: student.phone_number,
        parents_name: student.parents_name,
        parents_phone_number: student.parents_phone_number,
        gender: student.gender,
        date_of_birth: student.date_of_birth,
        date_of_admission: student.date_of_admission,
        faculty: student.faculty,
        is_active: student.is_active
      });
    } else {
      setEditingId(null);
      reset({ 
        first_name: '', last_name: '', address: '', phone_number: '', 
        parents_name: '', parents_phone_number: '', gender: 'MALE', 
        faculty: 'BIT',
        date_of_birth: '', date_of_admission: new Date().toISOString().split('T')[0], 
        is_active: true 
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = (student) => {
    setViewStudent(student);
    setIsViewModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await api.put(`/studentlist/${editingId}/`, formData);
        toast.success('Student updated successfully');
      } else {
        const response = await api.post('/studentlist/', formData);
        const tempPass = response.data.temporary_password;
        toast.success(`Student created! Temporary Password: ${tempPass}`, {
          autoClose: false,
          closeOnClick: false,
          draggable: false
        });
        // Also log it or alert it to be absolutely sure they see it
        alert(`Student created successfully!\n\nUsername: ${formData.first_name}\nTemporary Password: ${tempPass}\n\nPlease save this password and provide it to the student.`);
      }
      setIsModalOpen(false);
      fetchStudents(pagination.page, searchQuery);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/studentlist/${id}/`);
        toast.success('Student deleted');
        fetchStudents(pagination.page, searchQuery);
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const columns = [
    { header: 'Student ID', accessor: 'student_id', className: 'font-mono text-primary font-medium' },
    { 
        header: 'Name', 
        render: (row) => `${row.first_name} ${row.last_name}` 
    },
    { header: 'Faculty', accessor: 'faculty' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Phone', accessor: 'phone_number' },
    { header: 'Admitted', accessor: 'date_of_admission' },
    { 
        header: 'Status', 
        render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                row.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}>
                {row.is_active ? 'Active' : 'Inactive'}
            </span>
        )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => openViewModal(row)}
            className="p-1 text-slate-400 hover:text-primary transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => openModal(row)}
            className="p-1 text-slate-400 hover:text-primary transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.student_id)}
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
          <h2 className="text-2xl font-bold text-slate-800">Students</h2>
          <p className="text-sm text-slate-500">Manage student records and admissions</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchStudents(page, searchQuery)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        emptyMessage="No students found."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Student' : 'Add New Student'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="first_name"
              register={register}
              rules={{ required: 'First name is required', maxLength: 40 }}
              error={errors.first_name}
            />
            <InputField
              label="Last Name"
              name="last_name"
              register={register}
              rules={{ required: 'Last name is required', maxLength: 40 }}
              error={errors.last_name}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Phone Number"
              name="phone_number"
              register={register}
              rules={{ required: 'Phone is required', maxLength: 10 }}
              error={errors.phone_number}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Faculty"
              name="faculty"
              register={register}
              rules={{ required: 'Faculty is required' }}
              error={errors.faculty}
              options={[
                { value: 'BIT', label: 'BIT' },
                { value: 'BSCSIT', label: 'BSc.CSIT' },
                { value: 'BCA', label: 'BCA' },
                { value: 'BIM', label: 'BIM' },
                { value: 'BBS', label: 'BBS' },
                { value: 'BBA', label: 'BBA' },
                { value: 'BBM', label: 'BBM' },
                { value: 'BND', label: 'BND' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              register={register}
              rules={{ required: 'DOB is required' }}
              error={errors.date_of_birth}
            />
            <InputField
              label="Admission Date"
              name="date_of_admission"
              type="date"
              register={register}
              rules={{ required: 'Admission date is required' }}
              error={errors.date_of_admission}
            />
          </div>

          <TextAreaField
            label="Address"
            name="address"
            register={register}
            rules={{ required: 'Address is required', maxLength: 50 }}
            error={errors.address}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Parents Name"
              name="parents_name"
              register={register}
              rules={{ required: 'Parents name is required', maxLength: 40 }}
              error={errors.parents_name}
            />
            <InputField
              label="Parents Phone"
              name="parents_phone_number"
              register={register}
              rules={{ required: 'Parents phone is required', maxLength: 10 }}
              error={errors.parents_phone_number}
            />
          </div>
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-slate-700">
              Active Student
            </label>
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
              {editingId ? 'Save Changes' : 'Create Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Student Details"
      >
        {viewStudent && (
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Student ID</span>
              <span className="font-mono font-bold text-primary">{viewStudent.student_id}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{viewStudent.first_name} {viewStudent.last_name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Faculty</span>
              <span className="font-medium text-slate-900">{viewStudent.faculty}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Gender</span>
              <span className="font-medium text-slate-900">{viewStudent.gender}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium text-slate-900">{viewStudent.phone_number}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">DOB</span>
              <span className="font-medium text-slate-900">{viewStudent.date_of_birth}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Address</span>
              <span className="font-medium text-slate-900 text-right max-w-[200px]">{viewStudent.address}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Parents</span>
              <span className="font-medium text-slate-900">{viewStudent.parents_name} ({viewStudent.parents_phone_number})</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-slate-500">Admission Date</span>
              <span className="font-medium text-slate-900">{viewStudent.date_of_admission}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
