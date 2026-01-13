import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface ServiceCategory {
  category_id: number;
  name: string;
  name_thai: string;
  description: string;
  icon: string;
  is_adult: boolean;
}

interface ProviderSettings {
  service_type: 'Incall' | 'Outcall' | 'Both';
  category_ids: number[];
  bio: string;
  province: string;
  district: string;
  sub_district: string;
  postal_code: string;
  address_line1: string;
}

export const ProviderSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState<ProviderSettings>({
    service_type: 'Both',
    category_ids: [],
    bio: '',
    province: '',
    district: '',
    sub_district: '',
    postal_code: '',
    address_line1: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, myProfileRes, myCategoriesRes] = await Promise.all([
        api.get('/service-categories'),
        api.get('/profile/me'),
        api.get('/provider/categories/me'),
      ]);

      setCategories(categoriesRes.data.categories || []);
      
      const profile = myProfileRes.data;
      setSettings({
        service_type: profile.service_type || 'Both',
        category_ids: myCategoriesRes.data.categories?.map((c: ServiceCategory) => c.category_id) || [],
        bio: profile.bio || '',
        province: profile.province || '',
        district: profile.district || '',
        sub_district: profile.sub_district || '',
        postal_code: profile.postal_code || '',
        address_line1: profile.address_line1 || '',
      });

      setSelectedCategories(myCategoriesRes.data.categories?.map((c: ServiceCategory) => c.category_id) || []);
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      if (selectedCategories.length >= 5) {
        alert(t('settings.max_categories', 'Maximum 5 categories allowed'));
        return;
      }
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSave = async () => {
    if (selectedCategories.length === 0) {
      setError(t('settings.no_categories', 'Please select at least one category'));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Update profile
      await api.put('/profile/me', {
        service_type: settings.service_type,
        bio: settings.bio,
        province: settings.province,
        district: settings.district,
        sub_district: settings.sub_district,
        postal_code: settings.postal_code,
        address_line1: settings.address_line1,
      });

      // Update categories
      await api.put('/provider/me/categories', {
        category_ids: selectedCategories,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
              ⚙️ {t('settings.title', 'Provider Settings')}
            </span>
          </h1>
          <p className="text-gray-400">{t('settings.subtitle', 'Configure your service preferences')}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-xl">
            <p className="text-green-400 font-semibold">✅ {t('settings.save_success', 'Settings saved successfully!')}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Service Type */}
          <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">{t('settings.service_type', 'Service Type')}</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {(['Incall', 'Outcall', 'Both'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSettings({ ...settings, service_type: type })}
                  className={`p-4 rounded-xl font-semibold transition ${
                    settings.service_type === type
                      ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white'
                      : 'bg-black/60 text-gray-400 hover:text-white border border-gray-600'
                  }`}
                >
                  {type === 'Incall' && '🏠 ' + t('settings.incall', 'Incall Only')}
                  {type === 'Outcall' && '🚗 ' + t('settings.outcall', 'Outcall Only')}
                  {type === 'Both' && '🔄 ' + t('settings.both', 'Both')}
                </button>
              ))}
            </div>
          </div>

          {/* Service Categories */}
          <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{t('settings.categories', 'Service Categories')}</h2>
              <span className="text-gray-400 text-sm">{selectedCategories.length}/5 {t('settings.selected', 'selected')}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.category_id}
                  onClick={() => toggleCategory(cat.category_id)}
                  className={`p-4 rounded-xl text-left transition ${
                    selectedCategories.includes(cat.category_id)
                      ? 'bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 border-2 border-neon-pink text-white'
                      : 'bg-black/60 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="font-semibold">{cat.name_thai}</div>
                  <div className="text-xs text-gray-400">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">{t('settings.bio', 'Bio')}</h2>
            <textarea
              value={settings.bio}
              onChange={e => setSettings({ ...settings, bio: e.target.value })}
              placeholder={t('settings.bio_placeholder', 'Tell clients about yourself...')}
              rows={5}
              className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none transition resize-none"
            />
          </div>

          {/* Location */}
          <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">{t('settings.location', 'Service Location')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">{t('settings.province', 'Province')}</label>
                <input
                  type="text"
                  value={settings.province}
                  onChange={e => setSettings({ ...settings, province: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
                  placeholder={t('settings.province_placeholder', 'e.g. Bangkok')}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">{t('settings.district', 'District')}</label>
                <input
                  type="text"
                  value={settings.district}
                  onChange={e => setSettings({ ...settings, district: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
                  placeholder={t('settings.district_placeholder', 'e.g. Sukhumvit')}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">{t('settings.sub_district', 'Sub-district')}</label>
                <input
                  type="text"
                  value={settings.sub_district}
                  onChange={e => setSettings({ ...settings, sub_district: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">{t('settings.postal_code', 'Postal Code')}</label>
                <input
                  type="text"
                  value={settings.postal_code}
                  onChange={e => setSettings({ ...settings, postal_code: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
                  placeholder="10110"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-400 text-sm mb-2">{t('settings.address', 'Address')}</label>
              <input
                type="text"
                value={settings.address_line1}
                onChange={e => setSettings({ ...settings, address_line1: e.target.value })}
                className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
                placeholder={t('settings.address_placeholder', 'Street address (optional)')}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || selectedCategories.length === 0}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-neon-pink/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettingsPage;
