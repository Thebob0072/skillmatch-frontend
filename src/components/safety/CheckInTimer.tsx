import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { checkIn, checkOut } from '../../services/safetyService';
import { ExtendSessionModal } from '../booking/ExtendSessionModal';

interface CheckInTimerProps {
  bookingId: number;
  expectedDurationMinutes: number;
  onComplete?: () => void;
  onExtend?: (additionalMinutes: number) => void;
}

export const CheckInTimer: React.FC<CheckInTimerProps> = ({
  bookingId,
  expectedDurationMinutes: initialDuration,
  onComplete,
  onExtend
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'active' | 'completed' | 'overdue'>('idle');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [expectedDurationMinutes, setExpectedDurationMinutes] = useState(initialDuration);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const expectedSeconds = expectedDurationMinutes * 60;
  const remainingSeconds = Math.max(0, expectedSeconds - elapsedSeconds);
  const progressPercent = Math.min(100, (elapsedSeconds / expectedSeconds) * 100);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (status === 'active' && startTime) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(elapsed);

        if (elapsed >= expectedSeconds) {
          setStatus('overdue');
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, startTime, expectedSeconds]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to get location
      let latitude: number | undefined;
      let longitude: number | undefined;

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (err) {
        // Continue without location
        console.warn('Could not get location:', err);
      }

      await checkIn({
        booking_id: bookingId,
        latitude,
        longitude
      });

      setStartTime(new Date());
      setStatus('active');
      setElapsedSeconds(0);
    } catch (err) {
      setError(t('safety.checkIn.startError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await checkOut({ booking_id: bookingId });
      setStatus('completed');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onComplete?.();
    } catch (err) {
      setError(t('safety.checkIn.endError'));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return progressPercent < 80 ? 'text-green-600' : 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = () => {
    if (status === 'overdue') return 'bg-red-500';
    if (progressPercent >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {t('safety.checkIn.title')}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Idle State - Not Started */}
      {status === 'idle' && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">⏱️</div>
          <p className="text-gray-600 mb-6">
            {t('safety.checkIn.idleMessage', { minutes: expectedDurationMinutes })}
          </p>
          <button
            onClick={handleCheckIn}
            disabled={isLoading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('safety.checkIn.start')}
          </button>
        </div>
      )}

      {/* Active State - Timer Running */}
      {(status === 'active' || status === 'overdue') && (
        <div className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className={`text-5xl font-mono font-bold ${getStatusColor()}`}>
              {formatTime(elapsedSeconds)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {status === 'overdue' 
                ? t('safety.checkIn.overtime', { minutes: Math.floor((elapsedSeconds - expectedSeconds) / 60) })
                : t('safety.checkIn.remaining', { time: formatTime(remainingSeconds) })
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full ${getProgressColor()} transition-all duration-1000`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
            {status === 'overdue' && (
              <div className="absolute inset-0 bg-red-500 animate-pulse opacity-50" />
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2">
            {status === 'active' && progressPercent < 80 && (
              <>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 font-medium">{t('safety.checkIn.inProgress')}</span>
              </>
            )}
            {status === 'active' && progressPercent >= 80 && (
              <>
                <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-yellow-600 font-medium">{t('safety.checkIn.nearingEnd')}</span>
              </>
            )}
            {status === 'overdue' && (
              <>
                <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                <span className="text-red-600 font-bold">{t('safety.checkIn.overdue')}</span>
              </>
            )}
          </div>

          {/* Extend Session Button - Show when nearing end or overdue */}
          {(progressPercent >= 70 || status === 'overdue') && (
            <button
              onClick={() => setShowExtendModal(true)}
              className="w-full py-3 bg-gradient-to-r from-neon-gold to-neon-pink text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              ⏱️ {t('safety.checkIn.extend', 'Extend Session')}
            </button>
          )}

          {/* Check Out Button */}
          <button
            onClick={handleCheckOut}
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('safety.checkIn.end')}
          </button>
        </div>
      )}

      {/* Completed State */}
      {status === 'completed' && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h4 className="text-xl font-bold text-green-600 mb-2">
            {t('safety.checkIn.completed')}
          </h4>
          <p className="text-gray-600">
            {t('safety.checkIn.totalTime', { time: formatTime(elapsedSeconds) })}
          </p>
        </div>
      )}

      {/* Extend Session Modal */}
      {showExtendModal && (
        <ExtendSessionModal
          bookingId={bookingId}
          currentDuration={Math.floor(elapsedSeconds / 60)}
          onClose={() => setShowExtendModal(false)}
          onSuccess={(additionalMinutes) => {
            setExpectedDurationMinutes(prev => prev + additionalMinutes);
            setShowExtendModal(false);
            // Reset overdue status if we extended
            if (status === 'overdue') {
              setStatus('active');
            }
            onExtend?.(additionalMinutes);
          }}
        />
      )}
    </div>
  );
};

export default CheckInTimer;
