import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentData {
  booking_id: number;
  qr_code: string;
  amount: number;
  payment_reference: string;
  expires_at: string;
  package_name: string;
  message: string;
}

const QRPaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentData, bookingId } = location.state as { paymentData: PaymentData; bookingId: number };

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'expired'>('pending');
  const [slipImage, setSlipImage] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!paymentData) {
      navigate('/');
      return;
    }

    // Calculate time left
    const expiresAt = new Date(paymentData.expires_at).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, expiresAt - now);
      setTimeLeft(Math.floor(diff / 1000));

      if (diff === 0) {
        setPaymentStatus('expired');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    // Check payment status every 5 seconds
    const statusInterval = setInterval(checkPaymentStatus, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [paymentData]);

  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/payments/${paymentData.payment_reference}/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.payment_status === 'completed') {
        setPaymentStatus('completed');
        setTimeout(() => {
          navigate('/bookings/my');
        }, 3000);
      } else if (response.data.payment_status === 'expired') {
        setPaymentStatus('expired');
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to check payment status');
      }
    }
  };

  const handleConfirmPayment = async () => {
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/payments/${paymentData.payment_reference}/confirm`,
        {
          transaction_id: transactionId || null,
          slip_image: slipImage || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentStatus('completed');
      setTimeout(() => {
        navigate('/bookings/my');
      }, 2000);
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Failed to confirm payment');
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!paymentData) {
    return null;
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="glass-dark rounded-lg border border-green-500/30 shadow-glow-green p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
            ชำระเงินสำเร็จ!
          </h1>
          <p className="text-gray-300 mb-6">
            การจองของคุณได้รับการยืนยันแล้ว
          </p>
          <p className="text-sm text-gray-400">
            กำลังนำคุณไปหน้าการจอง...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="glass-dark rounded-lg border border-red-500/30 shadow-glow-red p-8 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-4">
            QR Code หมดอายุ
          </h1>
          <p className="text-gray-300 mb-6">
            กรุณาทำการจองใหม่อีกครั้ง
          </p>
          <button
            onClick={() => navigate(-2)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-glow-pink transition-all"
          >
            กลับไปหน้าจอง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="glass-dark rounded-lg border border-purple-500/30 shadow-glow-purple p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">
          สแกน QR Code เพื่อชำระเงิน
        </h1>

        {/* Timer */}
        <div className="glass-dark border-2 border-yellow-500/50 rounded-lg p-4 mb-6 text-center shadow-glow-gold">
          <p className="text-sm text-gray-300 mb-2">เหลือเวลา</p>
          <p className={`text-4xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-yellow-400'}`}>
            {formatTime(timeLeft)}
          </p>
        </div>

        {/* Booking Details */}
        <div className="glass-dark border border-purple-500/30 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2 text-white">รายละเอียดการจอง</h2>
          <div className="space-y-1 text-sm">
            <p><span className="text-gray-400">แพ็คเกจ:</span> <span className="text-white">{paymentData.package_name}</span></p>
            <p><span className="text-gray-400">Booking ID:</span> <span className="text-white">#{bookingId}</span></p>
            <p><span className="text-gray-400">Payment Ref:</span> <span className="text-white">{paymentData.payment_reference}</span></p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-6 rounded-lg border-2 border-purple-500/50 shadow-glow-purple">
            <QRCodeSVG value={paymentData.qr_code} size={256} level="H" />
          </div>
        </div>

        {/* Amount */}
        <div className="glass-dark border border-pink-500/30 rounded-lg p-4 mb-6 text-center shadow-glow-pink">
          <p className="text-gray-300 mb-1">ยอดชำระ</p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            ฿{paymentData.amount.toLocaleString()}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">วิธีชำระเงิน:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-900">
            <li>เปิดแอปธนาคารหรือ Mobile Banking</li>
            <li>เลือกเมนู "สแกน QR Code"</li>
            <li>สแกน QR Code ด้านบน</li>
            <li>ตรวจสอบยอดเงินและยืนยันการโอน</li>
            <li>รอระบบตรวจสอบการชำระเงินอัตโนมัติ</li>
          </ol>
        </div>

        {/* Manual Confirmation */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">หรือยืนยันการชำระเงินด้วยตนเอง</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลขที่อ้างอิง (Transaction ID) - ไม่บังคับ
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="ระบุเลข Ref จากธนาคาร"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL รูปสลิปการโอน - ไม่บังคับ
              </label>
              <input
                type="url"
                value={slipImage}
                onChange={(e) => setSlipImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={uploading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 transition"
            >
              {uploading ? 'กำลังยืนยัน...' : '✓ ยืนยันการชำระเงิน'}
            </button>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

export default QRPaymentPage;
