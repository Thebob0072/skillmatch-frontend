import { useTranslation } from 'react-i18next';

export function ManagePhotosPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8 neon-text-effect animate-pulse-slow">
        {t('manage_photos_title') || 'Manage Photos'}
      </h1>
      <div className="glass-dark rounded-2xl p-8 shadow-glow-purple animate-float">
        <div className="border-2 border-dashed border-purple-500 border-opacity-30 rounded-lg p-12 text-center hover:border-purple-400 hover:border-opacity-100 transition-all cursor-pointer hover-lift glass-dark">
          <div className="text-8xl mb-4 animate-pulse-slow">📸</div>
          <p className="text-gray-200 text-xl mb-2 font-semibold">Click to upload photos</p>
          <p className="text-gray-400 text-sm">Max 10 photos, 10MB each</p>
        </div>
      </div>
    </div>
  );
}

export default ManagePhotosPage;
