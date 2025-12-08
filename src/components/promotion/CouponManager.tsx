import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createCoupon,
  getMyCoupons,
  Coupon
} from '../../services/promotionService';

export const CouponManager: React.FC = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    min_booking_amount: undefined as number | undefined,
    max_discount: undefined as number | undefined,
    valid_from: '',
    valid_until: '',
    usage_limit: undefined as number | undefined
  });

  useEffect(() => {
    fetchCoupons();
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, valid_from: today, valid_until: nextMonth }));
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const data = await getMyCoupons();
      setCoupons(data);
    } catch (err) {
      setError(t('coupon.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.valid_from || !formData.valid_until) return;

    try {
      setIsCreating(true);
      setError(null);
      await createCoupon(formData);
      setSuccess(t('coupon.createSuccess'));
      setShowCreateForm(false);
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: 10,
        min_booking_amount: undefined,
        max_discount: undefined,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usage_limit: undefined
      });
      await fetchCoupons();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || t('coupon.createError'));
    } finally {
      setIsCreating(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const isExpired = (validUntil: string) => new Date(validUntil) < new Date();
  const isActive = (coupon: Coupon) => coupon.is_active && !isExpired(coupon.valid_until);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('coupon.title')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('coupon.description')}
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            + {t('coupon.create')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-2">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">
            {success}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="mb-6 p-4 bg-purple-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('coupon.form.code')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg uppercase"
                    placeholder="SAVE20"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    🎲
                  </button>
                </div>
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('coupon.form.discountType')}
                </label>
                <select
                  value={formData.discount_type}
                  onChange={e => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="percentage">{t('coupon.form.percentage')}</option>
                  <option value="fixed">{t('coupon.form.fixed')}</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('coupon.form.discountValue')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={e => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                    min="1"
                    required
                  />
                  <span className="absolute right-3 top-2 text-gray-500">
                    {formData.discount_type === 'percentage' ? '%' : '฿'}
                  </span>
                </div>
              </div>

              {/* Max Discount (for percentage) */}
              {formData.discount_type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('coupon.form.maxDiscount')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.max_discount || ''}
                      onChange={e => setFormData({ ...formData, max_discount: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder={t('coupon.form.optional')}
                      min="0"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">฿</span>
                  </div>
                </div>
              )}

              {/* Min Booking Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('coupon.form.minBooking')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.min_booking_amount || ''}
                    onChange={e => setFormData({ ...formData, min_booking_amount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder={t('coupon.form.optional')}
                    min="0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">฿</span>
                </div>
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('coupon.form.usageLimit')}
                </label>
                <input
                  type="number"
                  value={formData.usage_limit || ''}
                  onChange={e => setFormData({ ...formData, usage_limit: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder={t('coupon.form.unlimited')}
                  min="1"
                />
              </div>

              {/* Valid From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('coupon.form.validFrom')}
                </label>
                <input
                  type="date"
                  value={formData.valid_from}
                  onChange={e => setFormData({ ...formData, valid_from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('coupon.form.validUntil')}
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={e => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {isCreating ? t('common.creating') : t('coupon.create')}
              </button>
            </div>
          </form>
        )}

        {/* Coupon List */}
        <div className="space-y-3">
          {coupons.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-4">🎟️</div>
              <p className="text-gray-500">{t('coupon.noCoupons')}</p>
            </div>
          ) : (
            coupons.map(coupon => (
              <div 
                key={coupon.coupon_id}
                className={`border-2 border-dashed rounded-lg p-4 ${
                  isActive(coupon) 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-300 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🎟️</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-bold text-purple-600 bg-white px-2 py-1 rounded">
                          {coupon.code}
                        </code>
                        {!isActive(coupon) && (
                          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                            {isExpired(coupon.valid_until) ? t('coupon.expired') : t('coupon.inactive')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}% ${t('coupon.off')}`
                          : `฿${coupon.discount_value} ${t('coupon.off')}`
                        }
                        {coupon.max_discount && ` (${t('coupon.maxDiscount')}: ฿${coupon.max_discount})`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {t('coupon.usage')}: {coupon.used_count}/{coupon.usage_limit || '∞'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('coupon.validUntil')}: {new Date(coupon.valid_until).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponManager;
