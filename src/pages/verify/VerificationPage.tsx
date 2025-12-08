import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import ClientVerification from './ClientVerification';
import ProviderVerification from './ProviderVerification';

export function VerificationPage() {
  const { t } = useTranslation();
  const { user, isVerified } = useAuth();

  // Already verified
  if (isVerified) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-8 border border-green-500/30 text-center">
          <span className="text-6xl mb-4 block">✅</span>
          <h1 className="text-3xl font-bold text-green-400 mb-4">
            {t('verification.already_verified', 'Already Verified')}
          </h1>
          <p className="text-gray-300">
            {t('verification.already_verified_desc', 'Your account has been verified. You have full access to all features.')}
          </p>
        </div>
      </div>
    );
  }

  // Pending verification
  if (user?.verification_status === 'pending') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-2xl p-8 border border-yellow-500/30 text-center">
          <span className="text-6xl mb-4 block">⏳</span>
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">
            {t('verification.pending_title', 'Verification Pending')}
          </h1>
          <p className="text-gray-300 mb-4">
            {t('verification.pending_desc', 'Your verification documents are being reviewed. This usually takes 24-48 hours.')}
          </p>
          <p className="text-sm text-gray-500">
            {t('verification.pending_contact', 'If you have any questions, please contact support.')}
          </p>
        </div>
      </div>
    );
  }

  // Show different verification based on role
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">🔐</span>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue mb-4">
          {t('verification.title', 'Identity Verification')}
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          {user?.role === 'provider' 
            ? t('verification.provider_subtitle', 'As a provider, you need to verify your identity with ID documents and face verification.')
            : t('verification.client_subtitle', 'Please verify your email address to access all features.')
          }
        </p>
      </div>

      {/* Role-based verification */}
      {user?.role === 'provider' ? (
        <ProviderVerification />
      ) : (
        <ClientVerification />
      )}
    </div>
  );
}

export default VerificationPage;
