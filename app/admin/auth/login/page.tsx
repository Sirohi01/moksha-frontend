'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI, setToken } from '@/lib/api';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔍 Login attempt started');
    console.log('📧 Email:', formData.email);
    console.log('🔗 Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

    try {
      console.log('🚀 Calling authAPI.login...');
      const data = await authAPI.login(formData.email, formData.password);
      console.log('✅ Login response:', data);

      if (data.success) {
        // Store tokens
        setToken(data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        
        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-400 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header with Enhanced Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-white rounded-full shadow-lg p-3 border-4 border-orange-100">
              <Image
                src="/logo.png"
                alt="Moksha Seva Logo"
                fill
                className="object-contain p-2"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Moksha Seva
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Portal</h2>
          <p className="text-gray-600">Secure access to dashboard and management tools</p>
        </div>

        {/* Enhanced Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full pl-12 pr-4 py-3 h-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="admin@mokshaseva.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className="w-full pl-12 pr-12 py-3 h-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/admin/auth/forgot-password" 
              className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Secure SSL Connection • Auto-logout in 24 hours</span>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-sm text-gray-500">
            Need assistance? Contact our support team
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a 
              href="mailto:it@moksha-seva.org" 
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
            >
              it@moksha-seva.org
            </a>
            <span className="text-gray-300">|</span>
            <a 
              href="tel:+919773992516" 
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
            >
              +91 97739 92516
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-1">
            <Lock className="w-4 h-4" />
            Secure admin access only
          </p>
          <p>Unauthorized access is prohibited</p>
        </div>
      </div>
    </div>
  );
}