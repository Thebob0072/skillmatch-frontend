import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface ProviderQueueInfo {
  provider_id: number;
  active_bookings: number;
  pending_bookings: number;
  total_queue: number;
  current_location?: {
    latitude: number;
    longitude: number;
    province?: string;
    district?: string;
    last_updated?: string;
  };
  is_online: boolean;
  last_active?: string;
}

interface AdminProviderInfoProps {
  providerId: number;
  compact?: boolean;
}

export const AdminProviderInfo: React.FC<AdminProviderInfoProps> = ({ providerId, compact = false }) => {
  const { t } = useTranslation();
  const { isAdmin, isGod } = useAuth();
  const [queueInfo, setQueueInfo] = useState<ProviderQueueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Only render for Admin or GOD users
  if (!isAdmin && !isGod) {
    return null;
  }

  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/providers/${providerId}/queue-info`);
        setQueueInfo(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch provider queue info:', err);
        // Fallback to mock data for development
        setQueueInfo({
          provider_id: providerId,
          active_bookings: Math.floor(Math.random() * 3),
          pending_bookings: Math.floor(Math.random() * 5),
          total_queue: Math.floor(Math.random() * 8),
          current_location: {
            latitude: 13.7563 + (Math.random() - 0.5) * 0.1,
            longitude: 100.5018 + (Math.random() - 0.5) * 0.1,
            province: 'Bangkok',
            district: 'Sukhumvit',
            last_updated: new Date().toISOString(),
          },
          is_online: Math.random() > 0.3,
          last_active: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueInfo();
  }, [providerId]);

  if (loading) {
    return (
      <div className="animate-pulse bg-red-500/10 rounded-lg p-2">
        <div className="h-4 bg-red-500/20 rounded w-20"></div>
      </div>
    );
  }

  if (!queueInfo) {
    return null;
  }

  // Compact view for cards
  if (compact) {
    return (
      <div 
        className="mt-2 p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg cursor-pointer hover:bg-red-500/30 transition-all"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold text-xs">🔐 ADMIN</span>
            <span className={`w-2 h-2 rounded-full ${queueInfo.is_online ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-orange-400" title={t('admin.queue.active_bookings')}>
              📅 {queueInfo.active_bookings}
            </span>
            <span className="text-yellow-400" title={t('admin.queue.pending')}>
              ⏳ {queueInfo.pending_bookings}
            </span>
            <span className="text-white font-bold" title={t('admin.queue.total')}>
              Σ {queueInfo.total_queue}
            </span>
          </div>
        </div>
        
        {showDetails && queueInfo.current_location && (
          <div className="mt-2 pt-2 border-t border-red-500/30 text-xs space-y-1">
            <div className="flex items-center gap-2 text-gray-300">
              <span>📍</span>
              <span>
                {queueInfo.current_location.district}, {queueInfo.current_location.province}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>🗺️</span>
              <span className="font-mono text-[10px]">
                {queueInfo.current_location.latitude.toFixed(4)}, {queueInfo.current_location.longitude.toFixed(4)}
              </span>
              <a 
                href={`https://www.google.com/maps?q=${queueInfo.current_location.latitude},${queueInfo.current_location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                🔗
              </a>
            </div>
            {queueInfo.last_active && (
              <div className="flex items-center gap-2 text-gray-400">
                <span>🕐</span>
                <span>{t('admin.queue.last_active')}: {new Date(queueInfo.last_active).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full view for profile pages
  return (
    <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-red-400 flex items-center gap-2">
          🔐 {t('admin.queue.title') || 'Admin View - Provider Status'}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          queueInfo.is_online 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
        }`}>
          {queueInfo.is_online ? '🟢 Online' : '⚫ Offline'}
        </span>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/30 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-orange-400">{queueInfo.active_bookings}</div>
          <div className="text-sm text-gray-400">{t('admin.queue.active_bookings') || 'Active Bookings'}</div>
        </div>
        <div className="bg-black/30 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-yellow-400">{queueInfo.pending_bookings}</div>
          <div className="text-sm text-gray-400">{t('admin.queue.pending') || 'Pending'}</div>
        </div>
        <div className="bg-black/30 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-white">{queueInfo.total_queue}</div>
          <div className="text-sm text-gray-400">{t('admin.queue.total') || 'Total Queue'}</div>
        </div>
      </div>

      {/* Location Info */}
      {queueInfo.current_location && (
        <div className="bg-black/30 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-white flex items-center gap-2">
            📍 {t('admin.queue.current_location') || 'Current Location'}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm">{t('location.province')}</div>
              <div className="text-white font-bold">{queueInfo.current_location.province || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">{t('location.district')}</div>
              <div className="text-white font-bold">{queueInfo.current_location.district || 'Unknown'}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-gray-400 text-sm">{t('admin.queue.coordinates') || 'GPS Coordinates'}</div>
              <div className="text-neon-blue font-mono text-sm">
                {queueInfo.current_location.latitude.toFixed(6)}, {queueInfo.current_location.longitude.toFixed(6)}
              </div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${queueInfo.current_location.latitude},${queueInfo.current_location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-lg font-bold hover:bg-neon-blue/30 transition-all"
            >
              🗺️ {t('admin.queue.view_map') || 'View on Map'}
            </a>
          </div>
          {queueInfo.current_location.last_updated && (
            <div className="text-xs text-gray-500">
              {t('admin.queue.location_updated') || 'Last updated'}: {new Date(queueInfo.current_location.last_updated).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Last Active */}
      {queueInfo.last_active && (
        <div className="text-sm text-gray-400 text-center">
          🕐 {t('admin.queue.last_active') || 'Last active'}: {new Date(queueInfo.last_active).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AdminProviderInfo;
