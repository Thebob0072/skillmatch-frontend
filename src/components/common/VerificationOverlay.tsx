import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface VerificationOverlayProps {
  children: React.ReactNode;
}

/**
 * VerificationOverlay Component
 * 
 * Wraps content and shows an overlay if user is not verified.
 * User can see content but cannot interact with it.
 * Shows warning message with link to verification page.
 */
export function VerificationOverlay({ children }: VerificationOverlayProps) {
  const { t } = useTranslation();
  const { needsVerification, user } = useAuth();

  if (!needsVerification) {
    return <>{children}</>;
  }

  const verificationStatus = user?.verification_status || 'unverified';
  const isPending = verificationStatus === 'pending';

  return (
    <div className="relative">
      {/* Content with reduced opacity and pointer-events disabled */}
      <div className="pointer-events-none select-none opacity-50 blur-[1px]">
        {children}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="max-w-md mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-neon-purple/30 shadow-2xl shadow-neon-purple/20 text-center">
          {/* Icon */}
          <div className="text-6xl mb-6">
            {isPending ? '⏳' : '🔐'}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue mb-4">
            {isPending 
              ? t('verification_overlay.pending_title', 'Verification Pending')
              : t('verification_overlay.title', 'Verification Required')
            }
          </h2>

          {/* Message */}
          <p className="text-gray-300 mb-6">
            {isPending 
              ? t('verification_overlay.pending_message', 'Your verification is being reviewed. This usually takes 24-48 hours. You will be able to use all features once approved.')
              : t('verification_overlay.message', 'To use this feature, you must complete identity verification first. This helps us maintain a safe and trusted community.')
            }
          </p>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isPending 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : verificationStatus === 'rejected'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {isPending && '🕐'}
              {verificationStatus === 'rejected' && '❌'}
              {verificationStatus === 'unverified' && '⚠️'}
              {t(`verification_overlay.status.${verificationStatus}`, verificationStatus)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isPending && (
              <Link
                to="/verification"
                className="block w-full py-3 px-6 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                {t('verification_overlay.verify_now', 'Verify Now')}
              </Link>
            )}

            <Link
              to="/"
              className="block w-full py-3 px-6 bg-gray-700/50 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              {t('verification_overlay.go_home', 'Back to Home')}
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-sm text-gray-500">
            {t('verification_overlay.help', 'Need help?')}{' '}
            <Link to="/contact" className="text-neon-pink hover:underline">
              {t('verification_overlay.contact_support', 'Contact Support')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificationOverlay;
