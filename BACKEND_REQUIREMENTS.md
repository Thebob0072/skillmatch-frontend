# 🚨 Backend Requirements - สิ่งที่ Backend ต้องแก้ไขด่วน

> **วันที่**: 2 ธันวาคม 2025  
> **สถานะ Frontend**: ✅ พร้อมรับข้อมูลแล้ว  
> **รอ Backend**: แก้ไข Google OAuth และ Profile endpoints

---

## 📋 สารบัญ
1. [ปัญหาหลัก (Critical)](#-ปัญหาหลัก-critical-issues)
2. [ปัญหารอง (Secondary)](#-ปัญหารอง-secondary-issues)
3. [Checklist](#-checklist-สำหรับ-backend-team)
4. [Testing Guide](#-testing-guide)
5. [Code Examples](#-code-examples)

---

## 🔴 ปัญหาหลัก (Critical Issues)

### 1. ❌ Google OAuth ไม่บันทึก Profile Picture

**ปัญหา**:
- Frontend login ผ่าน Google OAuth สำเร็จ ✅
- Backend ส่ง JWT token กลับมา (200 OK) ✅
- แต่ไม่มี `profile_picture_url` ใน database ❌
- GET /profile/me ไม่ return รูปภาพ ❌
- Navbar แสดงแค่ตัวอักษรแรกแทนรูป

**Root Cause**:
Backend ไม่ได้ดึง `picture` field จาก Google User Info API และไม่ได้บันทึกลง database

**วิธีแก้ (Step-by-Step)**:

#### Step 1: ตรวจสอบ Database Schema
```bash
# เช็คว่ามี column หรือยัง
docker exec -i postgres_db psql -U admin -d skillmatch_db -c "
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_picture_url';
"
```

**Expected Output**:
```
     column_name      | data_type | character_maximum_length 
---------------------+-----------+--------------------------
 profile_picture_url | text      |
```

**ถ้าไม่มี column ให้เพิ่ม**:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
```

#### Step 2: แก้ไข Google OAuth Handler

**ไฟล์**: `auth_handlers.go`

**ที่ต้องแก้**:

```go
// ใน handler ของ POST /auth/google
func GoogleOAuthHandler(c *gin.Context) {
    var req struct {
        Code string `json:"code"`
    }
    c.BindJSON(&req)
    
    // 1. แลก code เป็น access token
    token, err := googleOAuthConfig.Exchange(ctx, req.Code)
    if err != nil {
        c.JSON(400, gin.H{"error": "Invalid authorization code"})
        return
    }
    
    // 2. ดึงข้อมูล user จาก Google
    client := googleOAuthConfig.Client(ctx, token)
    resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to get user info"})
        return
    }
    defer resp.Body.Close()
    
    var googleUser struct {
        ID            string `json:"id"`
        Email         string `json:"email"`
        VerifiedEmail bool   `json:"verified_email"`
        Name          string `json:"name"`
        GivenName     string `json:"given_name"`
        FamilyName    string `json:"family_name"`
        Picture       string `json:"picture"` // ⬅️ ตรงนี้สำคัญ!
    }
    json.NewDecoder(resp.Body).Decode(&googleUser)
    
    // 3. ตรวจสอบว่า user มีในระบบหรือยัง
    var user User
    result := db.Where("email = ?", googleUser.Email).First(&user)
    
    if result.Error == gorm.ErrRecordNotFound {
        // สร้าง user ใหม่
        user = User{
            Email:             googleUser.Email,
            Username:          googleUser.Name,
            ProfilePictureURL: &googleUser.Picture, // ⬅️ บันทึกรูปภาพ
            IsEmailVerified:   true,
            // ... fields อื่นๆ
        }
        db.Create(&user)
    } else {
        // อัพเดทรูปภาพถ้า user มีอยู่แล้ว
        if googleUser.Picture != "" {
            user.ProfilePictureURL = &googleUser.Picture
            db.Save(&user)
        }
    }
    
    // 4. สร้าง JWT token
    jwtToken := createJWTToken(user.UserID)
    
    // 5. ส่ง token กลับ (ไม่ต้องส่ง user object ที่นี่)
    c.JSON(200, gin.H{
        "message": "Login successful",
        "token":   jwtToken,
    })
}
```

**Database Schema Check**:
```sql
-- ตรวจสอบว่า column นี้มีหรือยัง
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_picture_url';

-- ถ้าไม่มี ให้เพิ่ม
ALTER TABLE users ADD COLUMN profile_picture_url TEXT;
```

---

### 2. ✅ GET /profile/me - ต้อง Return Profile Picture

**สถานะ**: Frontend เรียกใช้งานแล้ว ✅

**ตรวจสอบว่า Response มี `profile_picture_url`**:

```go
// GET /profile/me
func GetCurrentUserProfile(c *gin.Context) {
    userID := c.GetInt("user_id") // จาก JWT middleware
    
    var user User
    if err := db.Preload("Tier").First(&user, userID).Error; err != nil {
        c.JSON(404, gin.H{"error": "User not found"})
        return
    }
    
    c.JSON(200, gin.H{
        "user_id":              user.UserID,
        "username":             user.Username,
        "email":                user.Email,
        "tier_id":              user.TierID,
        "tier_name":            user.Tier.Name,
        "is_admin":             user.IsAdmin,
        "profile_picture_url":  user.ProfilePictureURL, // ⬅️ ต้องมี!
        "bio":                  user.Bio,
        "phone":                user.Phone,
        "verification_status":  user.VerificationStatus,
    })
}
```

**Expected Response**:
```json
{
  "user_id": 1,
  "username": "The BOB Film",
  "email": "audikoratair@gmail.com",
  "tier_id": 5,
  "tier_name": "GOD",
  "is_admin": true,
  "profile_picture_url": "https://lh3.googleusercontent.com/a/ACg8ocK...",
  "bio": null,
  "phone": null,
  "verification_status": "unverified"
}
```

---

## ⚠️ ปัญหารอง (Secondary Issues)

### 3. Browse Filters - ต้องรองรับ Query Parameters ทั้งหมด

**Endpoint**: `GET /browse/search`

**Query Parameters ที่ Frontend ส่ง**:
```
?location=Bangkok
&rating=4
&tier=3
&category=1
&sort=rating
&page=1
&limit=20
```

**Backend ต้องรองรับ**:
```go
func BrowseProviders(c *gin.Context) {
    // Filters
    location := c.Query("location")       // Province name
    rating := c.Query("rating")           // Minimum rating (3, 4, 4.5)
    tier := c.Query("tier")               // Tier ID (1-5)
    category := c.Query("category")       // Category ID
    sortBy := c.DefaultQuery("sort", "rating") // rating, reviews, distance
    
    // Pagination
    page := c.DefaultQuery("page", "1")
    limit := c.DefaultQuery("limit", "20")
    
    query := db.Model(&User{}).
        Where("role = ?", "provider").
        Where("verification_status = ?", "approved")
    
    // Apply filters
    if location != "" {
        query = query.Where("province = ?", location)
    }
    if rating != "" {
        minRating, _ := strconv.ParseFloat(rating, 64)
        query = query.Where("rating_avg >= ?", minRating)
    }
    if tier != "" {
        tierID, _ := strconv.Atoi(tier)
        query = query.Where("tier_id = ?", tierID)
    }
    if category != "" {
        // Join with provider_categories table
        query = query.Joins("JOIN provider_categories ON users.user_id = provider_categories.user_id").
                     Where("provider_categories.category_id = ?", category)
    }
    
    // Sorting
    switch sortBy {
    case "reviews":
        query = query.Order("review_count DESC")
    case "distance":
        // TODO: Implement geolocation sorting
        query = query.Order("created_at DESC")
    default: // rating
        query = query.Order("rating_avg DESC, review_count DESC")
    }
    
    // Execute query with pagination
    var providers []User
    var total int64
    
    query.Count(&total)
    query.Offset((page - 1) * limit).Limit(limit).Find(&providers)
    
    c.JSON(200, gin.H{
        "providers": providers,
        "pagination": gin.H{
            "page":  page,
            "limit": limit,
            "total": total,
        },
    })
}
```

---

### 4. Categories - ต้องมี Thai Names

**Endpoint**: `GET /service-categories`

**Expected Response**:
```json
{
  "categories": [
    {
      "category_id": 1,
      "name": "Massage",
      "name_thai": "นวด",
      "icon": "💆",
      "description": "Professional massage services"
    },
    {
      "category_id": 2,
      "name": "Spa",
      "name_thai": "สปา",
      "icon": "🧖",
      "description": "Relaxation spa services"
    }
  ]
}
```

**Database Migration**:
```sql
ALTER TABLE service_categories ADD COLUMN name_thai VARCHAR(100);
ALTER TABLE service_categories ADD COLUMN icon VARCHAR(10);

UPDATE service_categories SET name_thai = 'นวด', icon = '💆' WHERE category_id = 1;
UPDATE service_categories SET name_thai = 'สปา', icon = '🧖' WHERE category_id = 2;
UPDATE service_categories SET name_thai = 'ความงาม', icon = '💄' WHERE category_id = 3;
UPDATE service_categories SET name_thai = 'สุขภาพ', icon = '🧘' WHERE category_id = 4;
UPDATE service_categories SET name_thai = 'บำบัด', icon = '🩺' WHERE category_id = 5;
```

---

## 📝 Checklist สำหรับ Backend Team

### 🔴 Priority 1 (ทำก่อน - มีผลต่อ UX)

- [ ] **Google OAuth บันทึก profile_picture_url**
  - [ ] แก้ไข POST /auth/google handler
  - [ ] ดึง picture field จาก Google User Info API
  - [ ] บันทึกลง users.profile_picture_url
  - [ ] Test กับ Google login จริง
  - [ ] Verify ว่า GET /profile/me return รูปภาพ

- [ ] **GET /profile/me Return Complete User Object**
  - [ ] ตรวจสอบว่า profile_picture_url อยู่ใน response
  - [ ] Test กับ GOD account (user_id=1)

### 🟡 Priority 2 (สำคัญ - รองรับฟีเจอร์หลัก)

- [ ] **Browse Search Filters**
  - [ ] GET /browse/search รองรับ location filter
  - [ ] รองรับ rating filter (3+, 4+, 4.5+)
  - [ ] รองรับ tier filter (1-5)
  - [ ] รองรับ category filter
  - [ ] รองรับ sort (rating, reviews, distance)
  - [ ] Test ด้วย query parameters ต่างๆ

- [ ] **Service Categories Thai Names**
  - [ ] เพิ่ม name_thai column
  - [ ] เพิ่ม icon column
  - [ ] อัพเดทข้อมูล 5 categories
  - [ ] GET /service-categories return ทั้ง name และ name_thai

### 🟢 Priority 3 (Nice to have - ปรับปรุง)

- [ ] **Provider Photos Endpoint**
  - [ ] GET /provider/:userId/photos
  - [ ] รองรับ sort_order
  - [ ] Return caption และ uploaded_at

- [ ] **Favorites Check Endpoint**
  - [ ] GET /favorites/check/:providerId
  - [ ] Return true/false แม้ไม่มี token (return false)

- [ ] **Notifications Unread Count**
  - [ ] GET /notifications/unread/count
  - [ ] Return { "unread_count": 5 }

---

## 🧪 Testing Guide

### Test Google OAuth Profile Picture

```bash
# 1. Login ด้วย Google ผ่าน Frontend
# 2. เช็ค database
psql -U postgres -d skillmatch
SELECT user_id, email, username, profile_picture_url FROM users WHERE email = 'audikoratair@gmail.com';

# Expected: profile_picture_url ต้องไม่เป็น NULL และเป็น URL จาก lh3.googleusercontent.com

# 3. Test API endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/profile/me

# Expected Response:
{
  "user_id": 1,
  "email": "audikoratair@gmail.com",
  "profile_picture_url": "https://lh3.googleusercontent.com/a/ACg8ocK..."
}
```

### Test Browse Filters

```bash
# Test location filter
curl "http://localhost:8080/browse/search?location=Bangkok&page=1&limit=20"

# Test rating filter
curl "http://localhost:8080/browse/search?rating=4&page=1&limit=20"

# Test tier filter
curl "http://localhost:8080/browse/search?tier=3&page=1&limit=20"

# Test category filter
curl "http://localhost:8080/browse/search?category=1&page=1&limit=20"

# Test combined filters
curl "http://localhost:8080/browse/search?location=Bangkok&rating=4&tier=3&category=1&sort=rating"
```

### Test Categories with Thai Names

```bash
curl http://localhost:8080/service-categories

# Expected:
{
  "categories": [
    {
      "category_id": 1,
      "name": "Massage",
      "name_thai": "นวด",
      "icon": "💆"
    }
  ]
}
```

---

## 💡 Code Examples

### Complete Google OAuth Handler

```go
package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "time"
    
    "github.com/gin-gonic/gin"
    "golang.org/x/oauth2"
    "golang.org/x/oauth2/google"
    "gorm.io/gorm"
)

var googleOAuthConfig = &oauth2.Config{
    ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
    ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
    RedirectURL:  "postmessage", // For authorization code flow
    Scopes: []string{
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    },
    Endpoint: google.Endpoint,
}

type GoogleUserInfo struct {
    ID            string `json:"id"`
    Email         string `json:"email"`
    VerifiedEmail bool   `json:"verified_email"`
    Name          string `json:"name"`
    GivenName     string `json:"given_name"`
    FamilyName    string `json:"family_name"`
    Picture       string `json:"picture"`
    Locale        string `json:"locale"`
}

func GoogleOAuthHandler(c *gin.Context) {
    var req struct {
        Code string `json:"code" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Code is required"})
        return
    }
    
    // 1. Exchange authorization code for token
    ctx := context.Background()
    token, err := googleOAuthConfig.Exchange(ctx, req.Code)
    if err != nil {
        c.JSON(400, gin.H{"error": "Invalid authorization code"})
        return
    }
    
    // 2. Get user info from Google
    client := googleOAuthConfig.Client(ctx, token)
    resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to get user info from Google"})
        return
    }
    defer resp.Body.Close()
    
    var googleUser GoogleUserInfo
    if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
        c.JSON(500, gin.H{"error": "Failed to parse user info"})
        return
    }
    
    // 3. Find or create user
    var user User
    result := db.Where("email = ?", googleUser.Email).First(&user)
    
    if result.Error == gorm.ErrRecordNotFound {
        // Create new user
        user = User{
            Email:             googleUser.Email,
            Username:          googleUser.Name,
            FirstName:         googleUser.GivenName,
            LastName:          googleUser.FamilyName,
            ProfilePictureURL: &googleUser.Picture,
            IsEmailVerified:   googleUser.VerifiedEmail,
            TierID:            1, // Default to General tier
            Role:              "client",
            CreatedAt:         time.Now(),
            UpdatedAt:         time.Now(),
        }
        
        if err := db.Create(&user).Error; err != nil {
            c.JSON(500, gin.H{"error": "Failed to create user"})
            return
        }
    } else if result.Error != nil {
        c.JSON(500, gin.H{"error": "Database error"})
        return
    } else {
        // Update existing user's profile picture
        if googleUser.Picture != "" {
            user.ProfilePictureURL = &googleUser.Picture
            user.UpdatedAt = time.Now()
            db.Save(&user)
        }
    }
    
    // 4. Generate JWT token
    jwtToken, err := GenerateJWT(user.UserID, 7*24*time.Hour)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to generate token"})
        return
    }
    
    // 5. Return token only (frontend will call GET /profile/me)
    c.JSON(200, gin.H{
        "message": "Login successful",
        "token":   jwtToken,
    })
}
```

---

## 📊 Expected Data Flow

### Google OAuth Login Flow

```
1. Frontend: User clicks "Sign in with Google"
2. Google: Returns authorization code to frontend
3. Frontend: POST /auth/google { code: "..." }
4. Backend: 
   - Exchange code for access token
   - Call Google User Info API
   - Get user data including picture URL
   - Create/update user with profile_picture_url
   - Generate JWT token
   - Return { token: "..." }
5. Frontend: 
   - Save token to localStorage
   - Call GET /profile/me with token
   - Get complete user object with profile_picture_url
   - Display profile picture in Navbar
```

### Browse Flow

```
1. Frontend: User selects filters (location, rating, tier, category)
2. Frontend: GET /browse/search?location=Bangkok&rating=4&tier=3&category=1
3. Backend: 
   - Parse all query parameters
   - Build SQL query with WHERE clauses
   - Apply sorting (rating/reviews/distance)
   - Return paginated results
4. Frontend: Display provider cards with filters applied
```

---

## 🚀 Summary

### Frontend Status (✅ พร้อมแล้ว):
- Google OAuth integration ใช้งานได้
- Profile picture UI พร้อมแสดง
- Browse filters UI สมบูรณ์
- API service layers พร้อมเรียก endpoints

### Backend TODO (⏳ รอแก้ไข):
1. **Google OAuth** - บันทึก profile_picture_url จาก Google
2. **GET /profile/me** - Return profile_picture_url ใน response
3. **Browse filters** - รองรับ query parameters ทั้งหมด
4. **Categories** - เพิ่ม Thai names และ icons

### ⏱️ Estimated Time:
- Google OAuth fix: **30 นาที**
- Profile endpoint: **15 นาที** (ถ้ามี column แล้ว)
- Browse filters: **1-2 ชั่วโมง**
- Categories Thai: **30 นาที**

**Total: ~3 ชั่วโมง** สำหรับทุกอย่าง

---

## 📞 หากมีปัญหา

ให้ Backend test ด้วย:
```bash
# Test Google OAuth
curl -X POST http://localhost:8080/auth/google \
  -H "Content-Type: application/json" \
  -d '{"code":"test_code_from_google"}'

# Check user in database
SELECT * FROM users WHERE email = 'test@gmail.com';

# Test profile endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/profile/me
```

Frontend พร้อมรับข้อมูลแล้ว! แค่รอ Backend แก้ไข 🚀
