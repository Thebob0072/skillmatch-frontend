import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-8 neon-text-effect animate-pulse-slow">
        {t('dashboard_title') || 'Dashboard'}
      </h1>
      <div className="glass-dark rounded-2xl p-8 shadow-glow-gold animate-float">
        <p className="text-gray-200 text-xl mb-4">
          {t('welcome_back') || 'Welcome back'}, <span className="font-bold text-yellow-300 neon-text-effect">{user?.username}</span>! ✨
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="glass-dark p-6 rounded-lg hover-lift shadow-glow-blue border border-blue-500 border-opacity-20 hover:border-opacity-50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-2">👤 {t(`dashboard_profile`)}</h3>
            <p className="text-gray-300">{t(`dashboard_profile_desc`)}</p>
          </div>
          <div className="glass-dark p-6 rounded-lg hover-lift shadow-glow-purple border border-purple-500 border-opacity-20 hover:border-opacity-50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-2">📅 {t(`dashboard_bookings`)}</h3>
            <p className="text-gray-300">{t(`dashboard_bookings_desc`)}</p>
          </div>
          <div className="glass-dark p-6 rounded-lg hover-lift shadow-glow-green border border-green-500 border-opacity-20 hover:border-opacity-50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-2">💬 {t(`dashboard_messages`)}</h3>
            <p className="text-gray-300">{t(`dashboard_messages_desc`)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
