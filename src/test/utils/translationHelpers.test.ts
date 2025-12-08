import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  translateCategory, 
  translateProvince, 
  translateTier,
  formatPrice,
  formatDistance 
} from '../../utils/translationHelpers';

// Mock i18n translation function
const mockT = vi.fn((key: string, options?: any) => {
  return options?.defaultValue || key;
});

describe('Translation Helpers', () => {
  describe('translateCategory', () => {
    beforeEach(() => {
      mockT.mockClear();
    });

    it('translates category name correctly', () => {
      const category = 'companion';
      const result = translateCategory(category, mockT as any);
      expect(result).toBeTruthy();
    });

    it('handles null category gracefully', () => {
      const result = translateCategory(null as any, mockT as any);
      expect(result).toBe('');
    });
  });

  describe('translateProvince', () => {
    beforeEach(() => {
      mockT.mockClear();
    });

    it('translates province name correctly', () => {
      const province = 'Bangkok';
      const result = translateProvince(province, mockT as any);
      expect(result).toBeTruthy();
    });

    it('returns original if translation not found', () => {
      const province = 'Unknown Province';
      const result = translateProvince(province, mockT as any);
      expect(result).toBe(province);
    });
  });

  describe('translateTier', () => {
    beforeEach(() => {
      mockT.mockClear();
    });

    it('translates tier name correctly', () => {
      const tier = 'premium';
      const result = translateTier(tier, mockT as any);
      expect(result).toBeTruthy();
    });

    it('handles numeric tier id', () => {
      const tierId = 1;
      const result = translateTier(tierId.toString(), mockT as any);
      expect(result).toBeTruthy();
    });
  });

  describe('formatPrice', () => {
    it('formats price with currency symbol', () => {
      const price = 1000;
      const result = formatPrice(price);
      expect(result).toMatch(/1[,]?000/);
    });

    it('handles decimal prices', () => {
      const price = 1500.50;
      const result = formatPrice(price);
      expect(result).toBeTruthy();
    });

    it('handles zero price', () => {
      const price = 0;
      const result = formatPrice(price);
      expect(result).toBeTruthy();
    });
  });

  describe('formatDistance', () => {
    it('formats distance in kilometers', () => {
      const distance = 5.5;
      const result = formatDistance(distance);
      expect(result).toContain('km');
    });

    it('handles null distance', () => {
      const result = formatDistance(null as any);
      expect(result).toMatch(/0\s*m/);
    });

    it('formats distance less than 1km', () => {
      const distance = 0.5;
      const result = formatDistance(distance);
      expect(result).toBeTruthy();
    });
  });
});
