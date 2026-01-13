import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-6 sm:mb-8 neon-text-effect animate-pulse-slow">
        {t('dashboard_title') || 'Dashboard'}
      </h1>
      <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-glow-gold animate-float">
        <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">
          {t('welcome_back') || 'Welcome back'}, <span className="font-bold text-yellow-300 neon-text-effect">{user?.username}</span>! ✨
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
          <div className="glass-dark p-4 sm:p-5 lg:p-6 rounded-lg hover-lift shadow-glow-blue border border-blue-500 border-opacity-20 hover:border-opacity-50 transition-all">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">👤 {t(`dashboard_profile`)}</h3>
            <p className="text-sm sm:text-base text-gray-300">{t(`dashboard_profile_desc`)}</p>
          </div>
          <div className="glass-dark p-4 sm:p-5 lg:p-6 rounded-lg hover-lift shadow-glow-purple border border-purple-500 border-opacity-20 hover:border-opacity-50 transition-all">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">📅 {t(`dashboard_bookings`)}</h3>
            <p className="text-sm sm:text-base text-gray-300">{t(`dashboard_bookings_desc`)}</p>
          </div>
          {/* Wallet - Available for Everyone */}
          <a 
            href="/financial" 
            className="glass-dark p-4 sm:p-5 lg:p-6 rounded-lg hover-lift shadow-glow-gold border border-green-500 border-opacity-20 hover:border-opacity-50 transition-all cursor-pointer group"
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">💰 {t(`wallet.my_wallet`)}</h3>
            <p className="text-sm sm:text-base text-gray-300">{t(`dashboard_wallet_desc`)}</p>
            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-green-400 font-semibold">
              <span>🔒</span>
              <span>{t('wallet.safe_secure')}</span>
            </div>
          </a>
          <div className="glass-dark p-4 sm:p-5 lg:p-6 rounded-lg hover-lift shadow-glow-green border border-green-500 border-opacity-20 hover:border-opacity-50 transition-all">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">💬 {t(`dashboard_messages`)}</h3>
            <p className="text-sm sm:text-base text-gray-300">{t(`dashboard_messages_desc`)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
