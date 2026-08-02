import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { InputField } from '../components/FormFields';
import { Loader2, User as UserIcon } from 'lucide-react';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/user/');
      reset({
        username: response.data.username,
        email: response.data.email,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
      });
    } catch (error) {
      toast.error('Failed to load profile details.');
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.put('/auth/user/', {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      
      updateUserProfile({
        username: response.data.username,
      });
      
      toast.success('Profile updated successfully!');
      reset(data); // reset to new clean state
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="p-6 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">My Profile</h2>
            <p className="text-sm text-slate-500">Update your personal information</p>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Username"
                name="username"
                register={register}
                rules={{ required: 'Username is required' }}
                error={errors.username}
              />
              
              <InputField
                label="Email"
                name="email"
                type="email"
                register={register}
                disabled={true}
                placeholder="Email cannot be changed here"
                className="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              
              <InputField
                label="First Name"
                name="first_name"
                register={register}
                error={errors.first_name}
              />
              
              <InputField
                label="Last Name"
                name="last_name"
                register={register}
                error={errors.last_name}
              />
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading || !isDirty}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
