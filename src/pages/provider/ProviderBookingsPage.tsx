import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Booking {
  booking_id: number;
  client_id: number;
  client_name: string;
  client_picture?: string;
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

const ProviderBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bookings/provider', {
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

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Reload bookings
      loadBookings();
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Failed to update booking status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ รอยืนยัน' },
      pending_payment: { bg: 'bg-orange-100', text: 'text-orange-800', label: '💰 รอชำระเงิน' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ ยืนยันแล้ว' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: '🔄 กำลังดำเนินการ' },
      completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: '✔️ เสร็จสิ้น' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ ยกเลิก' },
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

  const getStatusActions = (booking: Booking) => {
    const actions = [];

    if (booking.status === 'pending') {
      actions.push(
        <button
          key="confirm"
          onClick={() => updateBookingStatus(booking.booking_id, 'confirmed')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          ✓ ยืนยัน
        </button>
      );
      actions.push(
        <button
          key="cancel"
          onClick={() => updateBookingStatus(booking.booking_id, 'cancelled')}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
        >
          ✕ ปฏิเสธ
        </button>
      );
    }

    if (booking.status === 'confirmed') {
      actions.push(
        <button
          key="start"
          onClick={() => updateBookingStatus(booking.booking_id, 'in_progress')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          ▶️ เริ่มงาน
        </button>
      );
    }

    if (booking.status === 'in_progress') {
      actions.push(
        <button
          key="complete"
          onClick={() => updateBookingStatus(booking.booking_id, 'completed')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          ✔️ เสร็จสิ้น
        </button>
      );
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 จัดการการจอง</h1>
        <div className="text-right">
          <p className="text-gray-600 text-sm">ทั้งหมด</p>
          <p className="text-2xl font-bold text-pink-600">{bookings.length} รายการ</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'ทั้งหมด', count: bookings.length },
          { key: 'pending', label: 'รอยืนยัน', count: bookings.filter(b => b.status === 'pending').length },
          { key: 'confirmed', label: 'ยืนยันแล้ว', count: bookings.filter(b => b.status === 'confirmed').length },
          { key: 'in_progress', label: 'กำลังทำงาน', count: bookings.filter(b => b.status === 'in_progress').length },
          { key: 'completed', label: 'เสร็จสิ้น', count: bookings.filter(b => b.status === 'completed').length },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as 'all' | 'pending' | 'accepted' | 'completed')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === item.key
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label} {item.count > 0 && `(${item.count})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">ไม่มีการจองในหมวดนี้</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Client Info */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {booking.client_picture ? (
                    <img
                      src={booking.client_picture}
                      alt={booking.client_name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{booking.client_name}</h3>
                    <p className="text-gray-600 text-sm">{booking.package_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booking #{booking.booking_id}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentStatusBadge(booking.payment_status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
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
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1 font-semibold">📝 หมายเหตุจากลูกค้า:</p>
                      <p className="text-sm text-blue-900">{booking.special_notes}</p>
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
                    {getStatusActions(booking)}
                    
                    <button
                      onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                    >
                      📄 รายละเอียด
                    </button>
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

export default ProviderBookingsPage;
