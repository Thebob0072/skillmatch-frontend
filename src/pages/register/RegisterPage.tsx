import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ThaiCalendar from '../../components/ui/ThaiCalendar';
import { googleAuth } from '../../services/authService';
import { getCurrentUser } from '../../services/profileService';
import AgeVerificationModal from '../../components/AgeVerificationModal';

// Registration Success Component
const RegistrationSuccess: React.FC<{
  userEmail: string;
  isProvider: boolean;
  onContinue: () => void;
}> = ({ userEmail, isProvider, onContinue }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center py-4 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
      {/* Luxury Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-green/20 via-transparent to-transparent animate-pulse pointer-events-none"></div>
      
      <div className="max-w-lg w-full space-y-4 sm:space-y-8 relative z-10">
        {/* Success Icon */}
        <div className="text-center">
          <div className="text-5xl sm:text-8xl mb-3 sm:mb-6 animate-bounce">🎉</div>
          <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-4">
            <span style={{
              background: 'linear-gradient(to right, #00ff88, #00d4ff, #9d00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {t('register_success_title') || 'Welcome!'}
            </span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-lg">{t('register_success_subtitle') || 'Your account has been created successfully'}</p>
        </div>
        
        {/* Verification Status Card */}
        <div className="bg-black/50 backdrop-blur-2xl p-4 sm:p-8 rounded-xl sm:rounded-3xl border border-neon-green/30 sm:border-2 shadow-[0_0_60px_rgba(0,255,136,0.2)] space-y-3 sm:space-y-6">
          <h3 className="text-base sm:text-xl font-bold text-white text-center mb-2 sm:mb-4">
            {t('register_verification_status') || 'Verification Status'}
          </h3>
          
          {/* Email Verification */}
          <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg sm:rounded-xl border border-green-500/30">
            <div className="text-xl sm:text-3xl">📧</div>
            <div className="flex-1">
              <div className="font-bold text-white text-sm sm:text-base">{t('register_email_verification') || 'Email Verification'}</div>
              <div className="text-xs sm:text-sm text-green-400">{t('register_email_completed') || 'Completed - Ready to use'}</div>
            </div>
            <div className="text-lg sm:text-2xl">✓</div>
          </div>
          
          {/* Age Verification */}
          <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg sm:rounded-xl border border-green-500/30">
            <div className="text-xl sm:text-3xl">✅</div>
            <div className="flex-1">
              <div className="font-bold text-white text-sm sm:text-base">{t('register_age_verification') || 'Age Verification'}</div>
              <div className="text-xs sm:text-sm text-green-400">{t('register_age_confirmed') || 'Confirmed - 20+ years old'}</div>
            </div>
            <div className="text-lg sm:text-2xl">✓</div>
          </div>
          
          {/* Provider-specific verifications */}
          {isProvider && (
            <>
              {/* ID Verification */}
              <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg sm:rounded-xl border border-blue-500/30">
                <div className="text-xl sm:text-3xl">🪪</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm sm:text-base">{t('register_id_verification') || 'ID Verification'}</div>
                  <div className="text-xs sm:text-sm text-blue-400">{t('register_id_required') || 'Required - Upload ID card'}</div>
                </div>
                <div className="text-lg sm:text-2xl">📤</div>
              </div>
              
              {/* Face Verification */}
              <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg sm:rounded-xl border border-purple-500/30">
                <div className="text-xl sm:text-3xl">🤳</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm sm:text-base">{t('register_face_verification') || 'Face Verification'}</div>
                  <div className="text-xs sm:text-sm text-purple-400">{t('register_face_required') || 'Required - Selfie with ID'}</div>
                </div>
                <div className="text-lg sm:text-2xl">📷</div>
              </div>
            </>
          )}
          
          {/* Account ready notice */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-500/30">
            <p className="text-xs sm:text-sm text-gray-300 text-center">
              ✅ {t('register_account_ready') || 'Your account is ready!'}{' '}
              <span className="font-bold text-green-400">{userEmail}</span>
            </p>
          </div>
        </div>
        
        {/* Continue Button */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple rounded-xl sm:rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <button
            onClick={onContinue}
            className="relative w-full bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple text-white font-black text-base sm:text-xl py-3 sm:py-5 rounded-xl sm:rounded-[2rem] shadow-[0_0_40px_rgba(0,255,136,0.6)] hover:shadow-[0_0_60px_rgba(0,255,136,1)] active:scale-95 sm:hover:scale-105 transition-all duration-300 border-2 border-neon-green/50"
          >
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {isProvider 
                ? (t('register_continue_verification') || 'Continue to Verification →')
                : (t('register_start_browsing') || 'Start Browsing →')}
            </span>
          </button>
        </div>
        
        {/* Provider tip */}
        {isProvider && (
          <div className="bg-gradient-to-r from-neon-gold/10 to-neon-pink/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-neon-gold/30">
            <p className="text-xs sm:text-sm text-gray-300 text-center">
              💡 <span className="text-neon-gold font-bold">{t('register_provider_tip_title') || 'Tip:'}</span>{' '}
              {t('register_provider_tip') || 'Complete verification to unlock all provider features and start receiving bookings!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'client' as 'client' | 'provider',
  });
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredAsProvider, setRegisteredAsProvider] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  // Google Sign Up handler
  const handleGoogleSignUp = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      // Check terms first
      if (!ageConfirmed) {
        setError(t('register_must_confirm_age') || 'Please confirm you are 20+ years old');
        return;
      }
      if (!agreedToTerms) {
        setError(t('register_must_agree_terms') || 'Please agree to the terms');
        return;
      }
      if (!agreedToPrivacy) {
        setError(t('register_must_agree_privacy') || 'Please agree to the privacy policy');
        return;
      }

      setLoading(true);
      setError('');
      try {
        // Include role in Google OAuth request
        const result = await googleAuth({ 
          code: codeResponse.code,
          role: formData.role // Pass the selected role to backend
        });
        
        if (!result.token) {
          throw new Error('No token received');
        }
        
        localStorage.setItem('authToken', result.token);
        const userData = await getCurrentUser();
        localStorage.setItem('user', JSON.stringify(userData));
        
        // แสดง age verification แทน success page
        setShowAgeVerification(true);
        setLoading(false);
      } catch (err: unknown) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Google signup error');
        }
        let errorMsg = t('errors:UNKNOWN_ERROR');
        if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response) {
          const data = err.response as { error_code?: string; error?: string; message?: string };
          const errorCode = data.error_code;
          errorMsg = errorCode ? t(`errors:${errorCode}`) : (data.error || data.message || errorMsg);
        } else if (err instanceof Error) {
          errorMsg = err.message || errorMsg;
        }
        setError(errorMsg);
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

  const calculateAge = (birth: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Age validation
    if (!birthdate) {
      setError(t('register_birthdate_placeholder'));
      return;
    }

    const age = calculateAge(birthdate);
    if (age < 20) {
      setError(t('register_age_error'));
      return;
    }

    // Terms validation
    if (!agreedToTerms) {
      setError(t('register_must_agree_terms'));
      return;
    }

    if (!agreedToPrivacy) {
      setError(t('register_must_agree_privacy'));
      return;
    }

    if (!ageConfirmed) {
      setError(t('register_must_confirm_age'));
      return;
    }

    setLoading(true);

    try {
      await register({
        ...formData,
        birthdate: birthdate.toISOString().split('T')[0]
      });
      // Show success page instead of navigating
      setRegisteredEmail(formData.email);
      setRegisteredAsProvider(formData.role === 'provider');
      setRegistrationComplete(true);
    } catch (err: unknown) {
      const errorCode = err.response?.data?.error_code;
      const errorMsg = errorCode ? t(`errors:${errorCode}`) : (err.response?.data?.error || t('errors:USER_CREATE_ERROR'));
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (registeredAsProvider) {
      navigate('/provider/onboarding');
    } else {
      navigate('/');
    }
  };

  // Show success page after registration
  if (registrationComplete) {
    return (
      <RegistrationSuccess
        userEmail={registeredEmail}
        isProvider={registeredAsProvider}
        onContinue={handleContinue}
      />
    );
  }

  return (
    <div className="flex items-center justify-center py-4 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Luxury Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-pink/20 via-transparent to-transparent animate-pulse pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neon-purple/10 via-transparent to-transparent animate-pulse pointer-events-none"></div>

      <div className="max-w-2xl w-full space-y-4 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="text-3xl sm:text-6xl mb-2 sm:mb-4 animate-float drop-shadow-[0_0_40px_rgba(255,16,240,1)]">💋</div>
          <h2 className="text-2xl sm:text-5xl font-black mb-1 sm:mb-3">
            <span style={{
              background: 'linear-gradient(to right, #ff10f0, #9d00ff, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'brightness(1.3)',
              display: 'inline-block'
            }}>
              {t('register_title') || 'Join Thai Variety'}
            </span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-lg" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
            {t('register_subtitle') || 'Premium Adult Entertainment Platform'}
          </p>
        </div>

        {/* Adult Warning */}
        <div className="bg-gradient-to-r from-neon-red/20 to-neon-pink/20 backdrop-blur-xl p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-neon-red/50 sm:border-2 shadow-[0_0_30px_rgba(255,0,85,0.3)]">
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="text-2xl sm:text-4xl">⚠️</div>
            <div>
              <h3 className="text-neon-red font-black text-base sm:text-xl mb-1 sm:mb-2">{t('register_adult_warning_title')}</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('register_adult_warning_desc') }} />
            </div>
          </div>
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
          
          <div className="bg-black/50 backdrop-blur-2xl p-4 sm:p-8 rounded-xl sm:rounded-3xl border border-neon-pink/30 sm:border-2 shadow-[0_0_60px_rgba(255,16,240,0.3)] space-y-3 sm:space-y-6">
            
            {/* Role Selection - MOVED TO TOP */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-200 mb-2 sm:mb-3">
                <span className="text-neon-gold">⭐ {t('register_role_label')} *</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <label className={`cursor-pointer p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                  formData.role === 'client' 
                    ? 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border-neon-blue shadow-[0_0_30px_rgba(0,212,255,0.4)]' 
                    : 'bg-black/30 border-gray-700 hover:border-neon-blue/50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">👤</div>
                    <div className="text-base sm:text-xl font-black text-white mb-1 sm:mb-2">{t('register_client')}</div>
                    <p className="text-xs sm:text-sm text-gray-400">{t('register_client_desc')}</p>
                  </div>
                </label>
                <label className={`cursor-pointer p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                  formData.role === 'provider' 
                    ? 'bg-gradient-to-br from-neon-pink/20 to-neon-gold/20 border-neon-pink shadow-[0_0_30px_rgba(255,16,240,0.4)]' 
                    : 'bg-black/30 border-gray-700 hover:border-neon-pink/50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === 'provider'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'provider' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">⭐</div>
                    <div className="text-base sm:text-xl font-black text-white mb-1 sm:mb-2">{t('register_provider')}</div>
                    <p className="text-xs sm:text-sm text-gray-400">{t('register_provider_desc')}</p>
                  </div>
                </label>
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-neon-gold font-bold text-center">
                💡 {t('register_role_hint') || 'Choose your role before signing up'}
              </p>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-bold text-gray-200 mb-1.5 sm:mb-2">
                {t('register_username')} *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300"
                placeholder={t('register_username_placeholder')}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-200 mb-1.5 sm:mb-2">
                {t('register_email')} *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300"
                placeholder={t('register_email_placeholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-200 mb-1.5 sm:mb-2">
                {t('register_password')} *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300"
                placeholder={t('register_password_placeholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="mt-1 text-[10px] sm:text-xs text-gray-400">{t('register_password_hint')}</p>
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-xs sm:text-sm font-bold text-gray-200 mb-1.5 sm:mb-2">
                {t('register_birthdate_label')}
              </label>
              <ThaiCalendar
                value={birthdate}
                onChange={setBirthdate}
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 20))}
                placeholder={t('register_birthdate_placeholder')}
              />
              <p className="mt-1 text-[10px] sm:text-xs text-gray-400">{t('register_birthdate_hint')}</p>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-neon-purple/20 sm:border-t-2">
              <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-neon-red/50 bg-black/50 text-neon-red focus:ring-neon-red focus:ring-offset-0"
                  required
                />
                <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors" dangerouslySetInnerHTML={{ __html: `<strong class="text-neon-red">*</strong> ${t('register_age_confirm_text')}` }} />
              </label>

              <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-neon-purple/50 bg-black/50 text-neon-purple focus:ring-neon-purple focus:ring-offset-0"
                  required
                />
                <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                  <strong className="text-neon-pink">*</strong> {t('register_terms_text')}{' '}
                  <Link to="/terms" className="text-neon-purple hover:text-neon-pink underline font-bold" target="_blank">
                    {t('register_terms_link')}
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-neon-purple/50 bg-black/50 text-neon-purple focus:ring-neon-purple focus:ring-offset-0"
                  required
                />
                <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                  <strong className="text-neon-pink">*</strong> {t('register_privacy_text')}{' '}
                  <Link to="/privacy" className="text-neon-purple hover:text-neon-pink underline font-bold" target="_blank">
                    {t('register_privacy_link')}
                  </Link>{' '}
                  {t('register_privacy_understand')}
                </span>
              </label>

              <div className="bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-neon-purple/30">
                <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('register_privacy_notice') }} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-gold rounded-xl sm:rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-gold text-white font-black text-base sm:text-xl py-3 sm:py-5 rounded-xl sm:rounded-[2rem] shadow-[0_0_40px_rgba(255,16,240,0.6)] hover:shadow-[0_0_60px_rgba(255,16,240,1)] active:scale-95 sm:hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-neon-pink/50"
            >
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {loading ? t('register_creating') : t('register_create_button')}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-purple/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/50 text-gray-400 font-bold">{t('register_or') || 'OR'}</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white rounded-xl sm:rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <button
              type="button"
              onClick={() => handleGoogleSignUp()}
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
                {t('register_google') || 'Sign up with Google'}
              </span>
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-neon-purple hover:text-neon-pink font-bold transition-colors duration-300 text-sm sm:text-base"
              style={{textShadow: '0 0 20px rgba(157,0,255,0.6)'}}
            >
              {t('register_signin_prompt')} <span className="underline">{t('register_signin_link')}</span> →
            </Link>
          </div>

          {/* Security Notice */}
          <div className="bg-black/30 backdrop-blur-xl p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-neon-gold/30">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-xl sm:text-3xl">🛡️</div>
              <div>
                <h4 className="text-neon-gold font-black text-xs sm:text-sm mb-1 sm:mb-2">{t('register_id_verification_title')}</h4>
                <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed">
                  {formData.role === 'provider' 
                    ? t('register_id_verification_provider')
                    : t('register_id_verification_client')}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showAgeVerification && (
        <AgeVerificationModal
          isOpen={showAgeVerification}
          onConfirm={() => {
            setShowAgeVerification(false);
            window.location.href = '/';
          }}
          onCancel={() => {
            setShowAgeVerification(false);
          }}
        />
      )}
    </div>
  );
};

export default RegisterPage;
