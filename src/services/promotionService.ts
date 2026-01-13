import api from './api';

// ================================
// Types
// ================================

export interface DepositSettings {
  require_deposit: boolean;
  deposit_percentage?: number;
  deposit_type?: 'percentage' | 'fixed';
  deposit_amount?: number;
  deposit_deadline_hours?: number;
  refund_policy?: 'full' | 'partial' | 'none';
}

export interface CancellationPolicy {
  policy_id?: number;
  hours_before_booking: number;
  fee_percentage: number;
}

export interface CancellationPolicySettings {
  enable_cancellation_fee: boolean;
  free_cancellation_hours?: number;
  cancellation_tiers?: { hours_before: number; fee_percentage: number }[];
  no_show_fee_percentage?: number;
}

export interface BoostPackage {
  package_id: number;
  name: string;
  boost_type: string;
  duration: number;
  price: number;
  description?: string;
}

export interface ActiveBoost {
  boost_id: number;
  boost_type: string;
  start_time: string;
  end_time: string;
  amount: number;
  remaining_hours: number;
}

export interface Coupon {
  coupon_id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_booking_amount?: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export interface ApplyCouponResult {
  coupon_code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  original_price: number;
  new_total: number;
  message: string;
}

export interface PhotoVerification {
  verification_id: number;
  photo_id: number;
  user_id: number;
  username: string;
  photo_url: string;
  created_at: string;
}

// ================================
// Deposit API
// ================================

export const getDepositSettings = async (): Promise<DepositSettings> => {
  const response = await api.get('/provider/deposit-settings');
  return response.data;
};

export const updateDepositSettings = async (settings: DepositSettings) => {
  const response = await api.put('/provider/deposit-settings', settings);
  return response.data;
};

export const payDeposit = async (bookingId: number) => {
  const response = await api.post(`/bookings/${bookingId}/deposit/pay`);
  return response.data;
};

// ================================
// Cancellation API
// ================================

export const getCancellationPolicy = async (providerId?: number): Promise<CancellationPolicySettings> => {
  const url = providerId 
    ? `/provider/cancellation-policy?providerId=${providerId}`
    : '/provider/cancellation-policy';
  const response = await api.get(url);
  return response.data;
};

export const updateCancellationPolicy = async (settings: CancellationPolicySettings) => {
  const response = await api.put('/provider/cancellation-policy', settings);
  return response.data;
};

export const cancelBookingWithFee = async (bookingId: number, reason?: string) => {
  const response = await api.post(`/bookings/${bookingId}/cancel`, { reason });
  return response.data;
};

// ================================
// Profile Boost API
// ================================

export const getBoostPackages = async (): Promise<BoostPackage[]> => {
  const response = await api.get('/boost/packages');
  return response.data;
};

export const purchaseBoost = async (packageId: number) => {
  const response = await api.post('/boost/purchase', { package_id: packageId });
  return response.data;
};

export const getActiveBoosts = async (): Promise<ActiveBoost[]> => {
  const response = await api.get('/boost/active');
  return response.data;
};

// ================================
// Coupon API
// ================================

export const createCoupon = async (data: {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_booking_amount?: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
}) => {
  const response = await api.post('/coupons', data);
  return response.data;
};

export const applyCoupon = async (code: string, bookingId: number): Promise<ApplyCouponResult> => {
  const response = await api.post('/coupons/apply', { code, booking_id: bookingId });
  return response.data;
};

export const getMyCoupons = async (): Promise<Coupon[]> => {
  const response = await api.get('/coupons/my');
  return response.data;
};

export const browseCoupons = async (): Promise<Coupon[]> => {
  const response = await api.get('/coupons/browse');
  return response.data;
};

export const getProviderCoupons = async (providerId: number): Promise<Coupon[]> => {
  const response = await api.get(`/coupons/provider/${providerId}`);
  return response.data;
};

// ================================
// Photo Verification API
// ================================

export const submitPhotoForVerification = async (photoId: number) => {
  const response = await api.post(`/photos/${photoId}/verify`);
  return response.data;
};

export const uploadPhotoForVerification = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/verified-photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPendingPhotoVerifications = async (): Promise<PhotoVerification[]> => {
  const response = await api.get('/admin/photos/pending');
  return response.data;
};

export const adminVerifyPhoto = async (photoId: number, action: 'approve' | 'reject', reason?: string) => {
  const response = await api.patch(`/admin/photos/${photoId}/verify`, {
    action,
    reason,
  });
  return response.data;
};

export default {
  // Deposit
  getDepositSettings,
  updateDepositSettings,
  payDeposit,
  // Cancellation
  getCancellationPolicy,
  updateCancellationPolicy,
  cancelBookingWithFee,
  // Boost
  getBoostPackages,
  purchaseBoost,
  getActiveBoosts,
  // Coupon
  createCoupon,
  applyCoupon,
  getMyCoupons,
  browseCoupons,
  getProviderCoupons,
  // Photo Verification
  submitPhotoForVerification,
  getPendingPhotoVerifications,
  adminVerifyPhoto,
};
