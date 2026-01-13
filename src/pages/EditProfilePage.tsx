import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export function EditProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12 max-w-2xl">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-6 sm:mb-8 neon-text-effect animate-pulse-slow">
        {t('edit_profile_title') || 'Edit Profile'}
      </h1>
      <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-glow-gold animate-float">
        <form className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-gray-200 mb-2 font-semibold text-sm sm:text-base">{t(`edit_profile_username`)}</label>
            <input
              type="text"
              defaultValue={user?.username}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black bg-opacity-40 border border-yellow-500 border-opacity-30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-2 font-semibold text-sm sm:text-base">{t(`edit_profile_email`)}</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black bg-opacity-40 border border-yellow-500 border-opacity-30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-2 font-semibold text-sm sm:text-base">Bio</label>
            <textarea
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black bg-opacity-40 border border-yellow-500 border-opacity-30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-gray-900 font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all transform hover:scale-105 neon-effect-gold shadow-glow-gold touch-manipulation"
          >
            {t('save_changes') || 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
