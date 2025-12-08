import { useTranslation } from 'react-i18next';

export function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">🍪</span>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-gold to-neon-purple mb-4">
            {t('cookies.title', 'Cookie Policy')}
          </h1>
          <p className="text-gray-400">
            {t('cookies.last_updated', 'Last updated: December 2025')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-gray-800">
            <h2 className="text-xl font-bold text-neon-gold mb-4">
              {t('cookies.what_are', 'What Are Cookies?')}
            </h2>
            <p className="text-gray-400">
              {t('cookies.what_are_desc', 'Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience by remembering your preferences, login status, and other settings.')}
            </p>
          </section>

          <section className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-gray-800">
            <h2 className="text-xl font-bold text-neon-purple mb-4">
              {t('cookies.types', 'Types of Cookies We Use')}
            </h2>
            <div className="space-y-4 text-gray-400">
              <div>
                <h3 className="text-white font-semibold mb-2">🔒 {t('cookies.essential', 'Essential Cookies')}</h3>
                <p>{t('cookies.essential_desc', 'Required for the website to function. These include authentication tokens and security cookies. Cannot be disabled.')}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">⚙️ {t('cookies.functional', 'Functional Cookies')}</h3>
                <p>{t('cookies.functional_desc', 'Remember your preferences like language selection, theme settings, and other customizations.')}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">📊 {t('cookies.analytics', 'Analytics Cookies')}</h3>
                <p>{t('cookies.analytics_desc', 'Help us understand how visitors use our website. We use this data to improve our services. Data is anonymized.')}</p>
              </div>
            </div>
          </section>

          <section className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-gray-800">
            <h2 className="text-xl font-bold text-neon-blue mb-4">
              {t('cookies.third_party', 'Third-Party Cookies')}
            </h2>
            <p className="text-gray-400 mb-4">
              {t('cookies.third_party_desc', 'We use the following third-party services that may set their own cookies:')}
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong>Stripe</strong> - {t('cookies.stripe', 'For secure payment processing')}</li>
              <li><strong>Google Analytics</strong> - {t('cookies.google', 'For website analytics')}</li>
              <li><strong>Google OAuth</strong> - {t('cookies.oauth', 'For social login functionality')}</li>
            </ul>
          </section>

          <section className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-gray-800">
            <h2 className="text-xl font-bold text-neon-pink mb-4">
              {t('cookies.manage', 'Managing Cookies')}
            </h2>
            <p className="text-gray-400 mb-4">
              {t('cookies.manage_desc', 'You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.')}
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-500">
              <p className="font-semibold text-gray-300 mb-2">{t('cookies.browser_settings', 'Browser Settings:')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Chrome: Settings → Privacy and security → Cookies</li>
                <li>Firefox: Settings → Privacy & Security → Cookies</li>
                <li>Safari: Preferences → Privacy → Cookies</li>
                <li>Edge: Settings → Privacy → Cookies</li>
              </ul>
            </div>
          </section>

          <section className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">
              {t('cookies.contact', 'Questions?')}
            </h2>
            <p className="text-gray-400">
              {t('cookies.contact_desc', 'If you have any questions about our cookie policy, please contact us at')}{' '}
              <a href="mailto:privacy@thaivariety.com" className="text-neon-pink hover:underline">
                privacy@thaivariety.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CookiePolicy;
