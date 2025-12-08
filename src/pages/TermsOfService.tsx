import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfService: React.FC = () => {
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
          {t(`terms_title`)}
        </h1>
        <p className="text-gray-400 text-lg">{t(`terms_last_updated`)}</p>
      </div>

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-neon-red/20 to-neon-pink/20 backdrop-blur-xl p-6 rounded-2xl border-2 border-neon-red/50 mb-8">
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚠️</div>
          <div>
            <h3 className="text-neon-red font-black text-xl mb-2">{t(`terms_warning_title`)}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t(`terms_warning_desc`)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-gray-300">
        
        {/* Section 1 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/30">
          <h2 className="text-3xl font-black text-neon-gold mb-4 flex items-center gap-2">
            {t(`terms_section_1_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_1_content`)}</p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-pink/30">
          <h2 className="text-3xl font-black text-neon-purple mb-4 flex items-center gap-2">
            {t(`terms_section_2_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="bg-neon-red/10 p-4 rounded-xl border border-neon-red/30">
              <p className="text-neon-red font-bold">
                🔞 {t(`terms_section_2_warning`)}
              </p>
            </div>
            <p>{t(`terms_section_2_content`)}</p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-gold/30">
          <h2 className="text-3xl font-black text-neon-gold mb-4 flex items-center gap-2">
            {t(`terms_section_3_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_3_content`)}</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-blue/30">
          <h2 className="text-3xl font-black text-neon-blue mb-4 flex items-center gap-2">
            {t(`terms_section_4_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_4_content`)}</p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/30">
          <h2 className="text-3xl font-black text-neon-purple mb-4 flex items-center gap-2">
            {t(`terms_section_5_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_5_content`)}</p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-red/30">
          <h2 className="text-3xl font-black text-neon-red mb-4 flex items-center gap-2">
            {t(`terms_section_6_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="bg-neon-red/10 p-4 rounded-xl border border-neon-red/30">
              <p className="text-neon-red font-bold mb-2">🚫 {t(`terms_section_6_zero_tolerance`)}</p>
            </div>
            <p>{t(`terms_section_6_content`)}</p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-gold/30">
          <h2 className="text-3xl font-black text-neon-gold mb-4 flex items-center gap-2">
            {t(`terms_section_7_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_7_content`)}</p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-pink/30">
          <h2 className="text-3xl font-black text-neon-pink mb-4 flex items-center gap-2">
            {t(`terms_section_8_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_8_content`)}</p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/30">
          <h2 className="text-3xl font-black text-neon-purple mb-4 flex items-center gap-2">
            {t(`terms_section_9_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_9_content`)}</p>
          </div>
        </section>

        {/* Section 10 */}
        <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-neon-blue/30">
          <h2 className="text-3xl font-black text-neon-blue mb-4 flex items-center gap-2">
            {t(`terms_section_10_title`)}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>{t(`terms_section_10_content`)}</p>
          </div>
        </section>

      </div>

      {/* Final Notice */}
      <div className="mt-12 bg-gradient-to-r from-neon-gold/20 to-neon-red/20 backdrop-blur-xl p-6 rounded-2xl border-2 border-neon-gold/50 text-center">
        <p className="text-gray-300 text-sm leading-relaxed">
          By clicking "I Accept" or by using this Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
        <p className="text-neon-gold font-bold mt-4">
          © 2025 Thai Variety Entertainment - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export { TermsOfService };
export default TermsOfService;
