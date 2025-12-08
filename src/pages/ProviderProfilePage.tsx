import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ProviderProfilePage() {
  const { userId } = useParams();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl mb-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{t('provider_profile.companion_title')} #{userId || t('provider_profile.loading')}</h1>
              <p className="text-gray-400 mb-4">{t('provider_profile.verified_premium')}</p>
              <div className="flex items-center gap-4">
                <span className="text-yellow-400">⭐ 4.9 ({t('provider_profile.reviews_count', { count: 123 })})</span>
                <span className="text-green-400">✓ {t('provider_profile.verified')}</span>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-lg transition-colors">
              {t('provider_profile.book_now')}
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{t('provider_profile.about')}</h2>
          <p className="text-gray-300 leading-relaxed">
            {t('provider_profile.about_placeholder')}
          </p>
        </div>

        {/* Services Section */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">{t('provider_profile.services')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-bold">{t('provider_profile.service_item', { number: i })}</h3>
                <p className="text-gray-400 text-sm">{t('provider_profile.starting_from', { price: 50 })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfilePage;
