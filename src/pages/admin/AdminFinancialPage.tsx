import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WithdrawalApprovalQueue, GodFinancialDashboard } from '../../components';

type TabType = 'dashboard' | 'withdrawals';

const AdminFinancialPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: t('admin_financial_page.tab_dashboard'), icon: '📊' },
    { id: 'withdrawals' as TabType, label: t('admin_financial_page.tab_withdrawals'), icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">👑 {t('admin_financial_page.title')}</h1>
          <p className="text-gray-600 mt-2">{t('admin_financial_page.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'dashboard' && <GodFinancialDashboard />}
          {activeTab === 'withdrawals' && <WithdrawalApprovalQueue />}
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialPage;
