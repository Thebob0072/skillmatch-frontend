import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4" style={{
          background: 'linear-gradient(to right, #ff10f0, #9d00ff, #ffd700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'brightness(1.3)',
          display: 'inline-block'
        }}>
          {t(`privacy_title`)}
        </h1>
        <p className="text-gray-400 text-lg">{t(`privacy_last_updated`)}</p>
      </div>

      {/* Privacy Banner */}
      <div className="bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 backdrop-blur-xl p-6 rounded-2xl border-2 border-neon-purple/50 mb-8">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🔒</div>
          <div>
            <h3 className="text-neon-purple font-black text-xl mb-2">{t(`privacy_banner_title`)}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t(`privacy_banner_desc`)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-gray-300">
        
        {/* Section 1 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/30">
          <h2 className="text-3xl font-black text-neon-gold mb-4 flex items-center gap-2">
            {t(`privacy_section_1_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p className="font-bold text-white">{t(`privacy_section_1_personal_info`)}</p>
            <p>{t(`privacy_section_1_personal_content`)}</p>
            
            <p className="font-bold text-white mt-6">{t(`privacy_section_1_automatic_data`)}</p>
            <p>{t(`privacy_section_1_automatic_content`)}</p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-pink/30">
          <h2 className="text-3xl font-black text-neon-purple mb-4 flex items-center gap-2">
            {t(`privacy_section_2_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_2_content`)}</p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-gold/30">
          <h2 className="text-3xl font-black text-neon-gold mb-4 flex items-center gap-2">
            {t(`privacy_section_3_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="bg-neon-red/10 p-4 rounded-xl border border-neon-red/30 mb-4">
              <p className="text-neon-red font-bold text-sm">
                🚫 {t(`privacy_section_3_never_sell`)}
              </p>
            </div>
            <p>{t(`privacy_section_3_content`)}</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-blue/30">
          <h2 className="text-3xl font-black text-neon-blue mb-4 flex items-center gap-2">
            {t(`privacy_section_4_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_4_content`)}</p>

          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/30">
          <h2 className="text-3xl font-black text-neon-purple mb-4 flex items-center gap-2">
            {t(`privacy_section_5_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_5_content`)}</p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-pink/30">
          <h2 className="text-3xl font-black text-neon-pink mb-4 flex items-center gap-2">
            {t(`privacy_section_6_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_6_content`)}</p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-gold/30">
          <h2 className="text-3xl font-black text-neon-gold mb-4 flex items-center gap-2">
            {t(`privacy_section_7_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_7_content`)}</p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-blue/30">
          <h2 className="text-3xl font-black text-neon-blue mb-4 flex items-center gap-2">
            {t(`privacy_section_8_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="bg-neon-red/10 p-4 rounded-xl border border-neon-red/30">
              <p className="text-neon-red font-bold text-sm">
                ⚠️ {t(`privacy_section_8_warning`)}
              </p>
            </div>
            <p>{t(`privacy_section_8_content`)}</p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/30">
          <h2 className="text-3xl font-black text-neon-purple mb-4 flex items-center gap-2">
            {t(`privacy_section_9_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_9_content`)}</p>
          </div>
        </section>

        {/* Section 10 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-pink/30">
          <h2 className="text-3xl font-black text-neon-pink mb-4 flex items-center gap-2">
            {t(`privacy_section_10_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_10_content`)}</p>
          </div>
        </section>

        {/* Section 11 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-gold/30">
          <h2 className="text-3xl font-black text-neon-gold mb-4 flex items-center gap-2">
            {t(`privacy_section_11_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`privacy_section_11_content`)}</p>
          </div>
        </section>

      </div>

      {/* Final Notice */}
      <div className="mt-12 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 backdrop-blur-xl p-6 rounded-2xl border-2 border-neon-purple/50 text-center">
        <p className="text-gray-300 text-sm leading-relaxed">
          Your privacy and security are our top priorities. We are committed to transparency and protecting your personal information.
        </p>
        <p className="text-neon-purple font-bold mt-4">
          🔒 Protected by AES-256 Encryption | GDPR & Thai PDPA Compliant
        </p>
      </div>
    </div>
  );
};

export { PrivacyPolicy };
export default PrivacyPolicy;
