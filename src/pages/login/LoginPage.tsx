import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { googleAuth } from '../../services/authService';
import { getCurrentUser } from '../../services/profileService';
import AgeVerificationModal from '../../components/AgeVerificationModal';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [pendingGoogleAuth, setPendingGoogleAuth] = useState<{ token: string; user: any } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err: unknown) {
      const errorCode = err.response?.data?.error_code;
      const errorMsg = errorCode ? t(`errors:${errorCode}`) : (err.response?.data?.error || t('errors:INVALID_CREDENTIALS'));
      setError(errorMsg);
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
        const result = await googleAuth({ code: codeResponse.code });
        
        // ตรวจสอบว่ามี token
        if (!result.token) {
          throw new Error('No token received from backend');
        }
        
        // เก็บ token ก่อน แล้วค่อย fetch user data
        localStorage.setItem('authToken', result.token);
        
        // Fetch ข้อมูล user ด้วย token
        const userData = await getCurrentUser();
        
        // เก็บ user data
        localStorage.setItem('user', JSON.stringify(userData));
        
        // อัพเดท AuthContext ให้รู้ว่า user ล็อกอินแล้ว
        updateUser(userData);
        
        // เก็บข้อมูลไว้แล้วแสดง age verification
        setPendingGoogleAuth({ token: result.token, user: userData });
        setShowAgeVerification(true);
        setLoading(false);
      } catch (err: unknown) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Google login error');
        }
        // Check if Google OAuth is unavailable (503)
        const errorResponse = (err && typeof err === 'object' && 'response' in err ? (err as any).response : undefined) as any;
        if (errorResponse?.status === 503) {
          setError(t('errors:GOOGLE_UNAVAILABLE') || 'Google Sign-In is temporarily unavailable. Please use Email/Password login below.');
        } else {
          let errorMsg = t('errors:UNKNOWN_ERROR');
          if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response) {
            const data = err.response as { error_code?: string; error?: string };
            const errorCode = data.error_code;
            errorMsg = errorCode ? t(`errors:${errorCode}`) : (data.error || errorMsg);
          }
          setError(errorMsg);
        }
        setLoading(false);
      }
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Google OAuth error');
      }
      setError(t('errors:UNKNOWN_ERROR'));
    },
  });

  return (
    <div className="flex items-center justify-center py-4 sm:py-10 lg:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
      {/* Luxury Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-pink/20 via-transparent to-transparent animate-pulse pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neon-purple/10 via-transparent to-transparent animate-pulse pointer-events-none"></div>

      <div className="max-w-md w-full space-y-3 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="text-3xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4 animate-float drop-shadow-[0_0_40px_rgba(255,16,240,1)]">💋</div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-1 sm:mb-3">
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
          <p className="text-gray-300 text-sm sm:text-lg" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
            {t('login_title')}
          </p>
        </div>

        <form className="space-y-3 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-gradient-to-r from-neon-red/20 to-pink-900/20 backdrop-blur-xl border border-neon-red sm:border-2 px-3 sm:px-6 py-2 sm:py-4 rounded-lg sm:rounded-xl shadow-[0_0_30px_rgba(255,0,85,0.4)]">
              <p className="text-neon-red text-xs sm:text-base font-bold flex items-center gap-2">
                <span className="text-lg sm:text-2xl">❌</span>
                {error}
              </p>
            </div>
          )}
          
          <div className="bg-black/50 backdrop-blur-2xl p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-3xl border border-neon-purple/30 sm:border-2 shadow-[0_0_40px_rgba(157,0,255,0.3)] sm:shadow-[0_0_60px_rgba(157,0,255,0.3)] space-y-3 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-200 mb-1.5 sm:mb-2">
                {t('login_email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300"
                placeholder={t('login_email_placeholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-200 mb-1.5 sm:mb-2">
                {t('login_password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300"
                placeholder={t('login_password_placeholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-neon-purple/50 bg-black/50 text-neon-purple focus:ring-neon-purple focus:ring-offset-0"
                />
                <span className="text-gray-400 group-hover:text-white transition-colors whitespace-nowrap">{t('login_remember_me') || 'Remember me'}</span>
              </label>
              <Link to="/forgot-password" className="text-neon-purple hover:text-neon-pink font-bold transition-colors whitespace-nowrap">
                {t('login_forgot_password') || 'Forgot?'}
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple rounded-xl sm:rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple text-white font-black text-base sm:text-xl py-3 sm:py-5 rounded-xl sm:rounded-[2rem] shadow-[0_0_40px_rgba(157,0,255,0.6)] hover:shadow-[0_0_60px_rgba(157,0,255,1)] active:scale-95 sm:hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-neon-purple/50"
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
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white rounded-xl sm:rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="relative w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-bold text-sm sm:text-lg py-3 sm:py-5 rounded-xl sm:rounded-[2rem] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95 sm:hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/50 flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
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
              className="text-neon-purple hover:text-neon-pink font-bold transition-colors duration-300 text-sm sm:text-base"
              style={{textShadow: '0 0 20px rgba(157,0,255,0.6)'}}
            >
              {t('login_no_account')} <span className="underline">{t('register_button')}</span> →
            </Link>
          </div>

          {/* Security Notice */}
          <div className="bg-black/30 backdrop-blur-xl p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-neon-gold/30">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-xl sm:text-3xl">🔒</div>
              <div>
                <h4 className="text-neon-gold font-black text-xs sm:text-sm mb-1 sm:mb-2">Secure Connection</h4>
                <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed">
                  Your login is protected with 256-bit encryption. We never store your password in plain text and all communications are encrypted end-to-end.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {showAgeVerification && pendingGoogleAuth && (
        <AgeVerificationModal
          isOpen={showAgeVerification}
          onConfirm={() => {
            setShowAgeVerification(false);
            navigate('/');
          }}
          onCancel={() => {
            setShowAgeVerification(false);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }}
        />
      )}
    </div>
  );
};

export default LoginPage;
