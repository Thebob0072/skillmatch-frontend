import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BookingCard from '../../components/BookingCard';
import axios from 'axios';

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
  special_notes?: string;
}

/**
 * MyBookingsPage Component
 * 
 * หน้าแสดงรายการ Booking ของ Client พร้อมการแปลภาษา
 * - แสดง status ที่แปลภาษาจาก Backend
 * - Filter ตาม status
 * - แยกแสดง Upcoming และ Past bookings
 * 
 * การใช้งาน:
 * 1. Backend ส่ง status เป็นภาษาอังกฤษ (pending, confirmed, completed, etc.)
 * 2. Frontend แปลเป็นภาษาไทยหรืออังกฤษอัตโนมัติ
 * 3. ผู้ใช้สามารถเปลี่ยนภาษาได้โดยไม่ต้องโหลดข้อมูลใหม่
 */
const MyBookingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data.bookings || []);
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // แยก bookings เป็น upcoming และ past
  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.start_time) > now && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.start_time) <= now || b.status === 'cancelled' || b.status === 'completed'
  );

  // Filter bookings ตาม status
  const filterBookings = (bookingList: Booking[]) => {
    if (statusFilter === 'all') return bookingList;
    return bookingList.filter((b) => b.status === statusFilter);
  };

  // Handle booking actions
  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm(t('booking.confirm_cancel'))) return;

    const reason = prompt(t('booking.please_provide_reason'));
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/bookings/${bookingId}/status`,
        {
          status: 'cancelled',
          cancellation_reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert(t('booking.booking_cancelled'));
      fetchBookings(); // Refresh list
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const handleViewDetails = (bookingId: number) => {
    // Navigate to booking details page
    window.location.href = `/booking/${bookingId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center glass-dark p-8 rounded-lg border border-red-500/30 shadow-glow-red">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 animate-neon-pulse mb-2">
            {t('booking.my_bookings')}
          </h1>
          <p className="text-gray-300">{t('booking.booking_history')}</p>
        </div>

        {/* Tabs */}
        <div className="glass-dark rounded-lg border border-purple-500/30 shadow-glow-purple mb-6 p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple'
                : 'text-gray-300 hover:bg-purple-500/20'
            }`}
          >
            {t('booking.upcoming_bookings')} ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple'
                : 'text-gray-300 hover:bg-purple-500/20'
            }`}
          >
            {t('booking.past_bookings')} ({pastBookings.length})
          </button>
        </div>

        {/* Status Filter */}
        <div className="glass-dark rounded-lg border border-purple-500/30 shadow-glow-purple p-4 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('booking.status')}:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
          >
            <option value="all">{t('common.all')}</option>
            <option value="pending">{t('booking_status.pending')}</option>
            <option value="confirmed">{t('booking_status.confirmed')}</option>
            <option value="in_progress">{t('booking_status.in_progress')}</option>
            <option value="completed">{t('booking_status.completed')}</option>
            <option value="cancelled">{t('booking_status.cancelled')}</option>
          </select>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {activeTab === 'upcoming' ? (
            filterBookings(upcomingBookings).length > 0 ? (
              filterBookings(upcomingBookings).map((booking) => (
                <BookingCard
                  key={booking.booking_id}
                  booking={booking}
                  role="client"
                  onCancel={handleCancelBooking}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {t('booking.no_upcoming_bookings')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t('booking.browse_providers_to_book')}
                </p>
                <a
                  href="/browse"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {t('nav_browse')}
                </a>
              </div>
            )
          ) : filterBookings(pastBookings).length > 0 ? (
            filterBookings(pastBookings).map((booking) => (
              <BookingCard
                key={booking.booking_id}
                booking={booking}
                role="client"
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('booking.no_past_bookings')}
              </h3>
              <p className="text-gray-500">
                {t('booking.your_booking_history_will_appear_here')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
