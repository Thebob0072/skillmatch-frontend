import React from 'react';
import { useTranslation } from 'react-i18next';
import { CouponManager } from '../../components/promotion/CouponManager';

const AdminPromotionManager: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl sm:text-2xl">🎁</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {t('admin.promotionManager.title')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {t('admin.promotionManager.subtitle')}
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl flex-shrink-0">🌐</div>
              <div className="min-w-0">
                <h3 className="font-semibold text-purple-900 mb-1 text-sm sm:text-base">
                  {t('admin.promotionManager.platformWide')}
                </h3>
                <p className="text-xs sm:text-sm text-purple-700">
                  {t('admin.promotionManager.platformWideDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl flex-shrink-0">💰</div>
              <div className="min-w-0">
                <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                  {t('admin.promotionManager.flexible')}
                </h3>
                <p className="text-xs sm:text-sm text-blue-700">
                  {t('admin.promotionManager.flexibleDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl flex-shrink-0">📊</div>
              <div className="min-w-0">
                <h3 className="font-semibold text-green-900 mb-1 text-sm sm:text-base">
                  {t('admin.promotionManager.tracking')}
                </h3>
                <p className="text-xs sm:text-sm text-green-700">
                  {t('admin.promotionManager.trackingDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Manager Component */}
      <CouponManager isAdminMode={true} />

      {/* Tips Section */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-purple-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <span className="text-lg sm:text-xl">💡</span>
          {t('admin.promotionManager.tipsTitle')}
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-purple-800">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5 flex-shrink-0">•</span>
            <span>{t('admin.promotionManager.tip1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5 flex-shrink-0">•</span>
            <span>{t('admin.promotionManager.tip2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5 flex-shrink-0">•</span>
            <span>{t('admin.promotionManager.tip3')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5 flex-shrink-0">•</span>
            <span>{t('admin.promotionManager.tip4')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPromotionManager;
