import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

interface BookingWithPayment {
  booking_id: number;
  provider_name: string;
  package_name: string;
  booking_date: string;
  booking_time: string;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  status: string;
  payment_status: string;
  deposit_paid: boolean;
  escrow_locked: boolean;
  location: {
    address: string;
    floor?: string;
    room_number?: string;
    lat: number;
    lng: number;
  };
}

interface PaymentDetails {
  payment_reference: string;
  qr_code: string;
  amount: number;
  expires_at: string;
  payment_status: string;
}

/**
 * DepositPaymentPage - หน้าชำระเงินมัดจำ 10%
 * 
 * Flow:
 * 1. แสดงรายละเอียดการจองและจำนวนเงินที่ต้องจ่าย
 * 2. สร้าง QR Code PromptPay สำหรับมัดจำ
 * 3. Countdown timer 15 นาที
 * 4. Auto-check ทุก 5 วินาที
 * 5. เมื่อจ่ายเรียบร้อย → redirect ไปหน้า My Bookings
 */
export const DepositPaymentPage: React.FC<{ bookingId: number }> = ({ bookingId }) => {
  const { t } = useTranslation();
  const [booking, setBooking] = useState<BookingWithPayment | null>(null);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    fetchBookingAndPayment();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-check payment status
  useEffect(() => {
    if (!payment) return;

    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [payment]);

  const fetchBookingAndPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // ดึงข้อมูล booking
      const bookingRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(bookingRes.data);

      // ถ้ายังไม่ได้จ่ายมัดจำ → สร้าง payment
      if (!bookingRes.data.deposit_paid) {
        const paymentRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/create-deposit-payment`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPayment(paymentRes.data);
      }
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch booking');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!payment) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments/${payment.payment_reference}/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.payment_status === 'paid') {
        alert(t('payment.deposit_paid_success'));
        window.location.href = '/bookings/my';
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to check payment status');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!booking) {
    return <div className="text-center py-8">{t('booking.not_found')}</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">{t('payment.deposit_payment')}</h1>
          <p className="text-gray-300">{t('payment.deposit_subtitle')}</p>
        </div>

        {/* Booking Details */}
        <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{t('booking.booking_details')}</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">{t('booking.provider')}:</span>
              <span className="font-semibold text-white">{booking.provider_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('booking.package')}:</span>
              <span className="font-semibold text-white">{booking.package_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('booking.date')}:</span>
              <span className="font-semibold text-white">{booking.booking_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('booking.time')}:</span>
              <span className="font-semibold text-white">{booking.booking_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('booking.location')}:</span>
              <span className="font-semibold text-white">{booking.location.address}</span>
            </div>
          </div>

          <div className="border-t border-purple-500/30 mt-4 pt-4">
            <div className="flex justify-between text-lg mb-2 text-white">
              <span>{t('payment.total_amount')}:</span>
              <span className="font-bold">
                ฿{booking.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-pink-600 font-bold text-xl">
              <span>{t('payment.deposit_10')}:</span>
              <span>
                ฿{booking.deposit_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm mt-2">
              <span>{t('payment.remaining_after_service')}:</span>
              <span>
                ฿{booking.remaining_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Payment */}
        {payment && (
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
            <h2 className="text-2xl font-bold text-center mb-4">
              {t('payment.scan_qr_to_pay')}
            </h2>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG 
                  value={payment.qr_code}
                  size={256}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Amount */}
            <div className="text-center mb-4">
              <p className="text-sm opacity-90 mb-1">{t('payment.amount_to_pay')}</p>
              <p className="text-4xl font-bold">
                ฿{payment.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Timer */}
            {timeLeft > 0 ? (
              <div className="text-center mb-6">
                <p className="text-sm opacity-90 mb-2">{t('payment.qr_expires_in')}</p>
                <div className="text-3xl font-bold">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>
            ) : (
              <div className="text-center mb-6">
                <p className="text-red-200 font-bold">{t('payment.qr_expired')}</p>
                <button
                  onClick={fetchBookingAndPayment}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-glow-pink transition-all"
                >
                  {t('payment.generate_new_qr')}
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold mb-2">{t('payment.instructions')}:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>{t('payment.step1')}</li>
                <li>{t('payment.step2')}</li>
                <li>{t('payment.step3')}</li>
                <li className="font-bold">{t('payment.step4')}</li>
                <li>{t('payment.step5')}</li>
                <li>{t('payment.step6')}</li>
              </ol>
            </div>
          </div>
        )}

        {/* Why Deposit? */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            {t('payment.why_deposit')}
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ {t('payment.deposit_reason_1')}</li>
            <li>✅ {t('payment.deposit_reason_2')}</li>
            <li>✅ {t('payment.deposit_reason_3')}</li>
            <li>✅ {t('payment.deposit_reason_4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepositPaymentPage;
