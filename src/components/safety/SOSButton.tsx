import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { triggerSOS } from '../../services/safetyService';

interface SOSButtonProps {
  bookingId?: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const SOSButton: React.FC<SOSButtonProps> = ({ 
  bookingId, 
  className = '',
  size = 'medium'
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-24 h-24 text-4xl'
  };

  const handleSOSClick = () => {
    setShowConfirm(true);
    setError(null);
  };

  const handleConfirmSOS = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      // Trigger SOS
      await triggerSOS({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        location_text: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
        booking_id: bookingId
      });

      setIsSent(true);
      setShowConfirm(false);

      // Reset after 30 seconds
      setTimeout(() => setIsSent(false), 30000);

    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('SOS Error');
      }
      setError(err instanceof GeolocationPositionError 
        ? t('safety.sos.locationError')
        : t('safety.sos.sendError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setError(null);
  };

  if (isSent) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full bg-green-500 text-white flex items-center justify-center animate-pulse`}>
          ✓
        </div>
        <span className="mt-2 text-sm text-green-600 font-medium">
          {t('safety.sos.sent')}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={`flex flex-col items-center ${className}`}>
        <button
          onClick={handleSOSClick}
          disabled={isLoading}
          className={`
            ${sizeClasses[size]}
            rounded-full
            bg-red-600 hover:bg-red-700
            text-white font-bold
            flex items-center justify-center
            shadow-lg hover:shadow-xl
            transform hover:scale-105
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            animate-pulse hover:animate-none
          `}
          aria-label={t('safety.sos.button')}
        >
          🆘
        </button>
        <span className="mt-2 text-sm text-red-600 font-medium">
          {t('safety.sos.label')}
        </span>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-red-600 mb-2">
                {t('safety.sos.confirmTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('safety.sos.confirmMessage')}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleConfirmSOS}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('common.sending')}
                    </span>
                  ) : (
                    t('safety.sos.confirm')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
