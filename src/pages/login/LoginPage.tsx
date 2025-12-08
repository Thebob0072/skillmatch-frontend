import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { googleAuth } from '../../services/authService';
import { getCurrentUser } from '../../services/profileService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setError('');
      try {
        console.log('Google code received:', codeResponse.code);
        const result = await googleAuth({ code: codeResponse.code });
        console.log('Backend response:', result);
        console.log('Token:', result.token);
        
        // ตรวจสอบว่ามี token
        if (!result.token) {
          throw new Error('No token received from backend');
        }
        
        // เก็บ token ก่อน แล้วค่อย fetch user data
        localStorage.setItem('authToken', result.token);
        
        // Fetch ข้อมูล user ด้วย token
        const userData = await getCurrentUser();
        console.log('User data fetched:', userData);
        console.log('Profile picture URL:', userData.profile_picture_url);
        
        // เก็บ user data
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Log เพื่อ debug
        console.log('Token saved:', localStorage.getItem('authToken'));
        console.log('User saved:', localStorage.getItem('user'));
        
        // Reload หน้าเพื่อให้ AuthContext อ่านใหม่
        window.location.href = '/';
      } catch (err: any) {
        console.error('Google login error:', err);
        setError(err.response?.data?.message || err.message || 'Google login failed. Please try again.');
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google login was cancelled or failed.');
    },
  });

  return (
    <div className="flex items-center justify-center py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
      {/* Luxury Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-pink/20 via-transparent to-transparent animate-pulse pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neon-purple/10 via-transparent to-transparent animate-pulse pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-float drop-shadow-[0_0_40px_rgba(255,16,240,1)]">💋</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 sm:mb-3">
            <span style={{
              background: 'linear-gradient(to right, #ff10f0, #9d00ff, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'brightness(1.3)',
              display: 'inline-block'
            }}>
              {t('login_title') || 'Welcome Back'}
            </span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
            {t('login_title')}
          </p>
        </div>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-gradient-to-r from-neon-red/20 to-pink-900/20 backdrop-blur-xl border border-neon-red sm:border-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-[0_0_30px_rgba(255,0,85,0.4)]">
              <p className="text-neon-red text-sm sm:text-base font-bold flex items-center gap-2">
                <span className="text-xl sm:text-2xl">❌</span>
                {error}
              </p>
            </div>
          )}
          
          <div className="bg-black/50 backdrop-blur-2xl p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-neon-purple/30 sm:border-2 shadow-[0_0_40px_rgba(157,0,255,0.3)] sm:shadow-[0_0_60px_rgba(157,0,255,0.3)] space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-200 mb-2">
                {t('login_email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300"
                placeholder={t('login_email_placeholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-200 mb-2">
                {t('login_password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300"
                placeholder={t('login_password_placeholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-neon-purple/50 bg-black/50 text-neon-purple focus:ring-neon-purple focus:ring-offset-0"
                />
                <span className="text-gray-400 group-hover:text-white transition-colors">{t('login_remember_me') || 'Remember me'}</span>
              </label>
              <Link to="/forgot-password" className="text-neon-purple hover:text-neon-pink font-bold transition-colors">
                {t('login_forgot_password') || 'Forgot password?'}
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple text-white font-black text-xl py-5 rounded-[2rem] shadow-[0_0_40px_rgba(157,0,255,0.6)] hover:shadow-[0_0_60px_rgba(157,0,255,1)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-neon-purple/50"
            >
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {loading ? `⏳ ${t('login_loading')}` : `✨ ${t('login_button')}`}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-purple/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/50 text-gray-400 font-bold">OR</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="relative w-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-lg py-5 rounded-[2rem] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/50 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                {t('login_google') || 'Sign in with Google'}
              </span>
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/register" 
              className="text-neon-purple hover:text-neon-pink font-bold transition-colors duration-300"
              style={{textShadow: '0 0 20px rgba(157,0,255,0.6)'}}
            >
              {t('login_no_account')} <span className="underline">{t('register_button')}</span> →
            </Link>
          </div>

          {/* Security Notice */}
          <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-neon-gold/30">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔒</div>
              <div>
                <h4 className="text-neon-gold font-black text-sm mb-2">Secure Connection</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Your login is protected with 256-bit encryption. We never store your password in plain text and all communications are encrypted end-to-end.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
