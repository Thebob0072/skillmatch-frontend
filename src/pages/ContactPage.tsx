import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-black/50 rounded-2xl p-8 border border-green-500/30">
          <span className="text-6xl mb-4 block">📬</span>
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            {t('contact_page.success_title', 'Message Sent!')}
          </h2>
          <p className="text-gray-400 mb-6">
            {t('contact_page.success_message', "We'll get back to you within 24-48 hours.")}
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-neon-pink text-white rounded-lg font-bold hover:bg-neon-pink/80 transition-colors"
          >
            {t('common.back_home', 'Back to Home')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-5xl mb-4 block">📧</span>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-4">
            {t('contact_page.title', 'Contact Us')}
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('contact_page.subtitle', "Have a question or need help? We're here for you 24/7.")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-black/40 rounded-2xl p-6 border border-neon-purple/20">
              <h3 className="text-xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                📍 {t('contact_page.office', 'Our Office')}
              </h3>
              <p className="text-gray-400">
                Thai Variety Entertainment Co., Ltd.<br />
                123 Sukhumvit Road, Watthana<br />
                Bangkok 10110, Thailand
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-neon-blue/20">
              <h3 className="text-xl font-bold text-neon-blue mb-4 flex items-center gap-2">
                📞 {t('contact_page.phone', 'Phone')}
              </h3>
              <p className="text-gray-400">
                +66 2 XXX XXXX<br />
                <span className="text-sm">{t('contact_page.hours', 'Mon-Sun, 24 hours')}</span>
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-neon-pink/20">
              <h3 className="text-xl font-bold text-neon-pink mb-4 flex items-center gap-2">
                ✉️ {t('contact_page.email', 'Email')}
              </h3>
              <p className="text-gray-400">
                support@thaivariety.com<br />
                business@thaivariety.com
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-neon-gold/20">
              <h3 className="text-xl font-bold text-neon-gold mb-4 flex items-center gap-2">
                💬 {t('contact_page.social', 'Social Media')}
              </h3>
              <div className="flex gap-4">
                <a href="#" className="text-3xl hover:scale-110 transition-transform">📘</a>
                <a href="#" className="text-3xl hover:scale-110 transition-transform">📷</a>
                <a href="#" className="text-3xl hover:scale-110 transition-transform">🐦</a>
                <a href="#" className="text-3xl hover:scale-110 transition-transform">💼</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-black/40 rounded-2xl p-6 sm:p-8 border border-neon-purple/20">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('contact_page.name_label', 'Your Name')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('contact_page.email_label', 'Email Address')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('contact_page.subject_label', 'Subject')} *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('contact_page.message_label', 'Message')} *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              {t('contact_page.send', 'Send Message')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
