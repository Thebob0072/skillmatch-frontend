import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export function EditProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-8 neon-text-effect animate-pulse-slow">
        {t('edit_profile_title') || 'Edit Profile'}
      </h1>
      <div className="glass-dark rounded-2xl p-8 shadow-glow-gold animate-float">
        <form className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-2 font-semibold">{t(`edit_profile_username`)}</label>
            <input
              type="text"
              defaultValue={user?.username}
              className="w-full px-4 py-3 bg-black bg-opacity-40 border border-yellow-500 border-opacity-30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-2 font-semibold">{t(`edit_profile_email`)}</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-4 py-3 bg-black bg-opacity-40 border border-yellow-500 border-opacity-30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-2 font-semibold">Bio</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-black bg-opacity-40 border border-yellow-500 border-opacity-30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 neon-effect-gold shadow-glow-gold"
          >
            {t('save_changes') || 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
