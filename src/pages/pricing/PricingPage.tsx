import { useTranslation } from 'react-i18next';

export function PricingPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-6 sm:mb-8 lg:mb-12">
        {t('pricing_title') || 'Pricing Plans'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl border border-gray-700 hover:shadow-glow-blue transition-all">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{t(`pricing_basic`)}</h2>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400 mb-4 sm:mb-6">{t(`pricing_free`)}</div>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
            <li>✓ {t(`pricing_browse`)}</li>
            <li>✓ {t(`pricing_basic_search`)}</li>
            <li>✓ {t(`pricing_view_profiles`)}</li>
            <li>✓ {t(`pricing_book_services`)}</li>
          </ul>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors touch-manipulation">
            {t(`pricing_get_started`)}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-br from-purple-800 to-purple-900 p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl border-2 border-yellow-400 hover:shadow-glow-purple transition-all transform md:scale-105">
          <div className="text-yellow-400 text-xs sm:text-sm font-bold mb-2">{t(`pricing_most_popular`)}</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{t(`pricing_premium`)}</h2>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-300 mb-4 sm:mb-6">$9.99<span className="text-base sm:text-xl">{t(`pricing_per_month`)}</span></div>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-200 mb-6 sm:mb-8">
            <li>✓ {t(`pricing_everything_basic`)}</li>
            <li>✓ {t(`pricing_advanced_search`)}</li>
            <li>✓ {t(`pricing_priority_booking`)}</li>
            <li>✓ {t(`pricing_exclusive`)}</li>
            <li>✓ {t(`pricing_support_247`)}</li>
          </ul>
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors touch-manipulation">
            {t(`pricing_upgrade_now`)}
          </button>
        </div>

        {/* VIP Plan */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl border border-gray-700 hover:shadow-glow-green transition-all">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{t(`pricing_vip`)}</h2>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-400 mb-4 sm:mb-6">$24.99<span className="text-base sm:text-xl">{t(`pricing_per_month`)}</span></div>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
            <li>✓ {t(`pricing_everything_premium`)}</li>
            <li>✓ {t(`pricing_concierge`)}</li>
            <li>✓ {t(`pricing_custom_packages`)}</li>
            <li>✓ {t(`pricing_vip_only`)}</li>
            <li>✓ {t(`pricing_personal_assistant`)}</li>
          </ul>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors touch-manipulation">
            {t(`pricing_go_vip`)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
