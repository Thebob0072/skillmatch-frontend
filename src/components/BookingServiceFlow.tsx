import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface BookingDetailsProps {
  bookingId: number;
  userRole: 'client' | 'provider';
}

interface Booking {
  booking_id: number;
  client_name: string;
  provider_name: string;
  package_name: string;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status: string;
  deposit_paid: boolean;
  escrow_locked: boolean;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  location: {
    address: string;
    floor?: string;
    room_number?: string;
    contact_phone?: string;
    lat: number;
    lng: number;
  };
  provider_arrived_at?: string;
  client_confirmed_arrival_at?: string;
  provider_completed_at?: string;
}

/**
 * BookingServiceFlow - Component สำหรับจัดการ flow การให้บริการ
 * 
 * Flow สำหรับ Provider:
 * 1. confirmed → กด "ฉันมาถึงแล้ว" → provider_arrived
 * 2. รอ client ยืนยัน → in_progress
 * 3. ให้บริการเสร็จ → กด "บริการเสร็จสิ้น" → completed
 * 4. รอ client ยืนยัน → funds_released (ได้เงินเข้า wallet)
 * 
 * Flow สำหรับ Client:
 * 1. รอ provider มา → provider_arrived
 * 2. กด "ยืนยันว่า provider มาแล้ว" → in_progress (ล็อคเงินใน escrow)
 * 3. รอบริการเสร็จ → completed
 * 4. กด "ยืนยันรับบริการ" หรือ "ร้องเรียน" → funds_released หรือ disputed
 */
