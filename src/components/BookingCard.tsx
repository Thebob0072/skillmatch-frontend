import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingStatusBadge from './BookingStatusBadge';
import { 
  translateCategory,
  translateProvince,
  formatPrice,
} from '../utils/translationHelpers';

interface Booking {
  booking_id: number;
  provider_username?: string;
  client_username?: string;
  package_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  location_province?: string;
  category_name?: string;
  special_notes?: string;
}

interface BookingCardProps {
  booking: Booking;
  role: 'client' | 'provider';
  onConfirm?: (bookingId: number) => void;
  onCancel?: (bookingId: number) => void;
  onComplete?: (bookingId: number) => void;
  onViewDetails?: (bookingId: number) => void;
}

/**
 * BookingCard Component
 * 
 * แสดงการ์ดข้อมูล Booking พร้อมการแปลภาษา
 * รองรับการแปลภาษาทั้งข้อมูล UI และ Status จาก Backend
 * 
 * @example
 * <BookingCard 
 *   booking={bookingData} 
 *   role="client"
 *   onCancel={(id) => handleCancel(id)}
 *   onViewDetails={(id) => navigate(`/booking/${id}`)}
 * />
 */
export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  role,
  onConfirm,
  onCancel,
  onComplete,
  onViewDetails,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const showConfirmButton = role === 'provider' && booking.status === 'pending';
  const showCancelButton = booking.status === 'pending' || booking.status === 'confirmed';
  const showCompleteButton = role === 'provider' && booking.status === 'confirmed';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('booking.booking_id')}: #{booking.booking_id}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {role === 'client' 
              ? `${t('booking.provider')}: ${booking.provider_username}`
              : `${t('booking.client')}: ${booking.client_username}`
            }
          </p>
        </div>
        {/* Status Badge - แปลภาษาอัตโนมัติ */}
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Booking Details */}
      <div className="space-y-2 mb-4">
        {/* Package Name */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 w-32">{t('booking.package')}:</span>
          <span className="font-medium">{booking.package_name}</span>
        </div>

        {/* Category */}
        {booking.category_name && (
          <div className="flex items-center text-sm">
            <span className="text-gray-600 w-32">{t('browse.filters.category')}:</span>
            <span className="font-medium">{translateCategory(booking.category_name, t)}</span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 w-32">{t('booking.booking_date')}:</span>
          <span className="font-medium">{formatDate(booking.booking_date)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 w-32">{t('booking.booking_time')}:</span>
          <span className="font-medium">
            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
          </span>
        </div>

        {/* Location */}
        {booking.location && (
          <div className="flex items-center text-sm">
            <span className="text-gray-600 w-32">{t('booking.location')}:</span>
            <span className="font-medium">{booking.location}</span>
          </div>
        )}

        {/* Province */}
        {booking.location_province && (
          <div className="flex items-center text-sm">
            <span className="text-gray-600 w-32">{t('location.province')}:</span>
            <span className="font-medium">{translateProvince(booking.location_province, t)}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 w-32">{t('booking.total_price')}:</span>
          <span className="font-bold text-purple-600">{formatPrice(booking.total_price)}</span>
        </div>

        {/* Special Notes */}
        {booking.special_notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 mb-1">{t('booking.special_notes')}:</p>
            <p className="text-sm text-gray-800">{booking.special_notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {showConfirmButton && onConfirm && (
          <button
            onClick={() => onConfirm(booking.booking_id)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {t('booking.confirm_booking')}
          </button>
        )}

        {showCompleteButton && onComplete && (
          <button
            onClick={() => onComplete(booking.booking_id)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            {t('booking.complete_booking')}
          </button>
        )}

        {showCancelButton && onCancel && (
          <button
            onClick={() => onCancel(booking.booking_id)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            {t('booking.cancel_booking')}
          </button>
        )}

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(booking.booking_id)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            {t('booking.view_details')}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
