import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

interface ExtendSessionModalProps {
  bookingId: number;
  currentDuration: number; // minutes already elapsed
  onClose: () => void;
  onSuccess: (additionalMinutes: number) => void;
}

interface ExtensionPackage {
  minutes: number;
  price: number;
  label: string;
}

export const ExtendSessionModal: React.FC<ExtendSessionModalProps> = ({
  bookingId,
  currentDuration,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<ExtensionPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ExtensionPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Fetch available extension packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}/extension-packages`);
        setPackages(response.data.packages || []);
      } catch (err) {
        // Fallback default packages if API not available
        setPackages([
          { minutes: 30, price: 500, label: '30 ' + t('common.minutes') },
          { minutes: 60, price: 900, label: '1 ' + t('common.hour') },
          { minutes: 120, price: 1600, label: '2 ' + t('common.hours') }
        ]);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    fetchPackages();
  }, [bookingId, t]);

  const handleExtend = async () => {
    if (!selectedPackage) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/bookings/extend', {
        booking_id: bookingId,
        additional_minutes: selectedPackage.minutes,
        price: selectedPackage.price,
        success_url: `${window.location.origin}/booking/extend-success?booking_id=${bookingId}`,
        cancel_url: `${window.location.origin}/booking/extend-cancel`
      });

      if (response.data.checkout_url) {
        // Redirect to payment
        setPaymentUrl(response.data.checkout_url);
        window.location.href = response.data.checkout_url;
      } else if (response.data.success) {
        // Direct extension (if already paid or wallet balance)
        onSuccess(selectedPackage.minutes);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t('extend_session.error', 'Failed to extend session'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-neon-purple/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏱️</span>
            <h2 className="text-xl font-bold text-white">
              {t('extend_session.title', 'Extend Session')}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Duration Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm">
            {t('extend_session.current_duration', 'Current session time')}:
          </p>
          <p className="text-2xl font-bold text-neon-gold">
            {Math.floor(currentDuration / 60)}h {currentDuration % 60}m
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Extension Packages */}
        {isLoadingPackages ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-pink"></div>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            <p className="text-gray-300 font-medium">
              {t('extend_session.select_package', 'Select extension time')}:
            </p>
            {packages.map((pkg) => (
              <button
                key={pkg.minutes}
                onClick={() => setSelectedPackage(pkg)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedPackage?.minutes === pkg.minutes
                    ? 'border-neon-pink bg-neon-pink/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {pkg.minutes <= 30 ? '⚡' : pkg.minutes <= 60 ? '⏰' : '🌙'}
                  </span>
                  <span className="text-white font-medium">{pkg.label}</span>
                </div>
                <span className={`text-lg font-bold ${
                  selectedPackage?.minutes === pkg.minutes ? 'text-neon-pink' : 'text-neon-gold'
                }`}>
                  ฿{pkg.price.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleExtend}
            disabled={!selectedPackage || isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('common.processing', 'Processing...')}
              </span>
            ) : (
              <>💳 {t('extend_session.pay_extend', 'Pay & Extend')}</>
            )}
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-gray-500 mt-4">
          {t('extend_session.secure_payment', 'Secure payment via Stripe')} 🔒
        </p>
      </div>
    </div>
  );
};

export default ExtendSessionModal;
