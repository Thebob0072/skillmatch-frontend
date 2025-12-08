import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export function ReportPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    report_type: '',
    reported_user_id: '',
    description: '',
    evidence_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportTypes = [
    { value: 'harassment', label: t('report_page.types.harassment', 'Harassment') },
    { value: 'scam', label: t('report_page.types.scam', 'Scam/Fraud') },
    { value: 'fake_profile', label: t('report_page.types.fake_profile', 'Fake Profile') },
    { value: 'inappropriate', label: t('report_page.types.inappropriate', 'Inappropriate Content') },
    { value: 'safety', label: t('report_page.types.safety', 'Safety Concern') },
    { value: 'other', label: t('report_page.types.other', 'Other') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/reports', {
        report_type: formData.report_type,
        reported_user_id: formData.reported_user_id ? parseInt(formData.reported_user_id) : null,
        description: formData.description,
        evidence_url: formData.evidence_url || null
      });
      setSubmitted(true);
    } catch (err) {
      setError(t('report_page.error', 'Failed to submit report. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-black/50 rounded-2xl p-8 border border-green-500/30">
          <span className="text-6xl mb-4 block">✅</span>
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            {t('report_page.success_title', 'Report Submitted')}
          </h2>
          <p className="text-gray-400 mb-6">
            {t('report_page.success_message', 'Thank you for your report. Our team will review it within 24 hours.')}
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">🚨</span>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-red to-neon-pink mb-4">
            {t('report_page.title', 'Report an Issue')}
          </h1>
          <p className="text-gray-400">
            {t('report_page.subtitle', 'Help us maintain a safe community by reporting violations.')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 rounded-2xl p-6 sm:p-8 border border-neon-red/20">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('report_page.type_label', 'Type of Report')} *
            </label>
            <select
              value={formData.report_type}
              onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
            >
              <option value="">{t('report_page.select_type', 'Select a type...')}</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reported User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('report_page.user_id_label', 'User ID (if applicable)')}
            </label>
            <input
              type="text"
              value={formData.reported_user_id}
              onChange={(e) => setFormData({ ...formData, reported_user_id: e.target.value })}
              placeholder={t('report_page.user_id_placeholder', 'Enter user ID or username')}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('report_page.description_label', 'Description')} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              placeholder={t('report_page.description_placeholder', 'Please describe the issue in detail...')}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink resize-none"
            />
          </div>

          {/* Evidence URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('report_page.evidence_label', 'Evidence URL (optional)')}
            </label>
            <input
              type="url"
              value={formData.evidence_url}
              onChange={(e) => setFormData({ ...formData, evidence_url: e.target.value })}
              placeholder={t('report_page.evidence_placeholder', 'Link to screenshot or evidence')}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-neon-red to-neon-pink text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('common.submitting', 'Submitting...') : t('report_page.submit', 'Submit Report')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportPage;
