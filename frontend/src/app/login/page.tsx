'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  LoginHeader,
  PasswordInput,
  ErrorAlert,
  TestCredentials,
  LoginFooter,
} from './components';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Имэйл/Нэр болон нууц үг шаардлагатай');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login with email:', email);
      const response = await authApi.login(email, password);
      console.log('Login response:', response.data);

      // Save user and token
      login(response.data.user, response.data.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Check if it's a password/authentication error
      if (err.response?.status === 401) {
        setError('Имэйл/нэр эсвэл нууц үг буруу байна. Дахин оролдоно уу.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Нэвтрэх боломжгүй байна. Нэвтрэх мэдээллээ шалгаад дахин оролдоно уу.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl sm:max-w-lg border border-gray-100 mx-auto">
        <LoginHeader />

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email or Name */}
          <Input
            label="Имэйл эсвэл Нэр"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Имэйл эсвэл нэр"
            required
            autoFocus
          />

          {/* Password */}
          <PasswordInput
            value={password}
            onChange={setPassword}
            label="Нууц үг"
            placeholder="Нууц үгээ оруулна уу"
            required
          />

          {/* Error Message */}
          <ErrorAlert message={error} />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl py-2.5! sm:py-3! lg:py-3.5!"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base lg:text-lg">Нэвтэрч байна...</span>
              </>
            ) : (
              <span className="text-sm sm:text-base lg:text-lg">Нэвтрэх</span>
            )}
          </Button>
        </form>

        {/* Test Credentials Info */}
        <TestCredentials />

        {/* Footer Info */}
        <LoginFooter />
      </div>
    </div>
  );
}
