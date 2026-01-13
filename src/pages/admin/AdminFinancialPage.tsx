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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 animate-neon-pulse">👑 {t('admin_financial_page.title')}</h1>
          <p className="text-gray-300 mt-2">{t('admin_financial_page.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple mb-6">
          <div className="border-b border-purple-500/30">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-purple-600 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-purple-500/30'
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
        <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple p-6">
          {activeTab === 'dashboard' && <GodFinancialDashboard />}
          {activeTab === 'withdrawals' && <WithdrawalApprovalQueue />}
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialPage;
