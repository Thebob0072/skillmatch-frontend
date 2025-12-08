import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function VerifyUserPage() {
  const { userId } = useParams();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-8">
        {t('verify_user_title') || 'Verify User'}
      </h1>
      
      <div className="bg-gray-800 rounded-xl p-8 shadow-2xl mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">{t('verify_user_page.user_info')}</h2>
        <div className="space-y-4">
          <div>
            <span className="text-gray-400">{t('verify_user_page.user_id')}:</span>
            <span className="text-white ml-2 font-mono">{userId}</span>
          </div>
          <div>
            <span className="text-gray-400">{t('verify_user_page.username')}:</span>
            <span className="text-white ml-2">JohnDoe123</span>
          </div>
          <div>
            <span className="text-gray-400">{t('verify_user_page.email')}:</span>
            <span className="text-white ml-2">john@example.com</span>
          </div>
          <div>
            <span className="text-gray-400">{t('verify_user_page.status')}:</span>
            <span className="text-yellow-400 ml-2">{t('verify_user_page.pending_verification')}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-8 shadow-2xl mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">{t('verify_user_page.documents')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 h-48 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">{t('verify_user_page.id_front')}</span>
          </div>
          <div className="bg-gray-700 h-48 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">{t('verify_user_page.id_back')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          ✓ {t('verify_user_page.approve')}
        </button>
        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          ✕ {t('verify_user_page.reject')}
        </button>
      </div>
    </div>
  );
}

export default VerifyUserPage;
