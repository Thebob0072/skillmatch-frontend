import React, { useEffect, useState } from 'react';
import { checkHealth, checkNetworkStatus, setupNetworkListeners, type HealthStatus } from '../services/healthService';

interface StatusIndicatorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ position = 'bottom-right' }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');
  const [showDetails, setShowDetails] = useState(false);
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);

  useEffect(() => {
    // Check initial network status
    setIsOnline(checkNetworkStatus());

    // Setup network listeners
    const cleanup = setupNetworkListeners(
      () => {
        setIsOnline(true);
        checkAPIHealth();
      },
      () => {
        setIsOnline(false);
        setApiStatus('unhealthy');
      }
    );

    // Check API health initially
    checkAPIHealth();

    // Check API health every 30 seconds
    const interval = setInterval(checkAPIHealth, 30000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  const checkAPIHealth = async () => {
    try {
      const health = await checkHealth();
      setHealthData(health);
      setApiStatus(health.status);
    } catch (error) {
      setApiStatus('unhealthy');
      setHealthData(null);
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500';
    switch (apiStatus) {
      case 'healthy':
        return 'bg-green-500';
      case 'unhealthy':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    switch (apiStatus) {
      case 'healthy':
        return 'Online';
      case 'unhealthy':
        return 'API Down';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        {/* Status Dot */}
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse shadow-lg`} />

        {/* Details Popup */}
        {showDetails && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 min-w-[200px] border border-gray-700">
            <div className="font-bold mb-2">{getStatusText()}</div>
            
            {healthData && (
              <>
                <div className="text-gray-400 mb-1">Services:</div>
                <div className="space-y-1 ml-2">
                  <div className="flex justify-between">
                    <span>PostgreSQL:</span>
                    <span className={healthData.services.postgres === 'up' ? 'text-green-400' : 'text-red-400'}>
                      {healthData.services.postgres}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Redis:</span>
                    <span className={healthData.services.redis === 'up' ? 'text-green-400' : 'text-red-400'}>
                      {healthData.services.redis}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>DB Pool:</span>
                    <span className={healthData.services.db_pool === 'up' ? 'text-green-400' : 'text-red-400'}>
                      {healthData.services.db_pool}
                    </span>
                  </div>
                </div>
                <div className="text-gray-500 text-[10px] mt-2">
                  v{healthData.version}
                </div>
              </>
            )}

            {!isOnline && (
              <div className="text-yellow-400 text-[10px] mt-2">
                No internet connection
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;
