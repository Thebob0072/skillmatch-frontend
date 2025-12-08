import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletDashboard, BankAccountManager, WithdrawalRequest } from '../../components';

type TabType = 'wallet' | 'bank' | 'withdrawal';

const FinancialPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('wallet');

  const tabs = [
    { id: 'wallet' as TabType, label: t('financial_page.tab_wallet'), icon: '💰' },
    { id: 'bank' as TabType, label: t('financial_page.tab_bank'), icon: '🏦' },
    { id: 'withdrawal' as TabType, label: t('financial_page.tab_withdrawal'), icon: '💸' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('financial_page.title')}</h1>
          <p className="text-gray-600 mt-2">{t('financial_page.subtitle')}</p>
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
                      ? 'border-blue-600 text-blue-600'
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
          {activeTab === 'wallet' && <WalletDashboard />}
          {activeTab === 'bank' && <BankAccountManager />}
          {activeTab === 'withdrawal' && <WithdrawalRequest />}
        </div>
      </div>
    </div>
  );
};

export default FinancialPage;
