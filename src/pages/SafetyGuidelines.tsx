import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function SafetyGuidelines() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-6xl mb-4 block">🛡️</span>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue mb-4">
            {t('safety_page.title', 'Safety Guidelines')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('safety_page.subtitle', 'Your safety is our top priority. Please read these guidelines carefully.')}
          </p>
        </div>

        <div className="space-y-8">
          {/* For Clients */}
          <section className="bg-gradient-to-r from-black/60 to-neon-blue/5 rounded-2xl p-6 sm:p-8 border border-neon-blue/20">
            <h2 className="text-2xl font-bold text-neon-blue mb-6 flex items-center gap-3">
              👤 {t('safety_page.for_clients', 'For Clients')}
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.client_tip_1', 'Always meet providers in safe, public places first')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.client_tip_2', 'Verify provider identity through our verification system')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.client_tip_3', 'Use only the in-app payment system for protection')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.client_tip_4', 'Report any suspicious behavior immediately')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.client_tip_5', 'Never share personal financial information')}</span>
              </li>
            </ul>
          </section>

          {/* For Providers */}
          <section className="bg-gradient-to-r from-black/60 to-neon-pink/5 rounded-2xl p-6 sm:p-8 border border-neon-pink/20">
            <h2 className="text-2xl font-bold text-neon-pink mb-6 flex items-center gap-3">
              💼 {t('safety_page.for_providers', 'For Providers')}
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.provider_tip_1', 'Always use the Check-In feature when starting a session')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.provider_tip_2', 'Keep your GPS tracking enabled during work')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.provider_tip_3', 'Set up trusted emergency contacts')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.provider_tip_4', 'Know where the SOS button is and how to use it')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{t('safety_page.provider_tip_5', 'Trust your instincts - decline any booking that feels unsafe')}</span>
              </li>
            </ul>
          </section>

          {/* Emergency */}
          <section className="bg-gradient-to-r from-neon-red/20 to-red-900/20 rounded-2xl p-6 sm:p-8 border border-neon-red/30">
            <h2 className="text-2xl font-bold text-neon-red mb-6 flex items-center gap-3">
              🆘 {t('safety_page.emergency', 'Emergency Procedures')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>{t('safety_page.emergency_desc', 'In case of emergency:')}</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>{t('safety_page.emergency_step_1', 'Press the SOS button in the app immediately')}</li>
                <li>{t('safety_page.emergency_step_2', 'Your location will be shared with admin and trusted contacts')}</li>
                <li>{t('safety_page.emergency_step_3', 'Call local emergency services: 191 (Police), 1669 (Medical)')}</li>
                <li>{t('safety_page.emergency_step_4', 'Our team will contact you within minutes')}</li>
              </ol>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-black/60 to-neon-purple/5 rounded-2xl p-6 sm:p-8 border border-neon-purple/20 text-center">
            <h2 className="text-2xl font-bold text-neon-purple mb-4">
              {t('safety_page.need_help', 'Need Help?')}
            </h2>
            <p className="text-gray-400 mb-6">
              {t('safety_page.contact_support', 'Our support team is available 24/7')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact"
                className="px-6 py-3 bg-neon-purple/20 text-neon-purple rounded-lg font-bold hover:bg-neon-purple/30 transition-colors"
              >
                📧 {t('safety_page.contact_us', 'Contact Us')}
              </Link>
              <Link 
                to="/report"
                className="px-6 py-3 bg-neon-red/20 text-neon-red rounded-lg font-bold hover:bg-neon-red/30 transition-colors"
              >
                🚨 {t('safety_page.report_issue', 'Report an Issue')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SafetyGuidelines;
