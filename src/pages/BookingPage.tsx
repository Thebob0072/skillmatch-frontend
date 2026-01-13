import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface Package {
  package_id: number;
  package_name: string;
  description: string;
  duration: number;
  price: number;
}

interface Provider {
  user_id: number;
  display_name: string;
  profile_picture_url?: string;
  location?: string;
}

const BookingPage: React.FC = () => {
  const { t } = useTranslation();
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'promptpay'>('promptpay');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProviderData();
    loadPackages();
  }, [providerId]);

  const loadProviderData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/provider/${providerId}/public`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProvider(response.data);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load provider');
      }
    }
  };

  const loadPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/packages/${providerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPackages(response.data);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load packages');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedPackage) {
      setError(t('please_select_package'));
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        provider_id: parseInt(providerId!),
        package_id: selectedPackage,
        booking_date: bookingDate,
        start_time: startTime,
        location: location || null,
        special_notes: specialNotes || null,
      };

      if (paymentMethod === 'promptpay') {
        if (!phoneNumber) {
          setError('กรุณาระบุเบอร์โทร PromptPay');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          '/api/bookings/create-with-qr',
          { ...bookingData, phone_number: phoneNumber },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Navigate to QR payment page
        navigate('/payment/qr', { 
          state: { 
            paymentData: response.data,
            bookingId: response.data.booking_id 
          } 
        });
      } else {
        // Stripe payment
        const response = await axios.post(
          '/api/bookings/create-with-payment',
          bookingData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Redirect to Stripe checkout
        window.location.href = response.data.checkout_url;
      }
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const selectedPkg = packages.find(pkg => pkg.package_id === selectedPackage);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="glass-dark rounded-lg border border-purple-500/30 shadow-glow-purple p-6">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">{t('create_booking')}</h1>

        {/* Provider Info */}
        {provider && (
          <div className="mb-6 p-4 glass-dark border border-purple-500/30 rounded-lg flex items-center gap-4">
            {provider.profile_picture_url && (
              <img
                src={provider.profile_picture_url}
                alt={provider.display_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">{provider.display_name}</h2>
              {provider.location && (
                <p className="text-gray-300">📍 {provider.location}</p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('select_package')} *
            </label>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.package_id}
                  onClick={() => setSelectedPackage(pkg.package_id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedPackage === pkg.package_id
                      ? 'border-pink-500 bg-pink-500/10 shadow-glow-pink'
                      : 'border-purple-500/30 hover:border-pink-500/50 hover:bg-purple-500/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">{pkg.package_name}</h3>
                      {pkg.description && (
                        <p className="text-gray-300 text-sm mt-1">{pkg.description}</p>
                      )}
                      <p className="text-gray-400 text-sm mt-2">
                        ⏱️ {pkg.duration} {t('minutes')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        ฿{pkg.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('booking_date')} *
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('start_time')} *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('location')}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('enter_meeting_location')}
              className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder-gray-500"
            />
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('special_notes')}
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows={3}
              placeholder={t('any_special_requests')}
              className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder-gray-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('payment_method')} *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-purple-500/30 rounded-lg cursor-pointer hover:bg-purple-500/10 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="promptpay"
                  checked={paymentMethod === 'promptpay'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'promptpay')}
                  className="mr-3"
                />
                <div className="flex-1">
                  <span className="font-medium text-white">💳 PromptPay QR Code</span>
                  <p className="text-sm text-gray-300">ชำระผ่าน QR Code PromptPay</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-purple-500/30 rounded-lg cursor-pointer hover:bg-purple-500/10 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                  className="mr-3"
                />
                <div className="flex-1">
                  <span className="font-medium">💳 Credit/Debit Card</span>
                  <p className="text-sm text-gray-600">ชำระผ่าน Stripe (Visa, Mastercard)</p>
                </div>
              </label>
            </div>
          </div>

          {/* PromptPay Phone Number */}
          {paymentMethod === 'promptpay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทร PromptPay ของผู้รับเงิน *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0812345678"
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ระบุเบอร์โทรศัพท์ที่ผูกกับ PromptPay ของ Provider
              </p>
            </div>
          )}

          {/* Total Price */}
          {selectedPkg && (
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{t('total_price')}:</span>
                <span className="text-3xl font-bold text-pink-600">
                  ฿{selectedPkg.price.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedPackage}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? t('processing') : t('proceed_to_payment')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
