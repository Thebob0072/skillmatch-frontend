import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

/**
 * ClientVerification Component
 * 
 * For clients: Simple email OTP verification
 * 1. Send OTP to email
 * 2. Enter OTP to verify
 */
export function ClientVerification() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState<'send' | 'verify' | 'success'>('send');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Send OTP to email
  const handleSendOTP = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/send-verification', { email: user.email });
      setStep('verify');
      // Start countdown for resend
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || t('verification.send_error', 'Failed to send verification code'));
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!user?.email || otp.length !== 6) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/verify-email', { email: user.email, otp });
      
      // Update user verification status
      const updatedUser = { ...user, verification_status: 'verified' as const, is_email_verified: true };
      updateUser(updatedUser);
      
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.error || t('verification.verify_error', 'Invalid verification code'));
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (step === 'success') {
    return (
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-8 border border-green-500/30 text-center">
        <span className="text-6xl mb-4 block">✅</span>
        <h2 className="text-2xl font-bold text-green-400 mb-4">
          {t('verification.email_verified', 'Email Verified!')}
        </h2>
        <p className="text-gray-300 mb-6">
          {t('verification.email_verified_desc', 'Your email has been verified successfully. You now have full access to all features.')}
        </p>
        <a 
          href="/dashboard"
          className="inline-block px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          {t('verification.go_dashboard', 'Go to Dashboard')}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-black/40 rounded-2xl p-8 border border-neon-blue/20">
      {/* Email verification steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 'send' ? 'text-neon-blue' : 'text-green-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 'send' ? 'bg-neon-blue text-black' : 'bg-green-500 text-black'
          }`}>
            {step === 'send' ? '1' : '✓'}
          </span>
          <span className="hidden sm:inline">{t('verification.step_send', 'Send Code')}</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-700" />
        <div className={`flex items-center gap-2 ${step === 'verify' ? 'text-neon-blue' : 'text-gray-500'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 'verify' ? 'bg-neon-blue text-black' : 'bg-gray-700 text-gray-400'
          }`}>
            2
          </span>
          <span className="hidden sm:inline">{t('verification.step_verify', 'Verify')}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {step === 'send' ? (
        // Step 1: Send OTP
        <div className="text-center">
          <div className="text-5xl mb-6">📧</div>
          <h3 className="text-xl font-bold text-white mb-4">
            {t('verification.send_otp_title', 'Verify Your Email')}
          </h3>
          <p className="text-gray-400 mb-6">
            {t('verification.send_otp_desc', 'We will send a 6-digit verification code to:')}
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <span className="text-neon-blue font-mono text-lg">{user?.email}</span>
          </div>
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t('common.loading', 'Loading...') : t('verification.send_code', 'Send Verification Code')}
          </button>
        </div>
      ) : (
        // Step 2: Verify OTP
        <div className="text-center">
          <div className="text-5xl mb-6">🔢</div>
          <h3 className="text-xl font-bold text-white mb-4">
            {t('verification.enter_otp_title', 'Enter Verification Code')}
          </h3>
          <p className="text-gray-400 mb-6">
            {t('verification.enter_otp_desc', 'Enter the 6-digit code sent to your email')}
          </p>
          
          {/* OTP Input */}
          <div className="mb-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-48 text-center text-3xl font-mono tracking-[0.5em] px-4 py-4 bg-gray-800/50 border-2 border-neon-blue/30 rounded-xl text-white focus:border-neon-blue focus:outline-none"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
          >
            {loading ? t('common.loading', 'Loading...') : t('verification.verify_code', 'Verify Code')}
          </button>

          {/* Resend */}
          <div className="text-gray-500">
            {countdown > 0 ? (
              <span>{t('verification.resend_in', 'Resend code in')} {countdown}s</span>
            ) : (
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="text-neon-blue hover:underline"
              >
                {t('verification.resend_code', 'Resend code')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientVerification;
