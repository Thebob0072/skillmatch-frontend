# 👑 GOD Tier Security Policy

## Overview

GOD tier (tier_id = 5) เป็น Super Admin ที่มีสิทธิ์เต็มรูปแบบในระบบ และ**ไม่สามารถสร้างผ่าน UI หรือ API ได้**

---

## 🔒 Security Rules

### 1. ❌ ไม่มี API สำหรับสร้าง GOD accounts
```typescript
// ❌ NO ENDPOINT EXISTS FOR THIS
POST /god/create-account  // Does not exist
POST /admin/create-god    // Does not exist
POST /god/upgrade-to-god  // Does not exist
```

### 2. ✅ สร้าง GOD account ผ่านฐานข้อมูลเท่านั้น
```sql
-- ✅ ONLY WAY to create GOD account
INSERT INTO user_profiles (
  username, 
  email, 
  password_hash, 
  subscription_tier_id,
  is_admin,
  verification_status
) VALUES (
  'god_username',
  'god@skillmatch.com',
  '$2a$10$...', -- Hashed password
  5,             -- GOD tier
  true,          -- Admin flag
  'approved'
);
```

### 3. 🛡️ Backend Protections Required

Backend API ต้องมีการป้องกันเหล่านี้:

```javascript
// Example: POST /god/update-user
app.post('/god/update-user', authenticate, async (req, res) => {
  const { user_id, tier_id } = req.body;
  
  // ✅ PREVENT upgrading to GOD tier via API
  if (tier_id === 5) {
    return res.status(403).json({
      error: 'Cannot set GOD tier via API. Must be set in database directly.'
    });
  }
  
  // ✅ PREVENT downgrading existing GOD accounts
  const existingUser = await db.query('SELECT subscription_tier_id FROM user_profiles WHERE user_id = $1', [user_id]);
  if (existingUser.subscription_tier_id === 5) {
    return res.status(403).json({
      error: 'Cannot modify GOD tier accounts via API. Must be modified in database directly.'
    });
  }
  
  // Continue with normal update...
});
```

### 4. 🚫 CreateUserPage ไม่มี GOD option

```tsx
// ✅ CORRECT - GOD tier excluded from UI
<select>
  <option value="client">Client</option>
  <option value="provider">Companion</option>
  <option value="admin">Admin</option>
  {/* GOD tier excluded - database only */}
</select>

{role === 'admin' && (
  <select>
    <option value="1">General (Tier 1)</option>
    <option value="2">Silver (Tier 2)</option>
    <option value="3">Diamond (Tier 3)</option>
    <option value="4">Premium (Tier 4)</option>
    {/* Tier 5 (GOD) NOT available */}
  </select>
)}
```

---

## 📋 GOD Account Creation Checklist

เมื่อต้องการสร้าง GOD account ใหม่:

### Step 1: เข้าถึงฐานข้อมูล
```bash
# Connect to PostgreSQL
psql -U postgres -d skillmatch_db
```

### Step 2: Hash Password
```javascript
// Use bcrypt to hash password first
const bcrypt = require('bcrypt');
const password = 'super_secure_password_123!@#';
const hash = await bcrypt.hash(password, 10);
console.log(hash); // Copy this hash
```

### Step 3: Create GOD Account
```sql
-- Insert GOD account
INSERT INTO user_profiles (
  username, 
  email, 
  password_hash, 
  subscription_tier_id,
  is_admin,
  verification_status,
  gender_id,
  registration_date
) VALUES (
  'god_admin',                    -- Unique username
  'god@skillmatch.com',           -- Unique email
  '$2a$10$YOUR_HASHED_PASSWORD',  -- From Step 2
  5,                              -- GOD tier (CRITICAL)
  true,                           -- Admin flag
  'approved',                     -- Pre-approved
  1,                              -- Gender (1=Male, 2=Female, 3=Other)
  NOW()
);
```

### Step 4: Verify Creation
```sql
-- Check GOD account was created
SELECT 
  user_id,
  username,
  email,
  subscription_tier_id,
  is_admin,
  verification_status
FROM user_profiles
WHERE subscription_tier_id = 5;
```

### Step 5: Test Login
```bash
# Test login through API
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "god@skillmatch.com",
    "password": "super_secure_password_123!@#"
  }'
```

---

## 🔍 GOD Account Management

### View All GOD Accounts
```sql
SELECT 
  user_id,
  username,
  email,
  registration_date,
  last_login,
  is_active
FROM user_profiles
WHERE subscription_tier_id = 5
ORDER BY registration_date DESC;
```

### Disable GOD Account (Emergency)
```sql
-- In case of compromise, disable account
UPDATE user_profiles
SET is_active = false
WHERE user_id = <god_user_id> AND subscription_tier_id = 5;
```

### Change GOD Password
```sql
-- Update password (hash it first with bcrypt)
UPDATE user_profiles
SET password_hash = '$2a$10$NEW_HASHED_PASSWORD'
WHERE user_id = <god_user_id> AND subscription_tier_id = 5;
```

