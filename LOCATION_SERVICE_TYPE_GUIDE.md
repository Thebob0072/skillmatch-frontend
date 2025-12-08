# 📍 Location & Service Type Filter System

## Overview

ระบบกรองตามตำแหน่งที่ตั้งแบบละเอียด (จังหวัด/อำเภอ/ตำบล/พิกัด) และประเภทการให้บริการ (Incall/Outcall/Both)

---

## 🏠 Service Type System

### Types

1. **Incall (บริการที่ร้าน)** - ลูกค้าต้องมาหา
   - Provider มีสถานที่ให้บริการ
   - ลูกค้าเดินทางไปหา provider
   - ตัวอย่าง: คอนโด, โรงแรม, สตูดิโอของ provider

2. **Outcall (บริการนอกสถานที่)** - Provider ไปหา
   - Provider เดินทางไปหาลูกค้า
   - บริการที่โรงแรมหรือสถานที่ของลูกค้า
   - อาจมีค่าเดินทางเพิ่ม

3. **Both (ทั้งสองแบบ)** - ยืดหยุ่น
   - รองรับทั้ง Incall และ Outcall
   - ลูกค้าเลือกได้ตามความสะดวก

### API Query

```bash
# Filter by service type
GET /browse/search?service_type=Incall
GET /browse/search?service_type=Outcall
GET /browse/search?service_type=Both
```

### Translation Keys

```json
// Thai
{
  "service_type": {
    "incall": "บริการที่ร้าน (ต้องมาหา)",
    "outcall": "บริการนอกสถานที่ (ไปหาให้)",
    "both": "ทั้งสองแบบ"
  }
}

// English
{
  "service_type": {
    "incall": "Incall (Come to me)",
    "outcall": "Outcall (I come to you)",
    "both": "Both Available"
  }
}

// Chinese
{
  "service_type": {
    "incall": "到店服务 (您来找我)",
    "outcall": "外出服务 (我去找您)",
    "both": "两种都可"
  }
}
```

---

## 📍 Location Hierarchy System

### Location Levels

1. **Province (จังหวัด)** - Top level
   - กรุงเทพมหานคร, เชียงใหม่, ภูเก็ต, ฯลฯ

2. **District (อำเภอ/เขต)** - Second level
   - สุขุมวิท, สีลม, ป่าตอง, ฯลฯ

3. **Sub-district (ตำบล/แขวง)** - Third level
   - คลองเตย, ปทุมวัน, ฯลฯ

4. **Address (ที่อยู่)** - Detailed text
   - 123 ถนนสุขุมวิท ซอย 11

5. **Coordinates (พิกัด GPS)** - Exact location
   - Latitude: 13.7563, Longitude: 100.5018

### Database Schema

```typescript
interface ProviderLocation {
  province: string;           // Required: "กรุงเทพมหานคร"
  district: string;           // Optional: "บางรัก"
  sub_district: string;       // Optional: "สีลม"
  address_line1: string;      // Optional: "123 ถนนสุขุมวิท"
  postal_code: string;        // Optional: "10500"
  latitude: number;           // Optional: 13.7563
  longitude: number;          // Optional: 100.5018
}
```

### API Query Examples

#### 1. Search by Province
```bash
GET /browse/search?province=Bangkok
GET /browse/search?province=กรุงเทพมหานคร
```

#### 2. Search by District
```bash
GET /browse/search?province=Bangkok&district=Sukhumvit
```

#### 3. Search by Sub-district
```bash
GET /browse/search?province=Bangkok&district=BangRak&sub_district=Silom
```

#### 4. Search by Text (All locations)
```bash
GET /browse/search?location=Sukhumvit
# Searches in: province, district, sub_district, address_line1
```

#### 5. Search by Distance (Geo-proximity)
```bash
GET /browse/search?lat=13.7563&lng=100.5018&radius=5
# Find providers within 5km of specified coordinates
```

---

## 🎯 Combined Filters

### Example: High-end English-speaking Outcall service in Bangkok

```bash
GET /browse/search?province=Bangkok&service_type=Outcall&languages=en&tier=4&rating=4.5
```

