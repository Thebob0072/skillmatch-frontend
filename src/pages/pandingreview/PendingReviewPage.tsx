import { useTranslation } from 'react-i18next';

export function PendingReviewPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
      <div className="text-6xl mb-6">⏳</div>
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        {t('pending_review_title') || 'Verification Pending'}
      </h1>
      <p className="text-gray-300 text-lg">
        {t('pending_review_message') || 'Your documents are being reviewed by our team. This usually takes 24-48 hours.'}
      </p>
    </div>
  );
}

export default PendingReviewPage;
