import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

interface Photo {
  photo_id: number;
  photo_url: string;
  thumbnail_url?: string;
  is_primary: boolean;
  is_verified: boolean;
  is_private: boolean;
  display_order: number;
  created_at: string;
}

export const ProviderPhotoGallery: React.FC = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/provider/photos');
      setPhotos(response.data || []);
    } catch (err) {
      setError(t('photos.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        // Validate file
        if (!file.type.startsWith('image/')) {
          setError(t('photos.invalidType'));
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          setError(t('photos.tooLarge'));
          continue;
        }

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('is_private', 'false');

        const response = await api.post('/provider/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setPhotos(prev => [...prev, response.data]);
      }
      setSuccess(t('photos.uploadSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('photos.uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (photoId: number) => {
    try {
      await api.put(`/provider/photos/${photoId}/primary`);
      setPhotos(photos.map(p => ({
        ...p,
        is_primary: p.photo_id === photoId,
      })));
      setSuccess(t('photos.primarySet'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('photos.updateError'));
    }
  };

  const handleTogglePrivate = async (photo: Photo) => {
    try {
      await api.put(`/provider/photos/${photo.photo_id}`, {
        is_private: !photo.is_private,
      });
      setPhotos(photos.map(p => 
        p.photo_id === photo.photo_id ? { ...p, is_private: !p.is_private } : p
      ));
      setSuccess(t('photos.updateSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('photos.updateError'));
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm(t('photos.deleteConfirm'))) return;

    try {
      await api.delete(`/provider/photos/${photoId}`);
      setPhotos(photos.filter(p => p.photo_id !== photoId));
      setSelectedPhoto(null);
      setSuccess(t('photos.deleteSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('photos.deleteError'));
    }
  };

  const handleReorder = async (photoId: number, direction: 'up' | 'down') => {
    const index = photos.findIndex(p => p.photo_id === photoId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === photos.length - 1)
    ) return;

    const newPhotos = [...photos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]];
    
    // Update display orders
    newPhotos.forEach((p, i) => {
      p.display_order = i + 1;
    });
    
    setPhotos(newPhotos);

    try {
      await api.put('/provider/photos/reorder', {
        photo_ids: newPhotos.map(p => p.photo_id),
      });
    } catch (err) {
      setError(t('photos.reorderError'));
      fetchPhotos(); // Revert on error
    }
  };

  const publicPhotos = photos.filter(p => !p.is_private);
  const privatePhotos = photos.filter(p => p.is_private);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              📸 {t('photos.title')}
            </span>
          </h1>
          <p className="text-gray-400">{t('photos.subtitle')}</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-2">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-xl text-green-400">
            {success}
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-8">
          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isUploading 
              ? 'border-neon-purple bg-neon-purple/10' 
              : 'border-neon-pink/50 hover:border-neon-pink hover:bg-neon-pink/5'
          }`}>
            {isUploading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-neon-purple mb-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-neon-purple">{t('photos.uploading')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-5xl mb-3">📤</span>
                <p className="text-gray-300 font-medium">{t('photos.dropOrClick')}</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (MAX. 5MB each)</p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Photo Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-black/30 rounded-xl p-4 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-neon-pink">{photos.length}</div>
            <div className="text-gray-400 text-sm">{t('photos.total')}</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-neon-green">{publicPhotos.length}</div>
            <div className="text-gray-400 text-sm">{t('photos.public')}</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-neon-purple">{privatePhotos.length}</div>
            <div className="text-gray-400 text-sm">{t('photos.private')}</div>
          </div>
        </div>

        {/* Public Photos */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🌐 {t('photos.publicPhotos')}
            <span className="text-sm font-normal text-gray-400">({t('photos.visibleToAll')})</span>
          </h2>

          {publicPhotos.length === 0 ? (
            <div className="bg-black/30 rounded-2xl border border-gray-700 p-12 text-center">
              <span className="text-6xl block mb-4">🖼️</span>
              <p className="text-gray-400">{t('photos.noPublicPhotos')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {publicPhotos.map((photo, index) => (
                <div
                  key={photo.photo_id}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer border-2 transition-all ${
                    photo.is_primary 
                      ? 'border-neon-gold shadow-[0_0_20px_rgba(255,215,0,0.4)]' 
                      : 'border-transparent hover:border-neon-pink'
                  }`}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.thumbnail_url || photo.photo_url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <div className="flex gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); handleReorder(photo.photo_id, 'up'); }}
                          className="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/30"
                          disabled={index === 0}
                        >
                          ←
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleReorder(photo.photo_id, 'down'); }}
                          className="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/30"
                          disabled={index === publicPhotos.length - 1}
                        >
                          →
                        </button>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(photo.photo_id); }}
                        className="p-1 bg-red-500/50 rounded text-white text-xs hover:bg-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {photo.is_primary && (
                      <span className="px-2 py-0.5 bg-neon-gold text-black text-xs font-bold rounded">
                        MAIN
                      </span>
                    )}
                    {photo.is_verified && (
                      <span className="px-2 py-0.5 bg-neon-blue text-white text-xs font-bold rounded">
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Private Photos */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🔐 {t('photos.privatePhotos')}
            <span className="text-sm font-normal text-gray-400">({t('photos.paidAccessOnly')})</span>
          </h2>

          {privatePhotos.length === 0 ? (
            <div className="bg-black/30 rounded-2xl border border-neon-purple/30 p-12 text-center">
              <span className="text-6xl block mb-4">🔒</span>
              <p className="text-gray-400">{t('photos.noPrivatePhotos')}</p>
              <p className="text-gray-500 text-sm mt-2">{t('photos.privatePhotosHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {privatePhotos.map((photo, index) => (
                <div
                  key={photo.photo_id}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer border-2 border-neon-purple/30 hover:border-neon-purple"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.thumbnail_url || photo.photo_url}
                    alt={`Private photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Private overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-3xl">🔒</span>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(photo.photo_id); }}
                        className="p-1 bg-red-500/50 rounded text-white text-xs hover:bg-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedPhoto(null)}
          >
            <div 
              className="bg-gray-900 rounded-2xl max-w-2xl w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">{t('photos.photoDetails')}</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedPhoto.photo_url}
                alt="Selected photo"
                className="w-full rounded-xl mb-4 max-h-96 object-contain"
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSetPrimary(selectedPhoto.photo_id)}
                  disabled={selectedPhoto.is_primary}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    selectedPhoto.is_primary
                      ? 'bg-neon-gold/20 text-neon-gold cursor-not-allowed'
                      : 'bg-neon-gold text-black hover:bg-neon-gold/80'
                  }`}
                >
                  {selectedPhoto.is_primary ? '⭐ Main Photo' : '⭐ Set as Main'}
                </button>
                
                <button
                  onClick={() => handleTogglePrivate(selectedPhoto)}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    selectedPhoto.is_private
                      ? 'bg-neon-green text-black hover:bg-neon-green/80'
                      : 'bg-neon-purple text-white hover:bg-neon-purple/80'
                  }`}
                >
                  {selectedPhoto.is_private ? '🌐 Make Public' : '🔐 Make Private'}
                </button>
              </div>

              <button
                onClick={() => handleDelete(selectedPhoto.photo_id)}
                className="w-full mt-4 py-3 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition-all"
              >
                🗑️ {t('photos.delete')}
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-neon-blue/10 border border-neon-blue/30 rounded-2xl p-6">
          <h3 className="text-neon-blue font-bold mb-3">📌 {t('photos.tips')}</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Use high-quality, well-lit photos</li>
            <li>• Set your best photo as the main profile picture</li>
            <li>• Private photos can generate extra income</li>
            <li>• Verified photos build trust with clients</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProviderPhotoGallery;