export const BookingServiceFlow: React.FC<BookingDetailsProps> = ({ bookingId, userRole }) => {
  const { t } = useTranslation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchBooking();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBooking, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(res.data);
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch booking');
      }
    }
  };

  // PROVIDER: กด "ฉันมาถึงแล้ว"
  const handleProviderArrived = async () => {
    if (!confirm(t('booking.confirm_arrived'))) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/provider-arrived`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(t('booking.arrived_confirmed'));
      fetchBooking();
    } catch (error: unknown) {
      let message = t('booking.action_failed');
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        const data = error.response as { error?: string };
        message = data.error || message;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // CLIENT: ยืนยันว่า provider มาแล้ว → ล็อคเงินใน escrow
  const handleConfirmArrival = async () => {
    if (!confirm(t('booking.confirm_provider_arrived'))) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/confirm-arrival`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(t('booking.escrow_locked'));
      fetchBooking();
    } catch (error: unknown) {
      alert(error.response?.data?.error || t('booking.action_failed'));
    } finally {
      setLoading(false);
    }
  };

  // PROVIDER: บริการเสร็จสิ้น
  const handleServiceCompleted = async () => {
    const notes = prompt(t('booking.completion_notes_prompt'));
    if (!notes) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/provider-complete`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(t('booking.completion_submitted'));
      fetchBooking();
    } catch (error: unknown) {
      alert(error.response?.data?.error || t('booking.action_failed'));
    } finally {
      setLoading(false);
    }
  };

  // CLIENT: ยืนยันรับบริการ → ปลดล็อคเงิน
  const handleConfirmCompletion = async () => {
    if (!confirm(t('booking.confirm_completion'))) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/confirm-completion`,
        {
          rating,
          review,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(t('booking.payment_released'));
      window.location.href = '/bookings/my';
    } catch (error: unknown) {
      alert(error.response?.data?.error || t('booking.action_failed'));
    } finally {
      setLoading(false);
    }
  };

  // CLIENT: ร้องเรียน
  const handleDispute = async () => {
    const reason = prompt(t('booking.dispute_reason_prompt'));
    if (!reason) return;

    const description = prompt(t('booking.dispute_description_prompt'));
    if (!description) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/dispute`,
        {
          reason,
          description,
          evidence: [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(t('booking.dispute_submitted'));
      fetchBooking();
    } catch (error: unknown) {
      alert(error.response?.data?.error || t('booking.action_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Status */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('booking.service_flow')}</h1>
          <StatusBadge status={booking.status} />
        </div>

        {/* Progress Bar */}
        <ProgressBar status={booking.status} />
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">{t('booking.details')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">{t('booking.booking_id')}</p>
            <p className="font-bold">#{booking.booking_id}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">
              {userRole === 'client' ? t('booking.provider') : t('booking.client')}
            </p>
            <p className="font-bold">
              {userRole === 'client' ? booking.provider_name : booking.client_name}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{t('booking.package')}</p>
            <p className="font-bold">{booking.package_name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{t('booking.datetime')}</p>
            <p className="font-bold">{booking.booking_date} {booking.booking_time}</p>
          </div>
        </div>

        {/* Location */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm mb-1">{t('booking.location')}</p>
          <p className="font-bold">{booking.location.address}</p>
          {booking.location.floor && (
            <p className="text-sm">
              {t('booking.floor')}: {booking.location.floor}
              {booking.location.room_number && ` ${t('booking.room')}: ${booking.location.room_number}`}
            </p>
          )}
          {booking.location.contact_phone && (
            <p className="text-sm mt-2">
              📱 {booking.location.contact_phone}
            </p>
          )}
          <a
            href={`https://www.google.com/maps?q=${booking.location.lat},${booking.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            📍 {t('booking.open_in_maps')}
          </a>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">{t('payment.payment_info')}</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('payment.total_amount')}:</span>
            <span className="font-bold">
              ฿{booking.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('payment.deposit_paid')}:</span>
            <span className={booking.deposit_paid ? 'text-green-600 font-bold' : 'text-red-600'}>
              {booking.deposit_paid ? '✅ ' : '❌ '}
              ฿{booking.deposit_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('payment.remaining')}:</span>
            <div className="text-right">
              <span className="font-bold text-lg">
                ฿{booking.remaining_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
              {booking.escrow_locked && (
                <p className="text-xs text-green-600">🔒 {t('payment.locked_in_escrow')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions based on status and role */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">{t('booking.actions')}</h2>

        {/* PROVIDER ACTIONS */}
        {userRole === 'provider' && (
          <div className="space-y-4">
            {booking.status === 'confirmed' && booking.deposit_paid && (
              <button
                onClick={handleProviderArrived}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('booking.i_arrived')}
              </button>
            )}

            {booking.status === 'provider_arrived' && (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  ⏳ {t('booking.waiting_client_confirm')}
                </p>
              </div>
            )}

            {booking.status === 'in_progress' && (
              <button
                onClick={handleServiceCompleted}
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('booking.service_completed')}
              </button>
            )}

            {booking.status === 'completed' && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  ⏳ {t('booking.waiting_client_confirm_completion')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {t('booking.auto_release_24h')}
                </p>
              </div>
            )}

            {booking.status === 'funds_released' && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-bold text-lg">
                  ✅ {t('booking.payment_received')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ฿{booking.remaining_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} 
                  {' '}{t('booking.added_to_wallet')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* CLIENT ACTIONS */}
        {userRole === 'client' && (
          <div className="space-y-4">
            {booking.status === 'confirmed' && !booking.deposit_paid && (
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-red-800 font-bold">
                  ⚠️ {t('payment.deposit_not_paid')}
                </p>
                <button
                  onClick={() => window.location.href = `/payment/deposit/${booking.booking_id}`}
                  className="mt-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  {t('payment.pay_deposit')}
                </button>
              </div>
            )}

            {booking.status === 'provider_arrived' && (
              <div>
                <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                  <p className="text-yellow-800 font-bold">
                    📍 {t('booking.provider_has_arrived')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('booking.please_verify_arrival')}
                  </p>
                </div>
                <button
                  onClick={handleConfirmArrival}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('booking.confirm_provider_arrived')}
                </button>
              </div>
            )}

            {booking.status === 'in_progress' && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  ⏳ {t('booking.service_in_progress')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  💰 {t('payment.escrow_amount')}: ฿{booking.remaining_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}

            {booking.status === 'completed' && (
              <div>
                <div className="p-4 bg-green-50 rounded-lg mb-4">
                  <p className="text-green-800 font-bold">
                    ✅ {t('booking.provider_completed_service')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('booking.please_confirm_or_dispute')}
                  </p>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">{t('booking.rate_service')}:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-3xl"
                      >
                        {star <= rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review */}
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">{t('booking.review')}:</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    placeholder={t('booking.review_placeholder')}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleConfirmCompletion}
                    disabled={loading}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? t('common.loading') : t('booking.confirm_and_pay')}
                  </button>
                  <button
                    onClick={handleDispute}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
                  >
                    {t('booking.dispute')}
                  </button>
                </div>
              </div>
            )}

            {booking.status === 'funds_released' && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-bold text-lg">
                  ✅ {t('booking.completed_successfully')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {t('booking.thank_you')}
                </p>
              </div>
            )}

            {booking.status === 'disputed' && (
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-orange-800 font-bold">
                  ⚠️ {t('booking.dispute_under_review')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {t('booking.admin_will_review')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation();
  
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    provider_arrived: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    funds_released: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    disputed: 'bg-orange-100 text-orange-800',
  };

  return (
    <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {t(`booking.status.${status}`)}
    </span>
  );
};

// Progress Bar Component
const ProgressBar: React.FC<{ status: string }> = ({ status }) => {
  const steps = [
    'confirmed',
    'provider_arrived',
    'in_progress',
    'completed',
    'funds_released',
  ];

  const currentStep = steps.indexOf(status) + 1;
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default BookingServiceFlow;
