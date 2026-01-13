import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SOSButton } from '../safety/SOSButton';
import { CheckInTimer } from '../safety/CheckInTimer';
import api from '../../services/api';

interface BookingWorkDetails {
  booking_id: number;
  provider_id: number;
  client_id: number;
  client_username: string;
  client_phone?: string;
  package_name: string;
  duration: number;
  total_price: number;
  status: string;
  location?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  special_notes?: string;
  start_time: string;
  end_time: string;
  check_in_status?: string;
  check_in_id?: number;
  payment_status: string;
}

interface ProviderWorkSessionProps {
  bookingId: number;
  onClose?: () => void;
  onComplete?: () => void;
}

export const ProviderWorkSession: React.FC<ProviderWorkSessionProps> = ({
  bookingId,
  onClose,
  onComplete
}) => {
  const { t } = useTranslation();
  const [booking, setBooking] = useState<BookingWorkDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [lastLocation, setLastLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch booking details
  const fetchBookingDetails = useCallback(async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}/work-details`);
      setBooking(response.data);
      setError(null);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch booking details');
      }
      setError(t('work_session.error.fetch_failed'));
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, t]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  // Location tracking
  const updateLocation = useCallback(async (latitude: number, longitude: number) => {
    try {
      await api.post('/provider/location/update', {
        latitude,
        longitude,
        booking_id: bookingId
      });
      setLastLocation({ lat: latitude, lng: longitude });
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to update location');
      }
    }
  }, [bookingId]);

  useEffect(() => {
    let watchId: number | null = null;

    if (isTrackingLocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Geolocation error');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTrackingLocation, updateLocation]);

  // Start location tracking when check-in is active
  useEffect(() => {
    if (booking?.check_in_status === 'active') {
      setIsTrackingLocation(true);
    }
  }, [booking?.check_in_status]);

  const handleCheckInComplete = () => {
    setIsTrackingLocation(false);
    fetchBookingDetails();
    onComplete?.();
  };

  const openGoogleMaps = () => {
    if (booking?.latitude && booking?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.latitude},${booking.longitude}`;
      window.open(url, '_blank');
    } else if (booking?.location_address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location_address)}`;
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('common.error')}</h2>
        <p className="text-gray-600 mb-4">{error || t('work_session.error.not_found')}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  const isConfirmed = booking.status === 'confirmed' || booking.status === 'paid' || booking.status === 'in_progress';
  const isPaid = booking.payment_status === 'paid';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            ← {t('common.back')}
          </button>
          <h1 className="text-lg font-bold">{t('work_session.title')}</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Payment Status */}
        <div className={`p-4 rounded-lg ${isPaid ? 'bg-green-100' : 'bg-yellow-100'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isPaid ? '💰' : '⏳'}</span>
            <div>
              <p className={`font-semibold ${isPaid ? 'text-green-700' : 'text-yellow-700'}`}>
                {isPaid ? t('work_session.payment.received') : t('work_session.payment.pending')}
              </p>
              <p className="text-sm text-gray-600">
                ฿{booking.total_price.toLocaleString()} • {booking.package_name}
              </p>
            </div>
          </div>
        </div>

        {/* Client Info - only show if confirmed/paid */}
        {isConfirmed && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              👤 {t('work_session.client_info')}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">{t('work_session.client_name')}:</span> {booking.client_username}</p>
              {booking.client_phone && (
                <p>
                  <span className="font-medium">{t('work_session.phone')}:</span>{' '}
                  <a href={`tel:${booking.client_phone}`} className="text-pink-500 underline">
                    {booking.client_phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Location Info - only show if confirmed/paid */}
        {isConfirmed && (booking.location_address || booking.location) && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              📍 {t('work_session.location')}
            </h3>
            <p className="text-gray-600 mb-3">
              {booking.location_address || booking.location}
            </p>
            {(booking.latitude && booking.longitude) || booking.location_address ? (
              <button
                onClick={openGoogleMaps}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                🗺️ {t('work_session.navigate')}
              </button>
            ) : null}
          </div>
        )}

        {/* Special Notes */}
        {booking.special_notes && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              📝 {t('work_session.notes')}
            </h3>
            <p className="text-gray-600">{booking.special_notes}</p>
          </div>
        )}

        {/* Booking Time */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            🕐 {t('work_session.schedule')}
          </h3>
          <div className="text-gray-600">
            <p>{new Date(booking.start_time).toLocaleDateString()}</p>
            <p>{new Date(booking.start_time).toLocaleTimeString()} - {new Date(booking.end_time).toLocaleTimeString()}</p>
            <p className="text-sm text-gray-500">{booking.duration} {t('common.minutes')}</p>
          </div>
        </div>

        {/* Check-in Timer - only if booking is confirmed/paid */}
        {isConfirmed && isPaid && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              ⏱️ {t('work_session.timer')}
            </h3>
            <CheckInTimer
              bookingId={booking.booking_id}
              expectedDurationMinutes={booking.duration}
              onComplete={handleCheckInComplete}
            />
          </div>
        )}

        {/* Location Tracking Status */}
        {isTrackingLocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-blue-700">{t('work_session.tracking_active')}</p>
                {lastLocation && (
                  <p className="text-sm text-blue-600">
                    {t('work_session.last_update')}: {lastLocation.lat.toFixed(6)}, {lastLocation.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SOS Button - always visible during active session */}
        {booking.check_in_status === 'active' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">
              {t('work_session.emergency')}
            </h3>
            <div className="flex justify-center">
              <SOSButton bookingId={booking.booking_id} size="large" />
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              {t('work_session.sos_description')}
            </p>
          </div>
        )}

        {/* Booking Status */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">{t('work_session.status')}:</p>
          <p className={`font-bold text-lg ${
            booking.status === 'completed' ? 'text-green-600' :
            booking.status === 'cancelled' ? 'text-red-600' :
            booking.status === 'in_progress' ? 'text-blue-600' :
            'text-yellow-600'
          }`}>
            {t(`booking.status.${booking.status}`)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderWorkSession;