### Revoke GOD Status (Downgrade)
```sql
-- ⚠️ WARNING: This removes all GOD privileges
UPDATE user_profiles
SET 
  subscription_tier_id = 4,  -- Downgrade to Premium
  is_admin = true            -- Keep admin flag
WHERE user_id = <god_user_id> AND subscription_tier_id = 5;
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T: Try to create GOD via API
```typescript
// ❌ WRONG - This should fail
const response = await api.post('/admin/create-user', {
  username: 'new_god',
  tier_id: 5  // Should be rejected by backend
});
```

### ❌ DON'T: Expose GOD option in UI
```tsx
// ❌ WRONG - Exposes GOD tier to admins
<option value="5">GOD Tier</option>
```

### ❌ DON'T: Allow tier_id=5 in update endpoints
```typescript
// ❌ WRONG - Backend should reject this
updateUser({ user_id: 123, tier_id: 5 });
```

### ✅ DO: Use database only
```sql
-- ✅ CORRECT - Direct database access
INSERT INTO user_profiles (...) VALUES (..., 5, ...);
```

---

## 🛡️ Backend Validation Rules

Backend ต้องมีการตรวจสอบเหล่านี้:

```javascript
// Middleware: Prevent GOD tier operations via API
const preventGodTierModification = (req, res, next) => {
  const { tier_id, subscription_tier_id } = req.body;
  
  if (tier_id === 5 || subscription_tier_id === 5) {
    return res.status(403).json({
      error: 'GOD tier (5) cannot be modified via API',
      message: 'Contact system administrator for GOD tier changes'
    });
  }
  
  next();
};

// Apply to all user modification endpoints
app.post('/god/update-user', authenticate, preventGodTierModification, updateUserHandler);
app.post('/admin/create-user', authenticate, preventGodTierModification, createUserHandler);
app.put('/admin/users/:id', authenticate, preventGodTierModification, updateUserHandler);
```

---

## 📊 Audit Log for GOD Actions

Track all GOD tier activities:

```sql
-- Create audit log table
CREATE TABLE god_audit_log (
  log_id SERIAL PRIMARY KEY,
  god_user_id INT NOT NULL REFERENCES user_profiles(user_id),
  action VARCHAR(100) NOT NULL,
  target_user_id INT REFERENCES user_profiles(user_id),
  details JSONB,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Log GOD actions
INSERT INTO god_audit_log (god_user_id, action, target_user_id, details)
VALUES (1, 'UPDATE_USER_TIER', 123, '{"old_tier": 2, "new_tier": 4}'::jsonb);
```

---

## 🚨 Emergency Procedures

### Scenario 1: GOD Account Compromised
```sql
-- 1. Immediately disable the account
UPDATE user_profiles SET is_active = false WHERE user_id = <compromised_god_id>;

-- 2. Create new GOD account
INSERT INTO user_profiles (...) VALUES (...);

-- 3. Audit all recent actions
SELECT * FROM god_audit_log 
WHERE god_user_id = <compromised_god_id> 
  AND timestamp > NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC;
```

### Scenario 2: Lost GOD Account Access
```sql
-- Reset password directly in database
UPDATE user_profiles
SET password_hash = '$2a$10$NEW_EMERGENCY_PASSWORD_HASH'
WHERE subscription_tier_id = 5 AND email = 'god@skillmatch.com';
```

---

## 📝 Development vs Production

### Development Environment
```sql
-- Dev: Can have multiple GOD accounts for testing
INSERT INTO user_profiles (...) VALUES ('dev_god_1', ..., 5, ...);
INSERT INTO user_profiles (...) VALUES ('dev_god_2', ..., 5, ...);
```

### Production Environment
```sql
-- Production: Should have ONLY 1-2 GOD accounts
SELECT COUNT(*) FROM user_profiles WHERE subscription_tier_id = 5;
-- Expected: 1 or 2 maximum
```

---

## ✅ Summary

| Action | Method | Allowed? |
|--------|--------|----------|
| Create GOD account | Direct SQL | ✅ Yes |
| Create GOD account | API endpoint | ❌ No |
| Create GOD account | UI (CreateUserPage) | ❌ No |
| Update to GOD tier | Direct SQL | ✅ Yes |
| Update to GOD tier | API endpoint | ❌ No |
| Update to GOD tier | UI dropdown | ❌ No |
| Downgrade from GOD | Direct SQL | ✅ Yes |
| Downgrade from GOD | API endpoint | ❌ No |
| Delete GOD account | Direct SQL | ✅ Yes |
| Delete GOD account | API endpoint | ❌ No (should reject) |

---

**Security Principle:** GOD tier is the highest privilege level and must be managed exclusively through direct database access to prevent unauthorized elevation of privileges.

**Contact:** For GOD account creation/modification, contact system administrator with database access.
