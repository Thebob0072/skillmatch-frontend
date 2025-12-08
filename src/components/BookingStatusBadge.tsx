import React from 'react';
import { useTranslation } from 'react-i18next';

interface BookingStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  className?: string;
}

/**
 * BookingStatusBadge Component
 * 
 * แสดง Status ของ Booking โดยแปลภาษาอัตโนมัติตามภาษาที่เลือก (TH/EN)
 * Backend ส่งมาเป็น status: "pending", "confirmed", "completed", etc.
 * Component นี้จะแปลเป็นภาษาไทยหรืออังกฤษตามการตั้งค่า
 * 
 * @example
 * <BookingStatusBadge status="confirmed" />
 * <BookingStatusBadge status="pending" className="text-sm" />
 */
export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const { t } = useTranslation();

  // กำหนดสีตาม status
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  // กำหนดไอคอนตาม status
  const statusIcons = {
    pending: '⏳',
    confirmed: '✅',
    in_progress: '🔄',
    completed: '✔️',
    cancelled: '❌',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
        text-xs font-medium border
        ${statusColors[status]} 
        ${className}
      `}
    >
      <span className="text-sm">{statusIcons[status]}</span>
      {/* แปลภาษา status จาก Backend */}
      <span>{t(`booking_status.${status}`)}</span>
    </span>
  );
};

export default BookingStatusBadge;
