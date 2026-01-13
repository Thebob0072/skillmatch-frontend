import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { WalletDashboard, BankAccountManager, WithdrawalRequest } from '../../components';

type TabType = 'wallet' | 'bank' | 'withdrawal';

const FinancialPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('wallet');

  // Read tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['wallet', 'bank', 'withdrawal'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const tabs = [
    { id: 'wallet' as TabType, label: t('financial_page.tab_wallet'), icon: '💰' },
    { id: 'bank' as TabType, label: t('financial_page.tab_bank'), icon: '🏦' },
    { id: 'withdrawal' as TabType, label: t('financial_page.tab_withdrawal'), icon: '💸' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header - Neon Theme */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 animate-neon-pulse">
            {t('financial_page.title')}
          </h1>
          <p className="text-gray-300 mt-2 flex items-center gap-2">
            <span className="text-yellow-400">💎</span>
            {t('financial_page.subtitle')}
          </p>
        </div>

        {/* Tabs - Neon Theme */}
        <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple mb-6">
          <div className="border-b border-gray-700/50">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all
                    ${activeTab === tab.id
                      ? 'border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 shadow-glow-purple'
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

        {/* Tab Content - Neon Theme */}
        <div className="glass-dark rounded-xl border border-purple-500/20 shadow-glow-purple p-6">
          {activeTab === 'wallet' && <WalletDashboard />}
          {activeTab === 'bank' && <BankAccountManager />}
          {activeTab === 'withdrawal' && <WithdrawalRequest />}
        </div>
      </div>
    </div>
  );
};

export default FinancialPage;
