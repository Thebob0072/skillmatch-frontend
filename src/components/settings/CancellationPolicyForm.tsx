import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getCancellationPolicy,
  updateCancellationPolicy,
  CancellationPolicySettings
} from '../../services/promotionService';

interface CancellationTier {
  hours_before: number;
  fee_percentage: number;
}

export const CancellationPolicyForm: React.FC = () => {
  const { t } = useTranslation();
  const [policy, setPolicy] = useState<CancellationPolicySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    enable_cancellation_fee: false,
    free_cancellation_hours: 24,
    cancellation_tiers: [
      { hours_before: 24, fee_percentage: 0 },
      { hours_before: 12, fee_percentage: 25 },
      { hours_before: 6, fee_percentage: 50 },
      { hours_before: 0, fee_percentage: 100 }
    ] as CancellationTier[],
    no_show_fee_percentage: 100
  });

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      setIsLoading(true);
      const data = await getCancellationPolicy();
      setPolicy(data);
      if (data) {
        setFormData({
          enable_cancellation_fee: data.enable_cancellation_fee,
          free_cancellation_hours: data.free_cancellation_hours || 24,
          cancellation_tiers: data.cancellation_tiers || formData.cancellation_tiers,
          no_show_fee_percentage: data.no_show_fee_percentage || 100
        });
      }
    } catch (err) {
      // New user, use defaults
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      await updateCancellationPolicy({
        enable_cancellation_fee: formData.enable_cancellation_fee,
        free_cancellation_hours: formData.free_cancellation_hours,
        cancellation_tiers: formData.cancellation_tiers,
        no_show_fee_percentage: formData.no_show_fee_percentage
      });
      
      setSuccess(t('cancellation.saveSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('cancellation.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const updateTier = (index: number, field: keyof CancellationTier, value: number) => {
    const newTiers = [...formData.cancellation_tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setFormData({ ...formData, cancellation_tiers: newTiers });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🚫</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('cancellation.title')}
            </h2>
            <p className="text-sm text-gray-500">
              {t('cancellation.description')}
            </p>
          </div>
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

        <div className="space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">
                {t('cancellation.enableFee')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('cancellation.enableFeeDescription')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enable_cancellation_fee}
                onChange={e => setFormData({ ...formData, enable_cancellation_fee: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {formData.enable_cancellation_fee && (
            <>
              {/* Free Cancellation Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cancellation.freePeriod')}
                </label>
                <select
                  value={formData.free_cancellation_hours}
                  onChange={e => setFormData({ ...formData, free_cancellation_hours: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value={0}>{t('cancellation.noFreeCancel')}</option>
                  <option value={6}>6 {t('common.hours')}</option>
                  <option value={12}>12 {t('common.hours')}</option>
                  <option value={24}>24 {t('common.hours')}</option>
                  <option value={48}>48 {t('common.hours')}</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {t('cancellation.freePeriodDescription')}
                </p>
              </div>

              {/* Cancellation Tiers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('cancellation.tieredFees')}
                </label>
                <div className="space-y-3">
                  {formData.cancellation_tiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="text-sm text-gray-600">
                          {tier.hours_before === 0 
                            ? t('cancellation.lessThan6Hours')
                            : `${t('cancellation.moreThan')} ${tier.hours_before}h ${t('cancellation.before')}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tier.fee_percentage}
                          onChange={e => updateTier(index, 'fee_percentage', Number(e.target.value))}
                          min="0"
                          max="100"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('cancellation.tierDescription')}
                </p>
              </div>

              {/* No-Show Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cancellation.noShowFee')}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={formData.no_show_fee_percentage}
                    onChange={e => setFormData({ ...formData, no_show_fee_percentage: Number(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <span className="text-lg font-bold text-orange-600 w-16 text-right">
                    {formData.no_show_fee_percentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('cancellation.noShowDescription')}
                </p>
              </div>

              {/* Preview */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">
                  {t('cancellation.preview')}
                </h4>
                <div className="text-sm text-orange-800 space-y-1">
                  <p>• {t('cancellation.freeCancelBefore')}: {formData.free_cancellation_hours}h</p>
                  <p>• {t('cancellation.feeAfter')}: {formData.cancellation_tiers[1]?.fee_percentage || 25}% - {formData.cancellation_tiers[3]?.fee_percentage || 100}%</p>
                  <p>• {t('cancellation.noShowFeeAmount')}: {formData.no_show_fee_percentage}%</p>
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? t('common.saving') : t('common.saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyForm;
