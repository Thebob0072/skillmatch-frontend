import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getBoostPackages,
  purchaseBoost,
  getActiveBoosts,
  BoostPackage,
  ActiveBoost
} from '../../services/promotionService';

export const BoostProfile: React.FC = () => {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<BoostPackage[]>([]);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [packagesData, boostsData] = await Promise.all([
        getBoostPackages(),
        getActiveBoosts()
      ]);
      setPackages(packagesData);
      setActiveBoosts(boostsData);
    } catch (err) {
      setError(t('boost.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (packageId: number) => {
    try {
      setIsPurchasing(packageId);
      setError(null);
      await purchaseBoost(packageId);
      setSuccess(t('boost.purchaseSuccess'));
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err.response?.data?.error || t('boost.purchaseError'));
    } finally {
      setIsPurchasing(null);
    }
  };

  const getBoostIcon = (boostType: string) => {
    switch (boostType) {
      case 'featured': return '⭐';
      case 'spotlight': return '🔥';
      case 'top_search': return '🚀';
      default: return '✨';
    }
  };

  const getBoostColor = (boostType: string) => {
    switch (boostType) {
      case 'featured': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'spotlight': return 'bg-orange-100 border-orange-400 text-orange-800';
      case 'top_search': return 'bg-purple-100 border-purple-400 text-purple-800';
      default: return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  const formatDuration = (hours: number) => {
    if (hours >= 24) {
      return `${Math.floor(hours / 24)} ${t('common.days')}`;
    }
    return `${hours} ${t('common.hours')}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Boosts */}
      {activeBoosts.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🔥 {t('boost.activeBoosts')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBoosts.map(boost => (
              <div 
                key={boost.boost_id}
                className="bg-white/20 rounded-lg p-4 backdrop-blur"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getBoostIcon(boost.boost_type)}</span>
                  <span className="text-sm bg-white/30 px-2 py-1 rounded">
                    {boost.boost_type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-lg font-bold">
                  {Math.ceil(boost.remaining_hours)} {t('common.hoursRemaining')}
                </p>
                <p className="text-sm opacity-80">
                  {t('boost.expiresAt', { 
                    time: new Date(boost.end_time).toLocaleString() 
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Packages */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('boost.title')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('boost.description')}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map(pkg => {
            const isActive = activeBoosts.some(b => b.boost_type === pkg.boost_type);
            
            return (
              <div 
                key={pkg.package_id}
                className={`border-2 rounded-lg p-5 transition-all ${
                  isActive 
                    ? 'border-gray-300 bg-gray-50 opacity-60' 
                    : 'border-gray-200 hover:border-purple-400 hover:shadow-lg'
                }`}
              >
                <div className="text-center mb-4">
                  <span className="text-4xl">{getBoostIcon(pkg.boost_type)}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  {pkg.name}
                </h3>
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 w-full text-center ${getBoostColor(pkg.boost_type)}`}>
                  {pkg.boost_type.replace('_', ' ')}
                </div>

                {pkg.description && (
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {pkg.description}
                  </p>
                )}

                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-purple-600">
                    ฿{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm block">
                    / {formatDuration(pkg.duration)}
                  </span>
                </div>

                <button
                  onClick={() => handlePurchase(pkg.package_id)}
                  disabled={isActive || isPurchasing === pkg.package_id}
                  className={`w-full py-3 rounded-lg font-bold transition-colors ${
                    isActive
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50'
                  }`}
                >
                  {isPurchasing === pkg.package_id
                    ? t('common.processing')
                    : isActive
                    ? t('boost.alreadyActive')
                    : t('boost.purchase')
                  }
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BoostProfile;
