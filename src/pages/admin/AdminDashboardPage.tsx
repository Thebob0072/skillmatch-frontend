import { useTranslation } from 'react-i18next';

export function AdminDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-8">
        {t('admin_dashboard_title') || 'Admin Dashboard'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-xl">
          <h3 className="text-white text-lg mb-2">{t('admin_dashboard.total_users')}</h3>
          <div className="text-4xl font-bold text-white">1,234</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-xl">
          <h3 className="text-white text-lg mb-2">{t('admin_dashboard.active_companions')}</h3>
          <div className="text-4xl font-bold text-white">567</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-xl shadow-xl">
          <h3 className="text-white text-lg mb-2">{t('admin_dashboard.pending_verifications')}</h3>
          <div className="text-4xl font-bold text-white">23</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-xl">
          <h3 className="text-white text-lg mb-2">{t('admin_dashboard.total_bookings')}</h3>
          <div className="text-4xl font-bold text-white">891</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">{t('admin_dashboard.recent_activity')}</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <div>
                <p className="text-white font-semibold">{t('admin_dashboard.user_action')} {i}</p>
                <p className="text-gray-400 text-sm">2 {t('admin_dashboard.hours_ago')}</p>
              </div>
              <span className="text-green-400">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
