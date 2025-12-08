# 📚 SkillMatch API - Complete Frontend Integration Guide

> **Version:** 2.1 (December 3, 2025)  
> **Status:** Production Ready with i18n  
> **Backend:** http://localhost:8080  
> **Frontend:** React + TypeScript + react-i18next  
> **Languages:** Thai (ไทย), English, Chinese (中文)

---

## 📖 Table of Contents

1. [🚀 Quick Start (5 Minutes)](#-quick-start-5-minutes)
2. [🌐 Translation & Localization (Thai/English/Chinese)](#-translation--localization-thaienglishchinese)
3. [⚠️ Breaking Changes (December 2025)](#️-breaking-changes-december-2025)
4. [🔐 Authentication & Authorization](#-authentication--authorization)
5. [🔍 Browse & Search System](#-browse--search-system)
6. [👤 Profile Management](#-profile-management)
7. [💬 Messaging System](#-messaging-system)
8. [📦 Booking & Payment System](#-booking--payment-system)
9. [💰 Financial System (Provider Wallet)](#-financial-system-provider-wallet)
10. [🎨 Service Categories](#-service-categories)
11. [📡 Complete API Reference](#-complete-api-reference)
12. [🧩 React Components Examples](#-react-components-examples)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Test Backend Connection
```bash
curl http://localhost:8080/ping
# Expected: {"message":"pong!","postgres_time":"2025-12-03T..."}
```

### Step 2: Create API Helper

```typescript
// src/services/api.ts
const API_BASE = 'http://localhost:8080';

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }
  
  return data;
}

// Usage Examples:
// Public: const categories = await apiCall<{categories: Category[]}>('/service-categories');
// Protected: const profile = await apiCall<User>('/users/me');
// POST: await apiCall('/login', { method: 'POST', body: JSON.stringify({email, password}) });
```

### Step 3: Test Authentication
```typescript
// Login
const loginData = await apiCall<{token: string; user: User}>('/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'god@skillmatch.com',
    password: 'godpass123'
  })
});

// Save token
localStorage.setItem('token', loginData.token);

// Get user profile
const user = await apiCall<User>('/users/me');
console.log(user.profile_picture_url); // ✅ NEW unified field
```

---

## 🌐 Translation & Localization (Thai/English/Chinese)

### Overview

SkillMatch uses **react-i18next** for internationalization with support for **Thai (th)**, **English (en)**, and **Chinese (zh)**. Translation files are located in `public/locales/{lang}/translation.json`.

### ✅ i18n Setup (Already Configured)

```typescript
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'th',
    supportedLngs: ['th', 'en', 'zh'],
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### 📦 Translation Structure (450+ Keys)

```json
// public/locales/th/translation.json
{
  "common": {
    "save": "บันทึก",
    "cancel": "ยกเลิก",
    "delete": "ลบ",
    "edit": "แก้ไข",
    "search": "ค้นหา",
    "loading": "กำลังโหลด...",
    "error": "เกิดข้อผิดพลาด",
    "success": "สำเร็จ",
    "confirm": "ยืนยัน",
    "close": "ปิด"
  },
  "roles": {
    "client": "ลูกค้า",
    "provider": "ผู้ให้บริการ",
    "admin": "ผู้ดูแลระบบ",
    "god": "ผู้ดูแลระบบสูงสุด"
  },
  "tier": {
    "general": "ทั่วไป",
    "silver": "เงิน",
    "diamond": "เพชร",
    "premium": "พรีเมียม",
    "god": "พระเจ้า"
  },
  "booking_status": {
    "pending": "รอยืนยัน",
    "confirmed": "ยืนยันแล้ว",
    "in_progress": "กำลังดำเนินการ",
    "completed": "เสร็จสิ้น",
    "cancelled": "ยกเลิกแล้ว"
  },
  "payment_status": {
    "pending": "รอชำระเงิน",
    "completed": "ชำระเงินแล้ว",
    "failed": "ชำระเงินล้มเหลว",
    "refunded": "คืนเงินแล้ว"
  },
  "verification_status": {
    "pending": "รอการตรวจสอบ",
    "approved": "อนุมัติแล้ว",
    "rejected": "ปฏิเสธ"
  },
  "account_type": {
    "savings": "ออมทรัพย์",
    "current": "กระแสรายวัน"
  },
  "categories": {
    "companion": "คู่หู",
    "massage": "นวด",
    "entertainment": "บันเทิง",
    "dinner_date": "ดินเนอร์",
    "tour_guide": "ไกด์ท่องเที่ยว",
    "model": "นางแบบ"
  },
  "browse": {
    "filters": {
      "location": "สถานที่",
      "all_locations": "ทุกสถานที่",
      "min_rating": "คะแนนขั้นต่ำ",
      "all_ratings": "ทุกระดับ",
      "tier": "ระดับ",
      "all_tiers": "ทุกระดับ",
      "sort_by": "เรียงตาม",
      "category": "หมวดหมู่",
      "all_categories": "ทุกหมวดหมู่",
      "clear_all": "ล้างตัวกรองทั้งหมด",
      "highest_rating": "คะแนนสูงสุด",
      "most_reviews": "รีวิวมากที่สุด",
      "nearest": "ใกล้ที่สุด",
      "hide_filters": "ซ่อนตัวกรอง",
      "show_filters": "แสดงตัวกรอง"
    },
    "results_count": "พบ {{count}} คน",
    "no_results": "ไม่พบผลลัพธ์",
    "no_results_subtitle": "ลองปรับตัวกรองหรือคำค้นหา",
    "view_profile": "ดูโปรไฟล์"
  },
  "financial": {
    "wallet": {
      "title": "กระเป๋าเงิน",
      "balance": "ยอดคงเหลือ",
      "available_balance": "ยอดพร้อมถอน",
      "pending_balance": "ยอดรอโอน",
      "total_earned": "รายได้ทั้งหมด",
      "total_withdrawn": "ถอนไปแล้ว"
    },
    "bank": {
      "title": "บัญชีธนาคาร",
      "bank_name": "ชื่อธนาคาร",
      "account_number": "เลขที่บัญชี",
      "account_name": "ชื่อบัญชี",
      "account_type": "ประเภทบัญชี",
      "add_account": "เพิ่มบัญชีธนาคาร",
      "set_default": "ตั้งเป็นบัญชีหลัก",
      "status_default": "บัญชีหลัก",
      "status_verified": "ยืนยันแล้ว",
      "status_pending": "รอยืนยัน"
    },
    "withdrawal": {
      "request": "ขอถอนเงิน",
      "amount": "จำนวนเงิน",
      "requested_amount": "จำนวนที่ขอ",
      "fee": "ค่าธรรมเนียม",
      "net_amount": "จำนวนเงินสุทธิ",
      "pending_count": "คำขอที่รอดำเนินการ: {{count}}",
      "status_completed": "เสร็จสิ้น",
      "status_approved": "อนุมัติแล้ว",
      "status_pending": "รอดำเนินการ",
      "status_rejected": "ปฏิเสธ"
    },
    "admin": {
      "queue_title": "คำขอถอนเงิน",
      "status_pending": "รอดำเนินการ",
      "status_approved": "อนุมัติแล้ว",
      "status_completed": "เสร็จสิ้น",
      "status_rejected": "ปฏิเสธ"
    }
  }
}
```

### ✅ Backend Provides Thai Data (No Translation Needed)

#### 1. Service Categories
```typescript
const { categories } = await apiCall<{categories: Category[]}>('/service-categories');

interface Category {
  category_id: number;
  name: string;           // English: "Massage"
  name_thai: string;      // Thai: "นวดแผนไทย" ⭐
  icon: string;           // "💆"
}

// Usage:
const { t, i18n } = useTranslation();
const categoryName = i18n.language === 'th' ? category.name_thai : category.name;
```

#### 2. Location Fields (Already Thai)
```typescript
// These fields are stored in Thai - display as-is:
interface Location {
  province: string;       // "กรุงเทพมหานคร"
  district: string;       // "บางรัก"
  sub_district: string;   // "สีลม"
  address_line1: string;  // "123 ถนนสีลม"
}
```

### ❌ Frontend Must Translate (Use i18n Keys)

#### 1. Provider Tier Names
```typescript
// Backend returns: "General", "Silver", "Diamond", "Premium", "GOD"
// Translation key: tier.{lowercase_name}

import { useTranslation } from 'react-i18next';

function TierBadge({ tierName }: { tierName: string }) {
  const { t } = useTranslation();
  const tierKey = tierName.toLowerCase(); // "general", "silver", etc.
  
  return (
    <span className="tier-badge">
      {t(`tier.${tierKey}`)}
    </span>
  );
}

// Output:
// Thai: "ทั่วไป", "เงิน", "เพชร", "พรีเมียม", "พระเจ้า"
// English: "General", "Silver", "Diamond", "Premium", "GOD"
// Chinese: "普通", "银", "钻石", "高级", "上帝"
```

#### 2. Booking Status
```typescript
// Backend returns: "pending", "confirmed", "in_progress", "completed", "cancelled"
// Translation key: booking_status.{status}

function BookingStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  
  return (
    <span className={`status-${status}`}>
      {t(`booking_status.${status}`)}
    </span>
  );
}

// Output (Thai): "รอยืนยัน", "ยืนยันแล้ว", "กำลังดำเนินการ", "เสร็จสิ้น", "ยกเลิกแล้ว"
```

#### 3. Payment Status
```typescript
// Backend returns: "pending", "completed", "failed", "refunded"
// Translation key: payment_status.{status}

const { t } = useTranslation();
const paymentLabel = t(`payment_status.${payment.status}`);

// Output (Thai): "รอชำระเงิน", "ชำระเงินแล้ว", "ชำระเงินล้มเหลว", "คืนเงินแล้ว"
```

#### 4. User Roles
```typescript
// Backend returns: "client", "provider", "admin", "god"
// Translation key: roles.{role}

const { t } = useTranslation();
const roleLabel = t(`roles.${user.role}`);

// Output (Thai): "ลูกค้า", "ผู้ให้บริการ", "ผู้ดูแลระบบ", "ผู้ดูแลระบบสูงสุด"
```

### 🎯 Usage in Components

#### Language Switcher
```tsx
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="language-switcher">
      <button
        onClick={() => i18n.changeLanguage('th')}
        className={i18n.language === 'th' ? 'active' : ''}
      >
        🇹🇭 ไทย
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => i18n.changeLanguage('zh')}
        className={i18n.language === 'zh' ? 'active' : ''}
      >
        🇨🇳 中文
      </button>
    </div>
  );
}
```

#### Provider Card Component
```tsx
import { useTranslation } from 'react-i18next';

interface Provider {
  user_id: number;
  username: string;
  profile_picture_url: string;
  category_name: string;
  category_name_thai: string;
  provider_level_name: string;
  rating_avg: number;
  review_count: number;
  province: string;
  district: string;
}

export function ProviderCard({ provider }: { provider: Provider }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="provider-card">
      <img src={provider.profile_picture_url} alt={provider.username} />
      
      {/* Category name (from backend - use name_thai for Thai) */}
      <p className="category">
        {i18n.language === 'th' ? provider.category_name_thai : provider.category_name}
      </p>
      
      {/* Provider tier (translate using key) */}
      <span className="tier">
        {t(`tier.${provider.provider_level_name.toLowerCase()}`)}
      </span>
      
      {/* Rating (numbers don't need translation) */}
      <div className="rating">
        ⭐ {provider.rating_avg.toFixed(1)} ({provider.review_count})
      </div>
      
      {/* Location (Thai from backend - no translation) */}
      <p className="location">{provider.province}, {provider.district}</p>
      
      {/* UI button */}
      <button>{t('browse.view_profile')}</button>
    </div>
  );
}
```

#### Browse Filters
```tsx
import { useTranslation } from 'react-i18next';

interface Filters {
  location: string;
  rating: string;
  tier: string;
  sort: string;
}

export function BrowseFilters({ 
  filters, 
  setFilters 
}: { 
  filters: Filters; 
  setFilters: (f: Filters) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="filters">
      {/* Location */}
      <label>{t('browse.filters.location')}</label>
      <input
        type="text"
        placeholder={t('browse.filters.all_locations')}
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />

      {/* Rating */}
      <label>{t('browse.filters.min_rating')}</label>
      <select
        value={filters.rating}
        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
      >
        <option value="">{t('browse.filters.all_ratings')}</option>
        <option value="3">3+ ⭐</option>
        <option value="4">4+ ⭐</option>
        <option value="4.5">4.5+ ⭐</option>
      </select>

      {/* Tier */}
      <label>{t('browse.filters.tier')}</label>
      <select
        value={filters.tier}
        onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
      >
        <option value="">{t('browse.filters.all_tiers')}</option>
        <option value="1">{t('tier.general')}</option>
        <option value="2">{t('tier.silver')}</option>
        <option value="3">{t('tier.diamond')}</option>
        <option value="4">{t('tier.premium')}</option>
      </select>

      {/* Sort */}
      <label>{t('browse.filters.sort_by')}</label>
      <select
        value={filters.sort}
        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
      >
        <option value="rating">{t('browse.filters.highest_rating')}</option>
        <option value="reviews">{t('browse.filters.most_reviews')}</option>
        <option value="distance">{t('browse.filters.nearest')}</option>
      </select>

      {/* Clear button */}
      <button onClick={() => setFilters({ location: '', rating: '', tier: '', sort: 'rating' })}>
        {t('browse.filters.clear_all')}
      </button>
    </div>
  );
}
```

#### Results with Translation
```tsx
function SearchResults({ providers, count }: { providers: Provider[]; count: number }) {
  const { t } = useTranslation();

  if (providers.length === 0) {
    return (
      <div className="no-results">
        <h3>{t('browse.no_results')}</h3>
        <p>{t('browse.no_results_subtitle')}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="results-count">
        {t('browse.results_count', { count })}
      </p>
      <div className="providers-grid">
        {providers.map(provider => (
          <ProviderCard key={provider.user_id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
```

### 📋 Translation Checklist

**✅ Already Thai (display as-is):**
- ☑ Category `name_thai` field
- ☑ Province, district, sub_district
- ☑ Address fields (user input)
- ☑ User bio, package names, review comments

**✅ Implemented in react-i18next:**
- ☑ Provider tier names → `t('tier.general')`, `t('tier.silver')`, etc.
- ☑ Booking status → `t('booking_status.pending')`, `t('booking_status.confirmed')`, etc.
- ☑ Payment status → `t('payment_status.completed')`, `t('payment_status.failed')`, etc.
- ☑ User roles → `t('roles.client')`, `t('roles.provider')`, etc.
- ☑ Account types → `t('account_type.savings')`, `t('account_type.current')`
- ☑ Verification status → `t('verification_status.approved')`, etc.
- ☑ UI labels → `t('common.save')`, `t('common.cancel')`, `t('common.delete')`, etc.
- ☑ Browse filters → `t('browse.filters.location')`, `t('browse.filters.tier')`, etc.
- ☑ Financial labels → `t('financial.wallet.balance')`, `t('financial.withdrawal.request')`, etc.

**Translation Key Pattern:**
- Use **lowercase** for dynamic values: `t('tier.${tierName.toLowerCase()}')`
- Use **exact case** for static keys: `t('common.save')`
- Use **interpolation** for counts: `t('browse.results_count', { count: 50 })`

### 🌏 Best Practices

1. **Language persistence**: react-i18next automatically stores preference in `localStorage`
2. **Language switcher**: Use `i18n.changeLanguage('th' | 'en' | 'zh')`
3. **Translation key naming**:
   - Lowercase for enums: `tier.general`, `booking_status.pending`
   - Nested structure: `financial.wallet.balance`, `browse.filters.location`
   - Dynamic interpolation: `t('browse.results_count', { count: providers.length })`
4. **Don't translate Thai data**: Location fields (province, district, address) from backend are already in Thai
5. **Category names**: Use `name_thai` vs `name` based on `i18n.language`
6. **Testing**: Test all 3 languages (Thai, English, Chinese) before deployment
7. **Default language**: Falls back to Thai (`fallbackLng: 'th'` in i18n config)
8. **Loading translations**: Translations loaded from `/public/locales/{lng}/translation.json`

---

## ⚠️ Breaking Changes (December 2025)

### 🔴 CRITICAL: Profile Picture Field Renamed

**What Changed:**
- ❌ Removed: `profile_image_url` (from user_profiles table)
- ❌ Removed: `google_profile_picture` (from users table)  
- ✅ New: `profile_picture_url` (unified field in users table)

**Migration Required:**

```typescript
// ❌ OLD CODE (WILL NOT WORK)
const ProfileCard = ({ user }: { user: User }) => {
  return <img src={user.profile_image_url} alt="Profile" />;
};

// ✅ NEW CODE (CORRECT)
const ProfileCard = ({ user }: { user: User }) => {
  return <img src={user.profile_picture_url || '/default-avatar.png'} alt="Profile" />;
};
```

**Affected Endpoints:**
- `GET /users/me`
- `GET /profile/me`
- `GET /provider/:userId`
- `GET /provider/:userId/public`
- `GET /browse/search` ⭐ (NEW)
- `GET /favorites`

---

## 🔐 Authentication & Authorization

### Public Endpoints (No Token Required)
```typescript
// Service categories
const { categories } = await apiCall<{categories: Category[]}>('/service-categories');

// Provider public profile (limited info - no age, height, service_type)
const provider = await apiCall<PublicProvider>('/provider/456/public');

// Provider photos
const photos = await apiCall<Photo[]>('/provider/456/photos');

// Provider packages
const { packages } = await apiCall<{packages: Package[]}>('/packages/456');

// Provider reviews
const { reviews } = await apiCall<{reviews: Review[]}>('/reviews/456');
```

### Protected Endpoints (Token Required)
```typescript
// Full provider profile (with sensitive data: age, height, service_type)
const provider = await apiCall<FullProvider>('/provider/456');

// Browse/Search (multi-filter)
const results = await apiCall<SearchResponse>('/browse/search?location=Bangkok');

// User profile
const profile = await apiCall<User>('/users/me');

// Favorites
await apiCall('/favorites', { 
  method: 'POST', 
  body: JSON.stringify({ provider_id: 456 }) 
});
```

### Authentication Flow

#### 1. Email/Password Login
```typescript
const loginData = await apiCall<{token: string; user: User}>('/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

localStorage.setItem('token', loginData.token);
// Token valid for 7 days
```

#### 2. Google OAuth
```typescript
async function handleGoogleSignIn(response: any) {
  const code = response.code;
  
  const data = await apiCall<{token: string; user: User}>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ code })
  });
  
  localStorage.setItem('token', data.token);
  
  // User profile includes profile_picture_url from Google
  const user = await apiCall<User>('/users/me');
  console.log(user.profile_picture_url); // Google profile picture URL
}
```

---

## 🔍 Browse & Search System

### Advanced Search Endpoint

```typescript
interface SearchFilters {
  location?: string;
  province?: string;
  district?: string;
  rating?: number;
  tier?: number;
  category?: number;
  service_type?: 'Incall' | 'Outcall' | 'Both';
  languages?: string; // Comma-separated: "th,en,zh"
  sort?: 'rating' | 'reviews' | 'price';
  page?: number;
  limit?: number;
}

interface SearchResponse {
  providers: Provider[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  filters_applied: Record<string, string>;
}

// Usage
async function searchProviders(filters: SearchFilters): Promise<SearchResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return await apiCall<SearchResponse>(`/browse/search?${params}`);
}

// Examples:
// 1. Basic search
const allProviders = await searchProviders({});

// 2. Location + rating
const bangkokTopRated = await searchProviders({ 
  location: 'Bangkok', 
  rating: 4.5,
  sort: 'rating'
});

// 3. Multi-filter with languages
const results = await searchProviders({
  location: 'Bangkok',
  rating: 4,
  tier: 3,
  category: 1,
  languages: 'th,en,zh',
  sort: 'reviews',
  page: 1,
  limit: 20
});
```

---

## 💰 Financial System (Provider Wallet)

### Wallet Dashboard
```typescript
interface Wallet {
  pending_balance: number;      // 7-day hold
  available_balance: number;    // Ready to withdraw
  total_earned: number;         // Lifetime earnings (87.25%)
  total_withdrawn: number;
}

const wallet = await apiCall<Wallet>('/wallet/balance');
```

### Withdrawal Request
```typescript
interface WithdrawalRequest {
  amount: number;
  bank_name: string;
  bank_account_number: string;
  account_holder_name: string;
}

await apiCall('/wallet/withdraw', {
  method: 'POST',
  body: JSON.stringify({
    amount: 5000.00,
    bank_name: 'Kasikorn Bank',
    bank_account_number: '1234567890',
    account_holder_name: 'Sarah Johnson'
  } as WithdrawalRequest)
});
```

### Withdrawal Component Example
```tsx
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { apiCall } from '@/services/api';

export function WithdrawalRequest() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiCall('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(amount),
          bank_name: bankName,
          bank_account_number: accountNumber,
          account_holder_name: accountName
        })
      });
      
      alert(t('common.success'));
    } catch (error) {
      alert(t('common.error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t('financial.withdrawal.request')}</h2>
      
      <label>{t('financial.withdrawal.amount')}</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      
      <label>{t('financial.bank.bank_name')}</label>
      <input
        type="text"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        required
      />
      
      <label>{t('financial.bank.account_number')}</label>
      <input
        type="text"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        required
      />
      
      <label>{t('financial.bank.account_name')}</label>
      <input
        type="text"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        required
      />
      
      <button type="submit">{t('common.save')}</button>
      <button type="button" onClick={() => history.back()}>
        {t('common.cancel')}
      </button>
    </form>
  );
}
```

---

## 📡 Complete API Reference

### Public Endpoints (No Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ping` | Health check |
| POST | `/register` | User registration |
| POST | `/register/provider` | Provider registration |
| POST | `/login` | Email/password login |
| POST | `/auth/google` | Google OAuth login |
| GET | `/service-categories` | Get all categories |
| GET | `/provider/:id/public` | Public profile (limited) |
| GET | `/provider/:id/photos` | Provider photos |
| GET | `/packages/:providerId` | Service packages |
| GET | `/reviews/:providerId` | Provider reviews |

### Protected Endpoints (Token Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Current user profile |
| GET | `/profile/me` | Current user full profile |
| PUT | `/profile/me` | Update profile |
| GET | `/provider/:id` | Full provider profile |
| **GET** | **`/browse/search`** | **⭐ Advanced multi-filter search** |
| GET | `/favorites` | My favorites |
| POST | `/favorites` | Add favorite |
| DELETE | `/favorites/:id` | Remove favorite |
| GET | `/bookings/my` | My bookings |
| POST | `/bookings/create-with-payment` | Create booking + Stripe |
| GET | `/conversations` | My conversations |
| POST | `/messages` | Send message |
| GET | `/wallet/balance` | Wallet balance |
| POST | `/wallet/withdraw` | Request withdrawal |
| GET | `/wallet/transactions` | Transaction history |

---

## 🧩 React Components Examples

### Complete Provider Profile Page
```tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiCall } from '@/services/api';

interface Provider {
  user_id: number;
  username: string;
  profile_picture_url: string;
  bio: string;
  provider_level_name: string;
  rating_avg: number;
  review_count: number;
  province: string;
  district: string;
  age?: number;
  height?: number;
  service_type?: string;
}

export function ProviderProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { t, i18n } = useTranslation();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Get profile (full if authenticated, public if not)
        const profileEndpoint = token
          ? `/provider/${userId}`
          : `/provider/${userId}/public`;
        const profileData = await apiCall<Provider>(profileEndpoint);
        setProvider(profileData);

        // Get photos (public)
        const photosData = await apiCall<Photo[]>(`/provider/${userId}/photos`);
        setPhotos(photosData);

        // Get packages (public)
        const { packages } = await apiCall<{packages: Package[]}>(`/packages/${userId}`);
        setPackages(packages);

        // Check if favorited (requires auth)
        if (token) {
          const { is_favorite } = await apiCall<{is_favorite: boolean}>(`/favorites/check/${userId}`);
          setIsFavorite(is_favorite);
        }
      } catch (error) {
        console.error('Failed to load provider:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await apiCall(`/favorites/${userId}`, { method: 'DELETE' });
        setIsFavorite(false);
      } else {
        await apiCall('/favorites', {
          method: 'POST',
          body: JSON.stringify({ provider_id: parseInt(userId!) })
        });
        setIsFavorite(true);
      }
    } catch (error) {
      alert(t('common.error'));
    }
  };

  if (loading) return <div>{t('common.loading')}</div>;
  if (!provider) return <div>{t('common.error')}</div>;

  return (
    <div className="provider-profile">
      {/* Header */}
      <div className="profile-header">
        <img
          src={provider.profile_picture_url || '/default-avatar.png'}
          alt={provider.username}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1>{provider.username}</h1>
          <span className="tier-badge">
            {t(`tier.${provider.provider_level_name.toLowerCase()}`)}
          </span>
          <div className="rating">
            ⭐ {provider.rating_avg.toFixed(1)} ({provider.review_count})
          </div>
          <button onClick={toggleFavorite}>
            {isFavorite ? '❤️' : '🤍'} {t('common.favorite')}
          </button>
        </div>
      </div>

      {/* Bio */}
      <div className="bio">
        <h2>{t('profile.about')}</h2>
        <p>{provider.bio}</p>
      </div>

      {/* Sensitive info (only if logged in) */}
      {provider.age && (
        <div className="detailed-info">
          <h3>{t('profile.details')}</h3>
          <p>{t('profile.age')}: {provider.age}</p>
          <p>{t('profile.height')}: {provider.height} cm</p>
          <p>{t('profile.service_type')}: {provider.service_type}</p>
        </div>
      )}

      {/* Photo Gallery */}
      <div className="photo-gallery">
        <h2>{t('profile.photos')} ({photos.length})</h2>
        <div className="photos-grid">
          {photos.map(photo => (
            <img
              key={photo.photo_id}
              src={`https://storage.googleapis.com/sex-worker-bucket/${photo.photo_url}`}
              alt={photo.caption}
            />
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="packages">
        <h2>{t('profile.packages')}</h2>
        {packages.map(pkg => (
          <div key={pkg.package_id} className="package-card">
            <h3>{pkg.name}</h3>
            <p>{pkg.description}</p>
            <p className="price">฿{pkg.price}</p>
            <button>{t('booking.book_now')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

**Documentation Version:** 2.1 (December 3, 2025)  
**Backend Server:** http://localhost:8080  
**Frontend:** React + TypeScript + react-i18next  
**Languages:** Thai (th), English (en), Chinese (zh)  
**Translation Keys:** 450+ keys across 3 languages  
**Status:** ✅ Production Ready

**Happy Coding! 🚀**
