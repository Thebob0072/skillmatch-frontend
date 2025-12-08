import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPrivateGallerySettings,
  updatePrivateGallerySettings,
  uploadPrivatePhoto,
  PrivateGallerySettings
} from '../../services/safetyService';

export const PrivateGalleryManager: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<PrivateGallerySettings | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    is_enabled: false,
    monthly_price: 0,
    one_time_price: 0,
    allow_one_time: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getPrivateGallerySettings();
      setSettings(data);
      setFormData({
        is_enabled: data.is_enabled,
        monthly_price: data.monthly_price || 0,
        one_time_price: data.one_time_price || 0,
        allow_one_time: data.allow_one_time
      });
    } catch (err) {
      setError(t('privateGallery.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updatePrivateGallerySettings({
        is_enabled: formData.is_enabled,
        monthly_price: formData.monthly_price || undefined,
        one_time_price: formData.allow_one_time ? (formData.one_time_price || undefined) : undefined,
        allow_one_time: formData.allow_one_time
      });
      setSuccess(t('privateGallery.saveSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('privateGallery.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError(t('privateGallery.invalidFile'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError(t('privateGallery.fileTooLarge'));
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const result = await uploadPrivatePhoto(file);
      setPhotos([...photos, result]);
      setSuccess(t('privateGallery.uploadSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('privateGallery.uploadError'));
    } finally {
      setIsUploading(false);
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
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔐</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('privateGallery.title')}
              </h2>
              <p className="text-sm text-gray-500">
                {t('privateGallery.description')}
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
                  {t('privateGallery.enable')}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('privateGallery.enableDescription')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_enabled}
                  onChange={e => setFormData({ ...formData, is_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {formData.is_enabled && (
              <>
                {/* Monthly Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('privateGallery.monthlyPrice')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.monthly_price}
                      onChange={e => setFormData({ ...formData, monthly_price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
                      placeholder="199"
                      min="0"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">฿/เดือน</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('privateGallery.monthlyPriceDescription')}
                  </p>
                </div>

                {/* Allow One-time */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allow_one_time"
                    checked={formData.allow_one_time}
                    onChange={e => setFormData({ ...formData, allow_one_time: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <label htmlFor="allow_one_time" className="text-sm text-gray-700">
                    {t('privateGallery.allowOneTime')}
                  </label>
                </div>

                {/* One-time Price */}
                {formData.allow_one_time && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('privateGallery.oneTimePrice')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.one_time_price}
                        onChange={e => setFormData({ ...formData, one_time_price: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
                        placeholder="499"
                        min="0"
                      />
                      <span className="absolute right-4 top-3 text-gray-500">฿</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('privateGallery.oneTimePriceDescription')}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? t('common.saving') : t('common.saveSettings')}
            </button>
          </div>
        </div>
      </div>

      {/* Photo Upload Section */}
      {formData.is_enabled && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t('privateGallery.uploadPhotos')}
            </h3>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-10 w-10 text-purple-600 mb-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-gray-500">{t('common.uploading')}</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl mb-2">📸</span>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">{t('privateGallery.clickToUpload')}</span>
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (MAX. 10MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.photo_url || photo.thumbnail_url}
                      alt={`Private photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded">
                        🔐
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              {t('privateGallery.photoNote')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateGalleryManager;
