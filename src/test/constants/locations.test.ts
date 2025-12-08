import { describe, it, expect } from 'vitest';
import { 
  getAllProvinces, 
  getAllProvincesInThai,
  getDistrictsByProvince,
  getDistrictsByProvinceInThai,
  getTotalProvinces,
  getTotalDistricts
} from '../../constants/locations';

describe('Location Data', () => {
  describe('getAllProvinces', () => {
    it('returns array of all provinces in English', () => {
      const provinces = getAllProvinces();
      expect(provinces).toBeInstanceOf(Array);
      expect(provinces.length).toBeGreaterThan(0);
    });

    it('returns all provinces', () => {
      const provinces = getAllProvinces();
      expect(provinces.length).toBeGreaterThan(0);
    });

    it('includes Bangkok', () => {
      const provinces = getAllProvinces();
      expect(provinces).toContain('Bangkok');
    });
  });

  describe('getAllProvincesInThai', () => {
    it('returns array of all provinces in Thai', () => {
      const provinces = getAllProvincesInThai();
      expect(provinces).toBeInstanceOf(Array);
      expect(provinces.length).toBeGreaterThan(0);
    });

    it('returns all Thai provinces', () => {
      const provinces = getAllProvincesInThai();
      expect(provinces.length).toBeGreaterThan(0);
    });

    it('includes Bangkok in Thai', () => {
      const provinces = getAllProvincesInThai();
      expect(provinces).toContain('กรุงเทพมหานคร');
    });
  });

  describe('getDistrictsByProvince', () => {
    it('returns districts for Bangkok', () => {
      const districts = getDistrictsByProvince('Bangkok');
      expect(districts).toBeInstanceOf(Array);
      expect(districts.length).toBeGreaterThan(0);
    });

    it('returns empty array for unknown province', () => {
      const districts = getDistrictsByProvince('Unknown Province');
      expect(districts).toEqual([]);
    });

    it('Bangkok has multiple districts', () => {
      const districts = getDistrictsByProvince('Bangkok');
      expect(districts.length).toBeGreaterThan(40);
    });
  });

  describe('getDistrictsByProvinceInThai', () => {
    it('returns Thai districts for Bangkok', () => {
      const districts = getDistrictsByProvinceInThai('Bangkok');
      expect(districts).toBeInstanceOf(Array);
      expect(districts.length).toBeGreaterThan(0);
    });

    it('returns empty array for unknown province', () => {
      const districts = getDistrictsByProvinceInThai('Unknown Province');
      expect(districts).toEqual([]);
    });
  });

  describe('Statistics Functions', () => {
    it('getTotalProvinces returns correct count', () => {
      const total = getTotalProvinces();
      expect(total).toBeGreaterThan(70);
    });

    it('getTotalDistricts returns count of all districts', () => {
      const total = getTotalDistricts();
      expect(total).toBeGreaterThan(0);
      expect(total).toBeGreaterThan(800); // Should be around 900
    });
  });

  describe('Data Integrity', () => {
    it('all provinces have corresponding Thai names', () => {
      const provinces = getAllProvinces();
      const provincesInThai = getAllProvincesInThai();
      
      expect(provinces.length).toBe(provincesInThai.length);
    });

    it('all provinces have districts', () => {
      const provinces = getAllProvinces();
      
      provinces.forEach(province => {
        const districts = getDistrictsByProvince(province);
        expect(districts.length).toBeGreaterThan(0);
      });
    });

    it('English and Thai district counts match', () => {
      const provinces = getAllProvinces();
      
      provinces.forEach(province => {
        const districtsEn = getDistrictsByProvince(province);
        const districtsTh = getDistrictsByProvinceInThai(province);
        
        expect(districtsEn.length).toBe(districtsTh.length);
      });
    });
  });
});
