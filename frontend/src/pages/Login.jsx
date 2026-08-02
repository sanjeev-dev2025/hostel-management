import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { InputField } from '../components/FormFields';
import { Loader2, LogIn } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login/', {
        username: data.username,
        password: data.password
      });
      
      const { access, refresh, access_token, refresh_token, id, username, role, must_change_password } = response.data;
      
      const accessToken = access || access_token;
      const refreshToken = refresh || refresh_token;
      
      const profile = {
        id,
        username,
        role,
        must_change_password
      };
      
      login(profile, accessToken, refreshToken);
      toast.success('Login successful!');
      
      if (profile?.must_change_password && profile?.role === 'STUDENT') {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="h-16 w-16 bg-primary text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30">
            <LogIn className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Hostel Management System
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Sign in to access the management system
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Username"
              name="username"
              register={register}
              rules={{ required: 'Username is required' }}
              error={errors.username}
              placeholder="Enter your username"
            />
            
            <InputField
              label="Password"
              name="password"
              type="password"
              register={register}
              rules={{ required: 'Password is required' }}
              error={errors.password}
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
