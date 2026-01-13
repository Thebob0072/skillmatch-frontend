import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBankAccounts } from '../../hooks';
import type { AddBankAccountRequest, AccountType } from '../../types';

const THAI_BANKS = [
  { code: 'KBANK', name: 'ธนาคารกสิกรไทย', color: '#138f2d' },
  { code: 'SCB', name: 'ธนาคารไทยพาณิชย์', color: '#4e2e7f' },
  { code: 'BBL', name: 'ธนาคารกรุงเทพ', color: '#1e4598' },
  { code: 'KTB', name: 'ธนาคารกรุงไทย', color: '#1ba5e1' },
  { code: 'BAY', name: 'ธนาคารกรุงศรีอยุธยา', color: '#fec43b' },
  { code: 'TMB', name: 'ธนาคารทหารไทยธนชาต', color: '#1279be' },
  { code: 'TBANK', name: 'ธนาคารธนชาต', color: '#fc4f1f' },
  { code: 'CIMB', name: 'ธนาคารซีไอเอ็มบีไทย', color: '#7e2f36' },
  { code: 'UOB', name: 'ธนาคารยูโอบี', color: '#0b3979' },
  { code: 'LH', name: 'ธนาคารแลนด์ แอนด์ เฮ้าส์', color: '#6d6e71' },
];

const BankAccountManager: React.FC = () => {
  const { t } = useTranslation();
  const { accounts, loading, error, addAccount, deleteAccount, setDefaultAccount, refetch } = useBankAccounts();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddBankAccountRequest>({
    bank_name: '',
    bank_code: '',
    account_number: '',
    account_name: '',
    account_type: 'savings' as AccountType,
    is_default: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: AddBankAccountRequest) => ({ ...prev, [name]: checked }));
    } else if (name === 'bank_code') {
      const selectedBank = THAI_BANKS.find(bank => bank.code === value);
      setFormData((prev: AddBankAccountRequest) => ({
        ...prev,
        bank_code: value,
        bank_name: selectedBank?.name || '',
      }));
    } else {
      setFormData((prev: AddBankAccountRequest) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      // Validate account number
      if (!/^\d{10,12}$/.test(formData.account_number)) {
        throw new Error(t('financial.bank.validation_error'));
      }

      await addAccount(formData);
      
      // Reset form
      setFormData({
        bank_name: '',
        bank_code: '',
        account_number: '',
        account_name: '',
        account_type: 'savings' as AccountType,
        is_default: false,
      });
      setShowAddForm(false);
    } catch (err: unknown) {
      setFormError(err.message || t('financial.bank.error_add'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (bankAccountId: number) => {
    if (!confirm(t('financial.bank.confirm_delete'))) return;

    try {
      await deleteAccount(bankAccountId);
    } catch (err: unknown) {
      alert(err.message || t('financial.bank.error_delete'));
    }
  };

  const handleSetDefault = async (bankAccountId: number) => {
    try {
      await setDefaultAccount(bankAccountId);
    } catch (err: unknown) {
      alert(err.message || t('financial.bank.error_set_default'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">{t('financial.bank.title')}</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-glow-purple transition-all"
        >
          {showAddForm ? t('financial.bank.cancel') : `+ ${t('financial.bank.add_account')}`}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-dark border border-red-500/30 rounded-lg p-4 shadow-glow-red">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Add Account Form */}
      {showAddForm && (
        <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('financial.bank.add_account')}</h3>
          
          {formError && (
            <div className="glass-dark border border-red-500/30 rounded-lg p-3 mb-4 shadow-glow-red">
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('financial.bank.bank_name')} <span className="text-red-400">*</span>
              </label>
              <select
                name="bank_code"
                value={formData.bank_code}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">{t('financial.bank.select_bank')}</option>
                {THAI_BANKS.map(bank => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('financial.bank.account_number')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleInputChange}
                required
                maxLength={12}
                pattern="\d{10,12}"
                placeholder="1234567890"
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">{t('financial.bank.account_digits')}</p>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('financial.bank.account_name')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="account_name"
                value={formData.account_name}
                onChange={handleInputChange}
                required
                placeholder="นาย สมชาย ใจดี"
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
              />
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('financial.bank.account_type')} <span className="text-red-400">*</span>
              </label>
              <select
                name="account_type"
                value={formData.account_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="savings">{t('financial.bank.savings')}</option>
                <option value="current">{t('financial.bank.current')}</option>
              </select>
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-purple-500/30 rounded focus:ring-purple-500"
              />
              <label className="ml-2 text-sm text-gray-300">
                {t('financial.bank.set_default')}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? t('financial.bank.saving') : t('financial.bank.save')}
            </button>
          </form>
        </div>
      )}

      {/* Bank Accounts List */}
      <div className="space-y-4">
        {accounts.length === 0 ? (
          <div className="glass-dark rounded-xl border border-purple-500/30 p-8 text-center shadow-glow-purple">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-gray-300">{t('financial.bank.no_accounts')}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-glow-purple transition-all"
            >
              {t('financial.bank.add_first')}
            </button>
          </div>
        ) : (
          accounts.map(account => {
            const bank = THAI_BANKS.find(b => b.code === account.bank_code);
            
            return (
              <div
                key={account.bank_account_id}
                className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple p-6 hover:shadow-glow-pink transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Bank Icon */}
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      style={{ backgroundColor: bank?.color || '#6B7280' }}
                    >
                      {bank?.code.substring(0, 2) || 'BK'}
                    </div>

                    {/* Account Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {account.bank_name}
                        </h3>
                        {account.is_default && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                            {t('financial.bank.default_badge')}
                          </span>
                        )}
                        {account.is_verified ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded border border-green-500/30 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t('financial.bank.verified_badge')}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                            {t('financial.bank.pending_badge')}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 font-mono text-lg">
                        {account.account_number.replace(/(\d{3})(\d{1})(\d{5})(\d{1})/, '$1-$2-$3-$4')}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{account.account_name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {account.account_type === 'savings' ? t('financial.bank.savings') : t('financial.bank.current')}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {!account.is_default && account.is_verified && (
                      <button
                        onClick={() => handleSetDefault(account.bank_account_id)}
                        className="px-3 py-1 text-xs text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 rounded transition-all"
                      >
                        {t('financial.bank.set_as_default')}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(account.bank_account_id)}
                      className="px-3 py-1 text-xs text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded transition-all"
                    >
                      {t('financial.bank.delete')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BankAccountManager;
