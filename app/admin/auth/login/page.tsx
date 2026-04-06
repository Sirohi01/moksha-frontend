'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI, setToken } from '@/lib/api';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight, MessageCircle, Smartphone, Leaf, Star, Sparkles } from "lucide-react";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    otp: ''
  });
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mobileMasked, setMobileMasked] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('moksha_admin_session');
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedEmail = formData.email.toLowerCase().trim();
      const data = await authAPI.login(normalizedEmail, formData.password);

      if (data.success) {
        if (data.require2FA) {
          // Update email state with the official ones returned by server (normalizes dots/case)
          setFormData(prev => ({ ...prev, email: data.data.email }));
          setOtpSent(true);
          setMobileMasked(data.data.mobileMasked);
          setCountdown(60);
        } else {
          setToken(data.data.token);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          router.push('/admin/dashboard');
        }
      } else {
        setError(data.message || 'Credentials Mismatch');
      }
    } catch (error: any) {
      console.error("Login Handshake Failure:", error);
      setError(error.message || 'Network Relay Error: Server Unreachable');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMobileOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobile) {
      setError('Please provide registered mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authAPI.sendLoginOTP(formData.mobile);
      if (data.success) {
        setOtpSent(true);
        setMobileMasked(formData.mobile.replace(/.(?=.{4})/g, '*'));
        setCountdown(60);
      } else {
        setError(data.message || 'Mobile verification failed');
      }
    } catch (error: any) {
      setError(error.message || 'OTP server unreachable');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      setError('Please provide security code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let data;
      if (loginMode === 'otp') {
        data = await authAPI.loginWithOTP(formData.mobile, formData.otp);
      } else {
        data = await authAPI.verify2FA(formData.email, formData.otp);
      }

      if (data.success) {
        setToken(data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid Secure Key');
      }
    } catch (error: any) {
      console.error("Auth Failure:", error);
      setError(error.message || 'Protocol Error during Secure Handshake');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex overflow-hidden font-sans relative">

      {/* BACKGROUND AURA (Left) */}
      <div className="hidden lg:block w-7/12 h-screen relative overflow-hidden">
        <Image
          src="/auth-bg.png"
          alt="Moksha Background"
          fill
          className="object-contain animate-slow-zoom brightness-105"
          priority
        />
        {/* Premium Overlay Filter */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-white/40 to-white/90"></div>

        <div className="absolute top-1/2 left-20 -translate-y-1/2 z-20 space-y-12 animate-slide-left">
          <div className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-xl">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">Global Admin Node</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-[120px] font-serif font-black text-slate-900 tracking-tighter leading-[0.85] italic opacity-85 select-none hover:opacity-100 transition-opacity">
              Serving <br /> <span className="text-amber-600 not-italic">Light.</span>
            </h1>
          </div>

          <p className="text-slate-500 text-2xl font-medium max-w-[400px] leading-relaxed italic border-l-4 border-amber-600/30 pl-8">
            "Empowering the world's most compassionate logistics through technology."
          </p>
        </div>
      </div>

      {/* LOGIN CARD (Right Section Overlapping) */}
      <div className="flex-1 flex items-center justify-center relative p-4 sm:p-8">
        {/* Subtle Glow behind Card for Mobile */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)] lg:hidden"></div>

        <div className="w-full max-w-xl relative group animate-scale-up">

          {/* The Main High-End Glass Terminal Card */}
          <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-16 shadow-[0_50px_100px_rgba(15,23,42,0.1)] border-4 border-white relative overflow-hidden ring-1 ring-slate-100 transition-all duration-700">

            {/* Animated Gold Aura in Top Corner */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>

            {/* Branding Header inside Card */}
            <div className="text-center mb-10 sm:mb-16 space-y-4">
              <div className="relative inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-full blur-lg"></div>
                <Image src="/logo.png" alt="Moksha" width={72} height={72} className="relative z-10 w-12 h-12 sm:w-18 sm:h-18" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight uppercase">Admin <span className="text-amber-600">Login</span></h2>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Please enter your credentials below</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 sm:mb-8 bg-red-600 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-4 animate-shake shadow-lg shadow-red-600/10">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide leading-tight">{error}</span>
              </div>
            )}

            {!otpSent ? (
               <form onSubmit={loginMode === 'password' ? handleInitialSubmit : handleSendMobileOTP} className="space-y-6 sm:space-y-8 animate-fade-in relative z-10">
                  {loginMode === 'password' ? (
                    <>
                      <div className="space-y-2 sm:space-y-4">
                        <div className="flex justify-between items-center px-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                           <Star className="w-4 h-4 text-slate-100 group-hover:text-amber-300 transition-colors" />
                        </div>
                        <input
                          type="email"
                          required
                          className="w-full h-15 sm:h-18 px-6 sm:px-8 bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl sm:rounded-3xl focus:border-amber-600 focus:bg-white focus:ring-8 focus:ring-amber-100/30 outline-none transition-all text-base sm:text-lg font-bold text-slate-800 placeholder:text-slate-200"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-4">
                        <div className="flex justify-between items-center px-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Password</label>
                           <button type="button" onClick={() => setLoginMode('otp')} className="text-[11px] font-black uppercase text-amber-600 hover:text-slate-900 transition-all">Forgot?</button>
                        </div>
                        <div className="relative">
                           <input
                             type={showPassword ? "text" : "password"}
                             required
                             className="w-full h-15 sm:h-18 px-6 sm:px-8 pr-16 bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl sm:rounded-3xl focus:border-amber-600 focus:bg-white focus:ring-8 focus:ring-amber-100/30 outline-none transition-all text-base sm:text-lg font-bold text-slate-800 placeholder:text-slate-200"
                             placeholder="••••••••••••"
                             value={formData.password}
                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           />
                           <button
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                           >
                             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                           </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 sm:space-y-4">
                      <div className="flex justify-between items-center px-2">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">WhatsApp Mobile Number</label>
                         <Smartphone className="w-4 h-4 text-amber-500" />
                      </div>
                      <input
                        type="tel"
                        required
                        className="w-full h-15 sm:h-18 px-6 sm:px-8 bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl sm:rounded-3xl focus:border-amber-600 focus:bg-white focus:ring-8 focus:ring-amber-100/30 outline-none transition-all text-base sm:text-lg font-bold text-slate-800 placeholder:text-slate-200"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 italic">We'll send a secure login key to your WhatsApp.</p>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-16 sm:h-20 bg-slate-950 text-white rounded-2xl sm:rounded-[2rem] font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-xs sm:text-sm shadow-2xl hover:bg-amber-600 transition-all duration-300 transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4 relative group"
                    >
                      {loading ? (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>{loginMode === 'password' ? 'Authorize Session' : 'Get Access Key'}</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-500 shrink-0" />
                        </>
                      )}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setLoginMode(loginMode === 'password' ? 'otp' : 'password')}
                      className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors"
                    >
                      {loginMode === 'password' ? 'Login with WhatsApp OTP' : 'Back to Password Login'}
                    </button>
                  </div>
               </form>
            ) : (
              <div className="space-y-8 sm:space-y-12 animate-fade-in relative z-10 text-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-amber-600 shadow-2xl shadow-amber-600/30 rounded-full animate-bounce-slow">
                    <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Verification <span className="text-amber-600">Code</span></h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Sent to your WhatsApp: {mobileMasked}</p>
                </div>

                <form onSubmit={handleOTPSubmit} className="space-y-8 sm:space-y-10">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full h-16 sm:h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl sm:rounded-[1.5rem] text-3xl sm:text-4xl font-black text-slate-800 text-center tracking-[0.3em] sm:tracking-[0.4em] focus:border-amber-600 shadow-inner outline-none transition-all placeholder:text-slate-200"
                    placeholder="000000"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={loading || formData.otp.length < 6}
                      className="w-full h-16 sm:h-20 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl sm:rounded-[2rem] font-black uppercase tracking-widest sm:tracking-[0.3em] text-xs sm:text-sm shadow-2xl transition-all flex items-center justify-center gap-4"
                    >
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                      Verify & Login
                    </button>

                    <button
                      type="button"
                      disabled={countdown > 0}
                      className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-300 hover:text-amber-600 transition-colors"
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend code"}
                    </button>
                  </div>
                </form>

                <button
                  onClick={() => setOtpSent(false)}
                  className="text-[11px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-3 mx-auto"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to Login
                </button>
              </div>
            )}
          </div>

          {/* Status Footer */}
          <div className="mt-12 flex items-center justify-center gap-10 opacity-40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-900">System Ready</span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-900">Encryption Active</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 20s linear infinite alternate; }
        @keyframes slide-left { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-left { animation: slide-left 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scaleUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        
        .h-18 { height: 4.5rem; }
        input::placeholder { font-weight: 900; color: #f1f5f9; letter-spacing: 0.1em; }
        * { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}