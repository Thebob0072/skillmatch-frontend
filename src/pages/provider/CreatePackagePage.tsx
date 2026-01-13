import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

interface PackageForm {
  package_name: string;
  description: string;
  duration: number;
  price: number;
}

export const CreatePackagePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<PackageForm>({
    package_name: '',
    description: '',
    duration: 60,
    price: 1500,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/packages', form);
      setSuccess(true);
      setTimeout(() => {
        navigate('/provider/packages');
      }, 1500);
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PackageForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← {t('common.back', 'Back')}
          </button>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              🎁 {t('package.create_title', 'Create New Package')}
            </span>
          </h1>
          <p className="text-gray-400">{t('package.create_subtitle', 'Set up your service package details')}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-xl">
            <p className="text-green-400 font-semibold">✅ {t('package.create_success', 'Package created successfully!')}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-neon-pink/20">
          {/* Package Name */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              {t('package.name', 'Package Name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.package_name}
              onChange={(e) => handleChange('package_name', e.target.value)}
              placeholder={t('package.name_placeholder', 'e.g. Massage 2 Hours')}
              required
              className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none transition"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              {t('package.description', 'Description')}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('package.description_placeholder', 'Describe your service...')}
              rows={4}
              className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none transition resize-none"
            />
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              {t('package.duration', 'Duration (minutes)')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[30, 60, 90, 120, 180, 240, 300, 360].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleChange('duration', mins)}
                  className={`px-4 py-3 rounded-xl font-semibold transition ${
                    form.duration === mins
                      ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white'
                      : 'bg-black/60 text-gray-400 hover:text-white border border-gray-600'
                  }`}
                >
                  {mins} {t('package.mins', 'mins')}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value) || 60)}
              min="15"
              max="1440"
              className="w-full mt-3 px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
              placeholder={t('package.custom_duration', 'Custom duration')}
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              {t('package.price', 'Price (THB)')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">฿</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                min="100"
                max="100000"
                step="100"
                required
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white text-lg font-semibold focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000].map(price => (
                <button
                  key={price}
                  type="button"
                  onClick={() => handleChange('price', price)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    form.price === price
                      ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink'
                      : 'bg-black/60 text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  ฿{price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 p-6 bg-gradient-to-br from-neon-pink/10 to-neon-purple/10 rounded-xl border border-neon-pink/30">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              👁️ {t('package.preview', 'Preview')}
            </h3>
            <div className="space-y-2">
              <p className="text-white font-semibold text-lg">{form.package_name || t('package.untitled', 'Untitled Package')}</p>
              <p className="text-gray-400 text-sm">{form.description || t('package.no_description', 'No description')}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-neon-pink font-semibold">⏱️ {form.duration} {t('package.mins', 'mins')}</span>
                <span className="text-neon-purple font-bold text-xl">฿{form.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !form.package_name || form.price <= 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-xl shadow-lg hover:shadow-neon-pink/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.creating', 'Creating...') : t('package.create', 'Create Package')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackagePage;
