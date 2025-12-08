/**
 * Translation Helper Functions
 * ช่วยแปลข้อมูลที่มาจาก Backend (ภาษาอังกฤษ) ให้เป็นภาษาที่ผู้ใช้เลือก
 */

import type { TFunction } from 'i18next';

/**
 * แปล Category Name จาก Backend
 * @example
 * translateCategory('Companion', t) → "คอมพาเนียน" (TH) / "Companion" (EN)
 */
export const translateCategory = (categoryName: string, t: TFunction): string => {
  if (!categoryName) return '';
  
  // Convert to translation key format: "Dinner Date" → "dinner_date"
  const key = categoryName.toLowerCase().replace(/\s+/g, '_');
  
  // Use translation with fallback to original name
  return t(`categories.${key}`, { defaultValue: categoryName });
};

/**
 * แปล Service Type จาก Backend
 * @example
 * translateServiceType('Incall', t) → "บริการที่ร้าน (ต้องมาหา)" (TH)
 */
export const translateServiceType = (serviceType: string, t: TFunction): string => {
  if (!serviceType) return '';
  
  const key = serviceType.toLowerCase();
  return t(`service_type.${key}`, { defaultValue: serviceType });
};

/**
 * แปล Booking Status จาก Backend
 * @example
 * translateBookingStatus('pending', t) → "รอยืนยัน" (TH) / "Pending" (EN)
 */
export const translateBookingStatus = (status: string, t: TFunction): string => {
  if (!status) return '';
  
  return t(`booking_status.${status}`, { defaultValue: status });
};

/**
 * แปล Payment Status จาก Backend
 */
export const translatePaymentStatus = (status: string, t: TFunction): string => {
  if (!status) return '';
  
  return t(`payment_status.${status}`, { defaultValue: status });
};

/**
 * แปล Tier Name จาก Backend
 * @example
 * translateTier('Premium', t) → "พรีเมียม" (TH) / "Premium" (EN)
 */
export const translateTier = (tierName: string, t: TFunction): string => {
  if (!tierName) return '';
  
  const key = tierName.toLowerCase();
  return t(`tier.${key}`, { defaultValue: tierName });
};

/**
 * แปล Province Name (จังหวัด)
 * @example
 * translateProvince('Bangkok', t) → "กรุงเทพมหานคร" (TH) / "Bangkok" (EN)
 */
export const translateProvince = (province: string, t: TFunction): string => {
  if (!province) return '';
  
  // Try translation, fallback to original if not found
  return t(`provinces.${province}`, { defaultValue: province });
};

/**
 * แปล District Name (อำเภอ/เขต)
 */
export const translateDistrict = (district: string, t: TFunction): string => {
  if (!district) return '';
  
  return t(`districts.${district}`, { defaultValue: district });
};

/**
 * Format ราคา เป็น Thai Baht
 * @example
 * formatPrice(3000) → "฿3,000"
 */
export const formatPrice = (price: number): string => {
  return `฿${price.toLocaleString('en-US')}`;
};

/**
 * Format วันที่ เป็นรูปแบบที่อ่านง่าย
 * @example
 * formatDate('2025-12-03T10:00:00Z', 'th') → "3 ธันวาคม 2025"
 */
export const formatDate = (dateString: string, locale: string = 'en'): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', options);
};

/**
 * Format วันที่และเวลา
 * @example
 * formatDateTime('2025-12-03T10:00:00Z', 'th') → "3 ธันวาคม 2025, 17:00"
 */
export const formatDateTime = (dateString: string, locale: string = 'en'): string => {
  const date = new Date(dateString);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const dateStr = date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', dateOptions);
  const timeStr = date.toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', timeOptions);
  
  return `${dateStr}, ${timeStr}`;
};

/**
 * Format ระยะทาง
 * @example
 * formatDistance(2.5) → "2.5 km"
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

/**
 * Get Category Icon
 */
export const getCategoryIcon = (categoryName: string): string => {
  const icons: Record<string, string> = {
    'companion': '💋',
    'massage': '💆',
    'entertainment': '🎭',
    'dinner_date': '🍽️',
    'tour_guide': '🗺️',
    'model': '📸',
  };
  
  const key = categoryName.toLowerCase().replace(/\s+/g, '_');
  return icons[key] || '✨';
};

/**
 * Get Tier Color
 */
export const getTierColor = (tierName: string): string => {
  const colors: Record<string, string> = {
    'general': 'gray',
    'silver': 'slate',
    'diamond': 'blue',
    'premium': 'purple',
    'god': 'yellow',
  };
  
  const key = tierName.toLowerCase();
  return colors[key] || 'gray';
};

/**
 * Get Status Color for Booking
 */
export const getBookingStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'pending': 'yellow',
    'confirmed': 'blue',
    'in_progress': 'purple',
    'completed': 'green',
    'cancelled': 'red',
  };
  
  return colors[status] || 'gray';
};
