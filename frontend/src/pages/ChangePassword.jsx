import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { InputField } from '../components/FormFields';
import { Loader2, KeyRound } from 'lucide-react';

export default function ChangePassword() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateMustChangePassword } = useAuth();
  
  const newPassword1 = watch("new_password1");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/password/change/', {
        new_password1: data.new_password1,
        new_password2: data.new_password2
      });
      
      toast.success('Password changed successfully!');
      updateMustChangePassword(false);
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to change password.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="h-12 w-12 bg-amber-500 text-white rounded-full mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900">
            Security Required
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            You must change your password before continuing.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-soft sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="New Password"
              name="new_password1"
              type="password"
              register={register}
              rules={{ 
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
              }}
              error={errors.new_password1}
              placeholder="••••••••"
            />
            
            <InputField
              label="Confirm New Password"
              name="new_password2"
              type="password"
              register={register}
              rules={{ 
                  required: 'Please confirm your new password',
                  validate: value => value === newPassword1 || "Passwords do not match"
              }}
              error={errors.new_password2}
              placeholder="••••••••"
            />

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
