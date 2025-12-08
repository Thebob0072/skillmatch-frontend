// รวมข้อมูลจังหวัดทั้งหมด 77 จังหวัด พร้อมอำเภอ
import { CENTRAL_PROVINCES } from './central';
import { NORTH_PROVINCES } from './north';
import { NORTHEAST_PROVINCES } from './northeast';
import { SOUTH_PROVINCES } from './south';
import { EAST_PROVINCES } from './east';

export interface ProvinceWithDistricts {
  province_th: string;
  province_en: string;
  districts: string[];
}

// รวมจังหวัดทั้งหมด
export const ALL_PROVINCES: ProvinceWithDistricts[] = [
  ...CENTRAL_PROVINCES,
  ...NORTH_PROVINCES,
  ...NORTHEAST_PROVINCES,
  ...SOUTH_PROVINCES,
  ...EAST_PROVINCES,
];

// Get all provinces (English names)
export const getAllProvinces = (): string[] => {
  return ALL_PROVINCES.map(p => p.province_en);
};

// Get all provinces (Thai names)
export const getAllProvincesInThai = (): string[] => {
  return ALL_PROVINCES.map(p => p.province_th);
};

// Get districts by province (English)
export const getDistrictsByProvince = (provinceEn: string): string[] => {
  const province = ALL_PROVINCES.find(p => p.province_en === provinceEn);
  return province?.districts || [];
};

// Get districts by province (Thai)
export const getDistrictsByProvinceInThai = (provinceEn: string): string[] => {
  // ส่งค่า Thai districts กลับ (ตอนนี้ใช้เหมือนกัน)
  return getDistrictsByProvince(provinceEn);
};

// Find province by name
export const findProvince = (search: string): ProvinceWithDistricts | undefined => {
  return ALL_PROVINCES.find(
    p => p.province_en === search || p.province_th === search
  );
};

// Count total provinces
export const getTotalProvinces = (): number => {
  return ALL_PROVINCES.length;
};

// Count total districts
export const getTotalDistricts = (): number => {
  return ALL_PROVINCES.reduce((sum, province) => sum + province.districts.length, 0);
};

// Export everything
export * from './central';
export * from './north';
export * from './northeast';
export * from './south';
export * from './east';
