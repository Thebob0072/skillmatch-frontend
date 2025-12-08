import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { uploadPhotoForVerification } from '../../services/promotionService';

interface VerifiedPhotoBadgeProps {
  isVerified?: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected' | null;
  showUpload?: boolean;
  onVerificationSubmitted?: () => void;
}

export const VerifiedPhotoBadge: React.FC<VerifiedPhotoBadgeProps> = ({
  isVerified = false,
  verificationStatus = null,
  showUpload = false,
  onVerificationSubmitted
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setError(t('verification.invalidFile'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t('verification.fileTooLarge'));
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      await uploadPhotoForVerification(file);
      setShowModal(false);
      onVerificationSubmitted?.();
    } catch (err) {
      setError(t('verification.uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  // Badge display
  const renderBadge = () => {
    if (isVerified) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {t('verification.verified')}
        </div>
      );
    }

    if (verificationStatus === 'pending') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t('verification.pending')}
        </div>
      );
    }

    if (verificationStatus === 'rejected') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {t('verification.rejected')}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="inline-flex items-center gap-2">
        {renderBadge()}
        
        {showUpload && !isVerified && verificationStatus !== 'pending' && (
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            {t('verification.getVerified')}
          </button>
        )}
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {t('verification.title')}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  {t('verification.instructions')}
                </h4>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">1.</span>
                    <span>{t('verification.step1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">2.</span>
                    <span>{t('verification.step2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">3.</span>
                    <span>{t('verification.step3')}</span>
                  </li>
                </ol>
              </div>

              {/* Example Image */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg">
                  <span className="text-6xl">🤳</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('verification.exampleNote')}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Upload Button */}
              <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold cursor-pointer transition-colors ${
                isUploading 
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {isUploading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('common.uploading')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('verification.uploadSelfie')}
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>

              <p className="text-xs text-gray-500 text-center">
                {t('verification.privacyNote')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifiedPhotoBadge;