### Example: Budget-friendly Incall in Chiang Mai

```bash
GET /browse/search?province=ChiangMai&service_type=Incall&tier=1,2&sort=price
```

### Example: Near my hotel (GPS-based)

```bash
GET /browse/search?lat=13.7563&lng=100.5018&radius=3&service_type=Both
```

---

## 🎨 UI Components

### Service Type Badge

```tsx
interface ServiceTypeBadgeProps {
  serviceType: 'Incall' | 'Outcall' | 'Both';
}

function ServiceTypeBadge({ serviceType }: ServiceTypeBadgeProps) {
  const { t } = useTranslation();
  
  const icons = {
    Incall: '🏠',
    Outcall: '🚗',
    Both: '🏠🚗'
  };
  
  const colors = {
    Incall: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    Outcall: 'bg-green-500/20 border-green-500/50 text-green-400',
    Both: 'bg-purple-500/20 border-purple-500/50 text-purple-400'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold ${colors[serviceType]}`}>
      <span>{icons[serviceType]}</span>
      {t(`service_type.${serviceType.toLowerCase()}`)}
    </span>
  );
}
```

### Location Display Component

```tsx
interface LocationDisplayProps {
  provider: {
    province: string;
    district?: string;
    sub_district?: string;
    distance_km?: number;
  };
}

