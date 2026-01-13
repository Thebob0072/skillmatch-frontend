import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface CouponWithProvider {
  coupon_id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_booking_amount?: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
  provider_id?: number;
  provider_name?: string;
}

const PromotionBrowsePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<CouponWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'platform' | 'provider'>('all');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/coupons/browse');
      setCoupons(response.data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch coupons');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (filter === 'platform') return !coupon.provider_id;
    if (filter === 'provider') return !!coupon.provider_id;
    return true;
  });

  const formatDiscount = (coupon: CouponWithProvider) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    }
    return `฿${coupon.discount_value} OFF`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(t('promotions.code_copied', 'Coupon code copied!'));
  };

  const getAvailability = (coupon: CouponWithProvider) => {
    if (!coupon.usage_limit) return '∞';
    const remaining = coupon.usage_limit - coupon.used_count;
    return `${remaining}/${coupon.usage_limit}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">
          {t('common.loading', 'Loading...')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎁 {t('promotions.title', 'Promotions & Deals')}
          </h1>
          <p className="text-gray-300 text-lg">
            {t('promotions.subtitle', 'Save on your next booking with these exclusive offers')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 bg-gray-800/50 p-2 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('promotions.all', 'All Offers')} ({coupons.length})
          </button>
          <button
            onClick={() => setFilter('platform')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              filter === 'platform'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🌟 {t('promotions.platform', 'Platform-wide')} (
            {coupons.filter((c) => !c.provider_id).length})
          </button>
          <button
            onClick={() => setFilter('provider')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              filter === 'provider'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            👤 {t('promotions.provider_specific', 'Provider Offers')} (
            {coupons.filter((c) => !!c.provider_id).length})
          </button>
        </div>

        {/* Coupons Grid */}
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎫</div>
            <p className="text-gray-400 text-lg">
              {t('promotions.no_offers', 'No active offers at the moment')}
            </p>
            <p className="text-gray-500 mt-2">
              {t('promotions.check_back', 'Check back later for exciting deals!')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.coupon_id}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 relative overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-4 rounded-full text-lg shadow-lg">
                  {formatDiscount(coupon)}
                </div>

                {/* Provider Info */}
                <div className="mb-4">
                  {coupon.provider_id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-sm">
                        {t('promotions.by', 'By')}:
                      </span>
                      <button
                        onClick={() => navigate(`/provider/${coupon.provider_id}`)}
                        className="text-purple-400 hover:text-purple-300 font-semibold text-sm underline"
                      >
                        {coupon.provider_name}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-sm font-semibold">
                        ⭐ {t('promotions.platform_offer', 'Platform-wide Offer')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Coupon Code */}
                <div className="mb-4">
                  <p className="text-gray-400 text-xs mb-1">
                    {t('promotions.code', 'Coupon Code')}:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700/50 border-2 border-dashed border-purple-500/50 rounded-lg py-3 px-4">
                      <code className="text-white font-mono font-bold text-xl">
                        {coupon.code}
                      </code>
                    </div>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors"
                      title={t('promotions.copy_code', 'Copy code')}
                    >
                      📋
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {coupon.min_booking_amount && (
                    <div className="flex justify-between text-gray-300">
                      <span>{t('promotions.min_booking', 'Min. Booking')}:</span>
                      <span className="font-semibold">
                        ฿{coupon.min_booking_amount}
                      </span>
                    </div>
                  )}
                  {coupon.max_discount && (
                    <div className="flex justify-between text-gray-300">
                      <span>{t('promotions.max_discount', 'Max. Discount')}:</span>
                      <span className="font-semibold">฿{coupon.max_discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>{t('promotions.valid_until', 'Valid Until')}:</span>
                    <span className="font-semibold">
                      {formatDate(coupon.valid_until)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>{t('promotions.available', 'Available')}:</span>
                    <span className="font-semibold">{getAvailability(coupon)}</span>
                  </div>
                </div>

                {/* Use Button */}
                <button
                  onClick={() => navigate('/browse')}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                >
                  {t('promotions.browse_providers', 'Browse Providers')} →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionBrowsePage;
