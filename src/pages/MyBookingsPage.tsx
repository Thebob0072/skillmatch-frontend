import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Booking {
  booking_id: number;
  provider_id: number;
  provider_name: string;
  provider_picture?: string;
  package_name: string;
  booking_date: string;
  start_time: string;
  status: string;
  total_price: number;
  payment_method?: string;
  payment_status?: string;
  location?: string;
  special_notes?: string;
  created_at: string;
}

const MyBookingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data || []);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'รอดำเนินการ' },
      pending_payment: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'รอชำระเงิน' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'ยืนยันแล้ว' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'กำลังดำเนินการ' },
      completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'เสร็จสิ้น' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'ยกเลิก' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (!paymentStatus) return null;

    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      unpaid: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ ยังไม่ชำระ' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ ชำระแล้ว' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ รอตรวจสอบ' },
    };

    const config = statusConfig[paymentStatus] || { bg: 'bg-gray-100', text: 'text-gray-800', label: paymentStatus };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('my_bookings')}</h1>
        <button
          onClick={() => navigate('/browse')}
          className="bg-pink-600 text-white px-3 sm:px-4 lg:px-6 py-2 text-sm sm:text-base rounded-lg hover:bg-pink-700 transition touch-manipulation"
        >
          + {t('new_booking')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'pending', label: 'รอดำเนินการ' },
          { key: 'confirmed', label: 'ยืนยันแล้ว' },
          { key: 'completed', label: 'เสร็จสิ้น' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as 'all' | 'pending' | 'confirmed' | 'completed')}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium whitespace-nowrap transition touch-manipulation ${
              filter === item.key
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 lg:p-12 text-center">
          <p className="text-gray-500 text-base sm:text-lg mb-4">ยังไม่มีการจอง</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-pink-700 transition touch-manipulation"
          >
            เริ่มจองบริการ
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-4 sm:p-5 lg:p-6"
            >
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                {/* Provider Info */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                  {booking.provider_picture ? (
                    <img
                      src={booking.provider_picture}
                      alt={booking.provider_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl">👤</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{booking.provider_name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{booking.package_name}</p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentStatusBadge(booking.payment_status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-600">📅 วันที่</p>
                      <p className="font-medium">
                        {new Date(booking.booking_date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">⏰ เวลา</p>
                      <p className="font-medium">{booking.start_time}</p>
                    </div>
                    {booking.location && (
                      <div className="col-span-2">
                        <p className="text-gray-600">📍 สถานที่</p>
                        <p className="font-medium">{booking.location}</p>
                      </div>
                    )}
                  </div>

                  {booking.special_notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">หมายเหตุ:</p>
                      <p className="text-sm">{booking.special_notes}</p>
                    </div>
                  )}
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col justify-between items-end">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600">
                      ฿{booking.total_price.toLocaleString()}
                    </p>
                    {booking.payment_method && (
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.payment_method === 'promptpay' ? '💳 PromptPay' : '💳 Stripe'}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                      className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg hover:bg-pink-200 transition text-sm font-medium"
                    >
                      ดูรายละเอียด
                    </button>

                    {booking.status === 'pending_payment' && (
                      <button
                        onClick={() => navigate(`/payment/qr`, { state: { bookingId: booking.booking_id } })}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        ชำระเงิน
                      </button>
                    )}

                    {booking.status === 'completed' && (
                      <button
                        onClick={() => navigate(`/providers/${booking.provider_id}/review`)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                      >
                        ⭐ รีวิว
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
