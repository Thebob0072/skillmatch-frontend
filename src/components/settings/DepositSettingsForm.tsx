import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getDepositSettings,
  updateDepositSettings,
  DepositSettings
} from '../../services/promotionService';

export const DepositSettingsForm: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<DepositSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    require_deposit: false,
    deposit_type: 'percentage' as 'percentage' | 'fixed',
    deposit_percentage: 30,
    deposit_amount: 500,
    deposit_deadline_hours: 24,
    refund_policy: 'partial' as 'full' | 'partial' | 'none'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getDepositSettings();
      setSettings(data);
      if (data) {
        setFormData({
          require_deposit: data.require_deposit,
          deposit_type: data.deposit_type || 'percentage',
          deposit_percentage: data.deposit_percentage || 30,
          deposit_amount: data.deposit_amount || 500,
          deposit_deadline_hours: data.deposit_deadline_hours || 24,
          refund_policy: data.refund_policy || 'partial'
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
      
      await updateDepositSettings({
        require_deposit: formData.require_deposit,
        deposit_type: formData.deposit_type,
        deposit_percentage: formData.deposit_type === 'percentage' ? formData.deposit_percentage : undefined,
        deposit_amount: formData.deposit_type === 'fixed' ? formData.deposit_amount : undefined,
        deposit_deadline_hours: formData.deposit_deadline_hours,
        refund_policy: formData.refund_policy
      });
      
      setSuccess(t('deposit.saveSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('deposit.saveError'));
    } finally {
      setIsSaving(false);
    }
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
          <span className="text-3xl">💰</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('deposit.title')}
            </h2>
            <p className="text-sm text-gray-500">
              {t('deposit.description')}
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
          {/* Require Deposit Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">
                {t('deposit.requireDeposit')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('deposit.requireDepositDescription')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.require_deposit}
                onChange={e => setFormData({ ...formData, require_deposit: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {formData.require_deposit && (
            <>
              {/* Deposit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('deposit.depositType')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deposit_type: 'percentage' })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.deposit_type === 'percentage'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-1">%</span>
                    <span className="font-medium">{t('deposit.percentage')}</span>
                    <p className="text-xs text-gray-500">{t('deposit.percentageDescription')}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deposit_type: 'fixed' })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.deposit_type === 'fixed'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-1">฿</span>
                    <span className="font-medium">{t('deposit.fixed')}</span>
                    <p className="text-xs text-gray-500">{t('deposit.fixedDescription')}</p>
                  </button>
                </div>
              </div>

              {/* Deposit Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.deposit_type === 'percentage' 
                    ? t('deposit.percentageAmount')
                    : t('deposit.fixedAmount')
                  }
                </label>
                {formData.deposit_type === 'percentage' ? (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={formData.deposit_percentage}
                      onChange={e => setFormData({ ...formData, deposit_percentage: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">10%</span>
                      <span className="text-lg font-bold text-green-600">{formData.deposit_percentage}%</span>
                      <span className="text-gray-500">100%</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.deposit_amount}
                      onChange={e => setFormData({ ...formData, deposit_amount: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
                      placeholder="500"
                      min="0"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">฿</span>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('deposit.deadline')}
                </label>
                <select
                  value={formData.deposit_deadline_hours}
                  onChange={e => setFormData({ ...formData, deposit_deadline_hours: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value={6}>6 {t('common.hours')}</option>
                  <option value={12}>12 {t('common.hours')}</option>
                  <option value={24}>24 {t('common.hours')}</option>
                  <option value={48}>48 {t('common.hours')}</option>
                  <option value={72}>72 {t('common.hours')}</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {t('deposit.deadlineDescription')}
                </p>
              </div>

              {/* Refund Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('deposit.refundPolicy')}
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'full', label: t('deposit.refundFull'), desc: t('deposit.refundFullDesc') },
                    { value: 'partial', label: t('deposit.refundPartial'), desc: t('deposit.refundPartialDesc') },
                    { value: 'none', label: t('deposit.refundNone'), desc: t('deposit.refundNoneDesc') }
                  ].map(option => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.refund_policy === option.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="refund_policy"
                        value={option.value}
                        checked={formData.refund_policy === option.value}
                        onChange={e => setFormData({ ...formData, refund_policy: e.target.value as any })}
                        className="mt-1 w-4 h-4 text-green-600"
                      />
                      <div>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        <p className="text-xs text-gray-500">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? t('common.saving') : t('common.saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositSettingsForm;
