import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CouponManager } from '../../components/promotion/CouponManager';

const ProviderCouponManager: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎟️ {t('coupon_manager.title', 'Coupon Manager')}
          </h1>
          <p className="text-gray-300">
            {t('coupon_manager.subtitle', 'Create and manage your promotional coupons')}
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">
            💡 {t('coupon_manager.tips_title', 'Coupon Tips')}
          </h2>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>✓ {t('coupon_manager.tip_1', 'Use clear coupon codes (e.g., SUMMER20, FIRST10)')}</li>
            <li>✓ {t('coupon_manager.tip_2', 'Set minimum booking amounts to maintain profitability')}</li>
            <li>✓ {t('coupon_manager.tip_3', 'Limit usage to prevent excessive discounts')}</li>
            <li>✓ {t('coupon_manager.tip_4', 'Create urgency with expiration dates')}</li>
            <li>✓ {t('coupon_manager.tip_5', 'Use percentage discounts for higher-value bookings')}</li>
          </ul>
        </div>

        {/* Coupon Manager Component */}
        <CouponManager />
      </div>
    </div>
  );
};

export default ProviderCouponManager;
