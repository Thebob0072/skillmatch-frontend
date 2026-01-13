import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQPage() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t('faq.categories.all', 'All') },
    { id: 'general', label: t('faq.categories.general', 'General') },
    { id: 'booking', label: t('faq.categories.booking', 'Booking') },
    { id: 'payment', label: t('faq.categories.payment', 'Payment') },
    { id: 'safety', label: t('faq.categories.safety', 'Safety') },
    { id: 'provider', label: t('faq.categories.provider', 'For Providers') }
  ];

  const faqs: FAQItem[] = [
    // General
    {
      category: 'general',
      question: t('faq.q1', 'What is Thai Variety Entertainment?'),
      answer: t('faq.a1', 'Thai Variety Entertainment is a premium adult entertainment platform that connects verified providers with clients. We ensure safety, privacy, and quality through our verification system.')
    },
    {
      category: 'general',
      question: t('faq.q2', 'What are the age requirements?'),
      answer: t('faq.a2', 'You must be at least 20 years old to use our platform. All users undergo age verification during registration.')
    },
    {
      category: 'general',
      question: t('faq.q3', 'Is the platform legal?'),
      answer: t('faq.a3', 'Yes, we operate within Thai legal frameworks and comply with all applicable regulations. Adult entertainment services are regulated in Thailand.')
    },
    // Booking
    {
      category: 'booking',
      question: t('faq.q4', 'How do I book a provider?'),
      answer: t('faq.a4', 'Browse our verified providers, select your preferred package, choose a date and time, and complete the payment. The provider will confirm your booking.')
    },
    {
      category: 'booking',
      question: t('faq.q5', 'Can I cancel a booking?'),
      answer: t('faq.a5', 'Yes, you can cancel a booking before it is confirmed. After confirmation, cancellation policies depend on the time remaining before the appointment.')
    },
    {
      category: 'booking',
      question: t('faq.q6', 'Can I extend my session?'),
      answer: t('faq.a6', 'Yes! During an active session, you can extend your booking time directly through the app. Simply pay for the additional time and continue your session.')
    },
    // Payment
    {
      category: 'payment',
      question: t('faq.q7', 'What payment methods are accepted?'),
      answer: t('faq.a7', 'We accept credit/debit cards via Stripe, PromptPay, and bank transfers. All payments are secure and encrypted.')
    },
    {
      category: 'payment',
      question: t('faq.q8', 'How does the escrow system work?'),
      answer: t('faq.a8', 'When you pay for a booking, the money is held securely by our platform. After the service is completed (provider checks out), the payment is released to the provider minus our commission.')
    },
    {
      category: 'payment',
      question: t('faq.q9', 'What are the fees?'),
      answer: t('faq.a9', 'Providers pay a 10% platform commission + 2.75% payment processing fee. Clients pay no additional fees beyond the listed prices.')
    },
    // Safety
    {
      category: 'safety',
      question: t('faq.q10', 'How do you verify providers?'),
      answer: t('faq.a10', 'All providers undergo ID verification, face verification, and background checks. Only verified providers can accept bookings.')
    },
    {
      category: 'safety',
      question: t('faq.q11', 'What is the SOS feature?'),
      answer: t('faq.a11', 'The SOS button allows providers to immediately alert our admin team and trusted contacts in case of emergency. Location data is shared for quick response.')
    },
    {
      category: 'safety',
      question: t('faq.q12', 'How is my privacy protected?'),
      answer: t('faq.a12', 'We use encrypted communications, secure payments, and never share your personal information. Your booking history is confidential.')
    },
    // Provider
    {
      category: 'provider',
      question: t('faq.q13', 'How do I become a provider?'),
      answer: t('faq.a13', 'Register as a provider, complete your profile, upload photos, verify your identity (ID + Face), and wait for approval. Once approved, you can start accepting bookings.')
    },
    {
      category: 'provider',
      question: t('faq.q14', 'When do I get paid?'),
      answer: t('faq.a14', 'Payments are released to your wallet immediately after you check out from a session. You can then withdraw to your bank account.')
    },
    {
      category: 'provider',
      question: t('faq.q15', 'What are the subscription tiers?'),
      answer: t('faq.a15', 'We offer General (free), VIP, and Diamond tiers. Higher tiers provide better visibility, more bookings, and premium features. Check our Pricing page for details.')
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">❓</span>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-gold to-neon-pink mb-3 sm:mb-4 px-4">
            {t('faq.title', 'Frequently Asked Questions')}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 px-4">
            {t('faq.subtitle', 'Find answers to common questions about our platform.')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                activeCategory === cat.id
                  ? 'bg-neon-pink text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-2 sm:space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-black/40 rounded-lg sm:rounded-xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors touch-manipulation"
              >
                <span className="font-medium text-sm sm:text-base text-white pr-3 sm:pr-4">{faq.question}</span>
                <span className={`text-neon-pink transition-transform flex-shrink-0 ${activeIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-400 border-t border-gray-800/50 pt-3 sm:pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 sm:mt-10 lg:mt-12 text-center bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-neon-purple/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
            {t('faq.still_need_help', "Still have questions?")}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 px-4">
            {t('faq.contact_us', "Our support team is ready to help you 24/7.")}
          </p>
          <a 
            href="/contact"
            className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-lg font-bold hover:opacity-90 transition-opacity touch-manipulation"
          >
            {t('faq.contact_button', 'Contact Support')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
