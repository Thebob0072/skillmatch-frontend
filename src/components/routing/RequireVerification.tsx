import { useAuth } from '../../context/AuthContext';
import { VerificationOverlay } from '../common/VerificationOverlay';

interface RequireVerificationProps {
  children: React.ReactNode;
  /** If true, shows overlay. If false, just wraps children normally */
  strict?: boolean;
}

/**
 * RequireVerification Component
 * 
 * Wraps pages/components that require user verification.
 * Shows overlay if user is not verified, preventing interaction.
 * 
 * Usage:
 * <RequireVerification>
 *   <BookingPage />
 * </RequireVerification>
 */
export function RequireVerification({ children, strict = true }: RequireVerificationProps) {
  const { needsVerification } = useAuth();

  if (!strict || !needsVerification) {
    return <>{children}</>;
  }

  return <VerificationOverlay>{children}</VerificationOverlay>;
}

export default RequireVerification;
