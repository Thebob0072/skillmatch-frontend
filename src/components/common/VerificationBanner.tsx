import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * VerificationBanner Component
 * 
 * Shows a sticky banner at the top of the page for unverified users.
 * Less intrusive than the full overlay - allows viewing but reminds to verify.
 */
export function VerificationBanner() {
  const { t } = useTranslation();
  const { needsVerification, user } = useAuth();

  if (!needsVerification) {
    return null;
  }

  const isPending = user?.verification_status === 'pending';

  return (
    <div className={`sticky top-0 z-40 ${
      isPending 
        ? 'bg-gradient-to-r from-yellow-600/90 to-yellow-500/90' 
        : 'bg-gradient-to-r from-neon-pink/90 to-neon-purple/90'
    } backdrop-blur-sm border-b border-white/10`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {isPending ? '⏳' : '⚠️'}
          </span>
          <p className="text-white text-sm sm:text-base font-medium">
            {isPending 
              ? t('verification_banner.pending', 'Your verification is being reviewed...')
              : t('verification_banner.required', 'Please verify your identity to access all features')
            }
          </p>
        </div>
        
        {!isPending && (
          <Link
            to="/verification"
            className="shrink-0 px-4 py-2 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            {t('verification_banner.verify', 'Verify Now')}
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerificationBanner;