function LocationDisplay({ provider }: LocationDisplayProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-1 text-sm">
      {/* Main location */}
      <div className="flex items-center gap-2 text-gray-300">
        <span>📍</span>
        <span>
          {provider.district && `${provider.district}, `}
          {provider.province}
        </span>
      </div>
      
      {/* Distance (if available) */}
      {provider.distance_km !== undefined && (
        <div className="flex items-center gap-2 text-neon-gold">
          <span>📏</span>
          <span>{provider.distance_km.toFixed(1)} km {t('location.distance')}</span>
        </div>
      )}
    </div>
  );
}
```

### Enhanced Location Filter

```tsx
function LocationFilter() {
  const { t } = useTranslation();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const provinces = [
    'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 
    'Krabi', 'Samui', 'Hua Hin'
  ];

  const districts = {
    Bangkok: ['Sukhumvit', 'Silom', 'Sathorn', 'Thonglor', 'Ekkamai'],
    'Chiang Mai': ['Old City', 'Nimman', 'Night Bazaar'],
    Phuket: ['Patong', 'Kata', 'Karon', 'Phuket Town']
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Update search with coordinates
          console.log('Location:', latitude, longitude);
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      <button
        onClick={handleUseCurrentLocation}
        className="w-full px-4 py-3 bg-neon-gold/20 border-2 border-neon-gold/50 rounded-xl text-neon-gold font-bold hover:bg-neon-gold/30 transition-all flex items-center justify-center gap-2"
      >
        <span>📍</span>
        {t('location.current_location')}
      </button>

      {/* Province Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">
          {t('location.province')}
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedDistrict(''); // Reset district
          }}
          className="w-full px-4 py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:outline-none focus:border-neon-purple"
        >
          <option value="">All Provinces</option>
          {provinces.map(province => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>

      {/* District Dropdown (conditional) */}
      {selectedProvince && districts[selectedProvince as keyof typeof districts] && (
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            {t('location.district')}
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-4 py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:outline-none focus:border-neon-purple"
          >
            <option value="">All Districts</option>
            {districts[selectedProvince as keyof typeof districts].map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
```

---

## 📦 Provider Card with Full Info

```tsx
function ProviderCard({ provider }: { provider: Provider }) {
  const { t } = useTranslation();

  return (
    <div className="bg-black/50 backdrop-blur-2xl rounded-3xl p-6 border-2 border-neon-pink/30">
      {/* Profile Picture */}
      <img src={provider.profile_picture_url} alt={provider.username} />
      
      {/* Name & Tier */}
      <h3>{provider.username}</h3>
      <span className="tier">{t(`tier.${provider.tier_name.toLowerCase()}`)}</span>
      
      {/* Service Type Badge */}
      <ServiceTypeBadge serviceType={provider.service_type} />
      
      {/* Location */}
      <LocationDisplay provider={provider} />
      
      {/* Languages */}
      {provider.languages?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {provider.languages.map(lang => (
            <span key={lang} className="text-xs bg-neon-purple/20 px-2 py-1 rounded-full">
              🗣️ {lang.toUpperCase()}
            </span>
          ))}
        </div>
      )}
      
      {/* Rating */}
      <div className="flex items-center gap-2 mt-2">
        <span>⭐ {provider.rating_avg.toFixed(1)}</span>
        <span className="text-gray-400">({provider.review_count} reviews)</span>
      </div>
      
      {/* Price */}
      <div className="mt-4">
        <span className="text-neon-gold font-bold">From ฿{provider.min_price}</span>
      </div>
      
      {/* View Profile Button */}
      <button className="w-full mt-4 bg-gradient-to-r from-neon-purple to-neon-pink">
        {t('browse.view_profile')}
      </button>
    </div>
  );
}
```

---

## 🔍 Search Scenarios

### 1. Tourist in Bangkok Hotel
```
User clicks "Use Current Location"
→ App gets GPS (13.7563, 100.5018)
→ Query: ?lat=13.7563&lng=100.5018&radius=3&service_type=Outcall&languages=en
→ Shows: English-speaking providers who do outcall within 3km
```

### 2. Local Looking for Incall
```
User selects: Province=Bangkok, District=Sukhumvit, Service Type=Incall
→ Query: ?province=Bangkok&district=Sukhumvit&service_type=Incall
→ Shows: Providers with place in Sukhumvit (user goes to them)
```

### 3. Business Traveler
```
User selects: Service Type=Outcall, Languages=en,zh, Tier=Premium
→ Query: ?service_type=Outcall&languages=en,zh&tier=4&rating=4.5
→ Shows: Premium multilingual providers who do hotel visits
```

---

## 💡 Best Practices

### For Providers:
1. ✅ **Specify service type clearly** - Help clients understand where service happens
2. ✅ **Add accurate location** - Include province, district for better search results
3. ✅ **Enable GPS coordinates** - Shows distance to clients
4. ✅ **List languages spoken** - Attract international clients
5. ✅ **Update availability** - Incall requires place, Outcall requires mobility

### For Clients:
1. ✅ **Use location filters** - Find providers in your area
2. ✅ **Check service type** - Incall (you go) vs Outcall (they come)
3. ✅ **Use GPS search** - Find nearest providers to your hotel
4. ✅ **Filter by language** - Ensure communication works
5. ✅ **Read location details** - Understand travel requirements

---

## 🚀 Implementation Checklist

- [x] Add `service_type` translation keys (th/en/zh)
- [x] Add `location` translation keys (th/en/zh)
- [x] Add `selectedServiceType` state to BrowsePage
- [x] Add Service Type dropdown filter
- [x] Add `clearFilters` update with service type
- [x] Add `location_sub_district` to User and Provider types
- [x] Create Thailand location data file (locationData.ts)
- [x] Add province dropdown with real data (7 provinces)
- [x] Add district dropdown (cascading from province)
- [x] Add sub-district dropdown (cascading from district)
- [x] Add `sub_district` to SearchParams interface
- [ ] Add GPS location button with geolocation API
- [ ] Add distance calculation display
- [ ] Add ServiceTypeBadge component
- [ ] Add LocationDisplay component on provider cards
- [ ] Update Provider type with `service_type` field in backend
- [ ] Update API call with all location parameters
- [ ] Test all filter combinations
- [ ] Add map view option

---

## 📊 Database Updates Needed

```sql
-- Add service_type to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN service_type VARCHAR(10) 
CHECK (service_type IN ('Incall', 'Outcall', 'Both'));

-- Add index for service_type
CREATE INDEX idx_service_type ON user_profiles(service_type);

-- Add index for location search
CREATE INDEX idx_location ON user_profiles(province, district);

-- Add index for geo-proximity search
CREATE INDEX idx_coordinates ON user_profiles USING GIST(
  ll_to_earth(latitude, longitude)
);
```

---

**Status:** ✅ Translation keys added, UI filters partially implemented  
**Next:** Backend API updates, GPS integration, distance calculation
