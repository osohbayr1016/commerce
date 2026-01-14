'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthInput from '@/components/Auth/AuthInput';
import PasswordInput from '@/components/Auth/PasswordInput';
import AuthButton from '@/components/Auth/AuthButton';
import { getErrorMessage } from '@/types';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, user, isAdmin } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(identifier, password);
      
      // Check if redirect is to admin and user is admin
      if (redirectUrl.startsWith('/admin') && isAdmin) {
        router.push(redirectUrl);
      } else if (redirectUrl.startsWith('/admin') && !isAdmin) {
        router.push('/');
      } else {
        router.push(redirectUrl);
      }
    } catch (err) {
      setError('И-мэйл/утасны дугаар эсвэл нууц үг буруу байна');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(getErrorMessage(err) || 'Google нэвтрэх үед алдаа гарлаа');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Нэвтрэх</h1>
          <p className="text-gray-600">Дахин тавтай морил</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              И-мэйл эсвэл утасны дугаар
            </label>
            <AuthInput
              type="text"
              placeholder="example@email.com эсвэл 99999999"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
            />
            <p className="mt-1 text-xs text-gray-500">
              Бүртгүүлсэн и-мэйл эсвэл утасны дугаараа оруулна уу
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нууц үг
            </label>
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="ml-2 text-gray-700">Намайг сана</span>
            </label>
            <Link href="/auth/forgot-password" className="text-gray-900 hover:underline">
              Нууц үг мартсан?
            </Link>
          </div>

          <AuthButton type="submit" loading={loading} disabled={loading}>
            Нэвтрэх
          </AuthButton>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">эсвэл</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <AuthButton
          variant="secondary"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google-ээр нэвтрэх
        </AuthButton>

        <p className="mt-6 text-center text-sm text-gray-600">
          Та бүртгэлгүй юу?{' '}
          <Link href="/auth/signup" className="text-gray-900 font-medium hover:underline">
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  );
}
