
# 06-API-Documentation.md
api_doc = """# Loopin
## API Documentation
### Version 1.0

---

# 1. Genel Bilgiler

## 1.1 Base URL
```
Development:  http://localhost:3000/api/v1
Staging:      https://api-staging.loopin.app/api/v1
Production:   https://api.loopin.app/api/v1
```

## 1.2 Authentication
Tüm API istekleri (public endpoint'ler hariç) `Authorization` header'ı ile JWT token gerektirir.

```http
Authorization: Bearer <access_token>
```

## 1.3 Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-07-20T12:00:00Z"
}
```

## 1.4 Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "timestamp": "2026-07-20T12:00:00Z"
}
```

## 1.5 HTTP Status Codes
| Code | Açıklama |
|------|----------|
| 200 | OK - Başarılı GET/PUT/PATCH |
| 201 | Created - Başarılı POST |
| 204 | No Content - Başarılı DELETE |
| 400 | Bad Request - Validasyon hatası |
| 401 | Unauthorized - Token geçersiz veya eksik |
| 403 | Forbidden - Yetkisiz erişim |
| 404 | Not Found - Kaynak bulunamadı |
| 409 | Conflict - Çakışma (duplicate, vb.) |
| 429 | Too Many Requests - Rate limit |
| 500 | Internal Server Error |

## 1.6 Pagination
```
GET /api/v1/events?page=1&limit=20&sort=createdAt&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 1.7 Rate Limiting
| Endpoint Grubu | Limit |
|----------------|-------|
| Auth | 10 req/min |
| Genel API | 100 req/min |
| Messaging | 60 req/min |
| Search | 30 req/min |

---

# 2. Auth Endpoints

## 2.1 Register
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request:**
```json
{
  "phone": "+905551234567",
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "message": "OTP sent to your phone"
  }
}
```

**Validation:**
- `phone`: Required, format `+90XXXXXXXXXX`, unique
- `email`: Optional, valid email format, unique
- `password`: Required, min 8 chars, 1 uppercase, 1 lowercase, 1 digit

---

## 2.2 Login
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request:**
```json
{
  "phoneOrEmail": "+905551234567",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "+905551234567",
      "email": "user@example.com",
      "role": "user",
      "isVerified": true,
      "isPremium": false,
      "profile": {
        "fullName": "Ahmet Yılmaz",
        "avatarUrl": "https://..."
      }
    }
  }
}
```

---

## 2.3 Verify OTP
```http
POST /api/v1/auth/verify-otp
Content-Type: application/json
```

**Request:**
```json
{
  "phone": "+905551234567",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

---

## 2.4 Resend OTP
```http
POST /api/v1/auth/resend-otp
Content-Type: application/json
```

**Request:**
```json
{
  "phone": "+905551234567"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "OTP resent successfully",
    "resendAfter": 60
  }
}
```

---

## 2.5 Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

---

## 2.6 Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 2.7 Forgot Password
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json
```

**Request:**
```json
{
  "phoneOrEmail": "+905551234567"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset OTP sent"
  }
}
```

---

## 2.8 Reset Password
```http
POST /api/v1/auth/reset-password
Content-Type: application/json
```

**Request:**
```json
{
  "phoneOrEmail": "+905551234567",
  "otp": "123456",
  "newPassword": "NewPass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

# 3. User Endpoints

## 3.1 Get Current User
```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "+905551234567",
    "email": "user@example.com",
    "role": "user",
    "isVerified": true,
    "isPremium": false,
    "status": "active",
    "createdAt": "2026-01-15T10:00:00Z",
    "profile": {
      "fullName": "Ahmet Yılmaz",
      "birthDate": "1996-07-20",
      "age": 29,
      "city": "İstanbul",
      "district": "Kadıköy",
      "bio": "Yeni şehirler keşfetmeyi seven biriyim.",
      "avatarUrl": "https://cdn.loopin.app/avatars/...",
      "goal": "friendship",
      "occupation": "Yazılım Mühendisi",
      "education": "Lisans",
      "gender": "male"
    },
    "interests": [
      { "id": 1, "name": "Yemek", "category": "social" },
      { "id": 5, "name": "Seyahat", "category": "travel" }
    ],
    "stats": {
      "eventsJoined": 32,
      "eventsCreated": 18,
      "connections": 45,
      "averageRating": 4.8,
      "totalRatings": 32
    }
  }
}
```

---

## 3.2 Get User by ID (Public)
```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "profile": {
      "fullName": "Zeynep Kaya",
      "age": 26,
      "city": "İstanbul",
      "avatarUrl": "https://cdn.loopin.app/avatars/...",
      "goal": "friendship",
      "occupation": "Pazarlama Uzmanı",
      "education": "Yüksek Lisans",
      "gender": "female"
    },
    "interests": [
      { "id": 2, "name": "Kahve", "category": "social" },
      { "id": 3, "name": "Spor", "category": "active" }
    ],
    "stats": {
      "eventsJoined": 15,
      "eventsCreated": 8,
      "averageRating": 4.5,
      "totalRatings": 12
    },
    "isVerified": true,
    "isPremium": false
  }
}
```

---

## 3.3 Update Profile
```http
PATCH /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "fullName": "Ahmet Yılmaz",
  "birthDate": "1996-07-20",
  "city": "İstanbul",
  "district": "Kadıköy",
  "bio": "Yeni şehirler keşfetmeyi seven biriyim.",
  "goal": "friendship",
  "occupation": "Yazılım Mühendisi",
  "education": "Lisans",
  "gender": "male"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully",
    "profile": { ... }
  }
}
```

---

## 3.4 Upload Avatar
```http
POST /api/v1/users/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```
file: <binary>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.loopin.app/avatars/..."
  }
}
```

---

## 3.5 Update Interests
```http
POST /api/v1/users/interests
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "interestIds": [1, 5, 12, 18]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "interests": [
      { "id": 1, "name": "Yemek", "category": "social" },
      { "id": 5, "name": "Seyahat", "category": "travel" },
      { "id": 12, "name": "Müzik", "category": "hobby" },
      { "id": 18, "name": "Sanat", "category": "hobby" }
    ]
  }
}
```

---

## 3.6 Get Interests (Master Data)
```http
GET /api/v1/interests
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "interests": [
      {
        "id": 1,
        "name": "Yemek",
        "category": "social",
        "icon": "restaurant",
        "color": "#FF6B6B"
      },
      {
        "id": 2,
        "name": "Kahve",
        "category": "social",
        "icon": "coffee",
        "color": "#8B4513"
      }
    ]
  }
}
```

---

## 3.7 Block User
```http
POST /api/v1/users/block
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "blockedId": "550e8400-e29b-41d4-a716-446655440001",
  "reason": "Uygunsuz davranış"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "User blocked successfully"
  }
}
```

---

## 3.8 Unblock User
```http
DELETE /api/v1/users/block/:blockedId
Authorization: Bearer <token>
```

**Response (204):**
```
(No content)
```

---

## 3.9 Get Blocked Users
```http
GET /api/v1/users/blocked
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "blockedUsers": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "profile": {
          "fullName": "Mehmet Demir",
          "avatarUrl": "https://..."
        },
        "reason": "Uygunsuz davranış",
        "createdAt": "2026-07-15T10:00:00Z"
      }
    ]
  }
}
```

---

## 3.10 Change Password
```http
POST /api/v1/users/change-password
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

---

# 4. Event Endpoints

## 4.1 List Events
```http
GET /api/v1/events?page=1&limit=20&city=Istanbul&category=yemek&dateFrom=2026-07-20&dateTo=2026-07-27&lat=41.0082&lng=28.9784&radius=10&goal=friendship&minAge=22&maxAge=35&verifiedOnly=false&sort=date&order=asc
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "title": "Akşam Yemeği @ Kadıköy",
        "description": "Kadıköy'de güzel bir akşam yemeği...",
        "category": {
          "id": 1,
          "name": "Yemek",
          "icon": "restaurant",
          "color": "#FF6B6B"
        },
        "date": "2026-07-20",
        "time": "20:00:00",
        "location": "Kadıköy, Moda Caddesi No:15",
        "latitude": 40.9822,
        "longitude": 29.0244,
        "maxParticipants": 4,
        "approvedCount": 2,
        "spotsLeft": 2,
        "minAge": 22,
        "maxAge": 35,
        "genderPreference": "any",
        "goal": "friendship",
        "paymentType": "split",
        "status": "active",
        "distance": 2.5,
        "creator": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "profile": {
            "fullName": "Ahmet Yılmaz",
            "avatarUrl": "https://...",
            "age": 29
          },
          "isVerified": true,
          "averageRating": 4.8
        },
        "images": [
          "https://cdn.loopin.app/events/..."
        ],
        "createdAt": "2026-07-19T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 4.2 Get Event Detail
```http
GET /api/v1/events/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "title": "Akşam Yemeği @ Kadıköy",
    "description": "Kadıköy'de güzel bir akşam yemeği için bir araya geliyoruz.",
    "category": {
      "id": 1,
      "name": "Yemek",
      "icon": "restaurant",
      "color": "#FF6B6B"
    },
    "date": "2026-07-20",
    "time": "20:00:00",
    "location": "Kadıköy, Moda Caddesi No:15",
    "latitude": 40.9822,
    "longitude": 29.0244,
    "maxParticipants": 4,
    "minAge": 22,
    "maxAge": 35,
    "genderPreference": "any",
    "goal": "friendship",
    "paymentType": "split",
    "status": "active",
    "creator": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "profile": {
        "fullName": "Ahmet Yılmaz",
        "avatarUrl": "https://...",
        "age": 29,
        "city": "İstanbul",
        "goal": "friendship",
        "occupation": "Yazılım Mühendisi",
        "education": "Lisans"
      },
      "isVerified": true,
      "isPremium": false,
      "stats": {
        "eventsJoined": 32,
        "eventsCreated": 18,
        "averageRating": 4.8,
        "totalRatings": 32
      }
    },
    "participants": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "profile": {
          "fullName": "Zeynep Kaya",
          "avatarUrl": "https://..."
        }
      }
    ],
    "images": [
      "https://cdn.loopin.app/events/..."
    ],
    "myApplication": {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "status": "pending",
      "message": "Merhaba, katılmak istiyorum!",
      "createdAt": "2026-07-19T15:00:00Z"
    },
    "createdAt": "2026-07-19T10:00:00Z",
    "updatedAt": "2026-07-19T10:00:00Z"
  }
}
```

---

## 4.3 Create Event
```http
POST /api/v1/events
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Akşam Yemeği @ Kadıköy",
  "description": "Kadıköy'de güzel bir akşam yemeği için bir araya geliyoruz.",
  "categoryId": 1,
  "date": "2026-07-20",
  "time": "20:00:00",
  "location": "Kadıköy, Moda Caddesi No:15",
  "latitude": 40.9822,
  "longitude": 29.0244,
  "maxParticipants": 4,
  "minAge": 22,
  "maxAge": 35,
  "genderPreference": "any",
  "goal": "friendship",
  "paymentType": "split",
  "images": [
    "https://cdn.loopin.app/events/..."
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "title": "Akşam Yemeği @ Kadıköy",
    "status": "active",
    "createdAt": "2026-07-19T10:00:00Z"
  }
}
```

---

## 4.4 Update Event
```http
PATCH /api/v1/events/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Akşam Yemeği @ Moda",
  "description": "Güncellenmiş açıklama...",
  "maxParticipants": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "message": "Event updated successfully"
  }
}
```

---

## 4.5 Delete Event
```http
DELETE /api/v1/events/:id
Authorization: Bearer <token>
```

**Response (204):**
```
(No content)
```

---

## 4.6 Cancel Event
```http
POST /api/v1/events/:id/cancel
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Event cancelled successfully"
  }
}
```

---

## 4.7 Get My Events
```http
GET /api/v1/events/my?page=1&limit=20&status=active
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { ... }
  }
}
```

---

## 4.8 Get Event Categories
```http
GET /api/v1/events/categories
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      { "id": 1, "name": "Yemek", "icon": "restaurant", "color": "#FF6B6B" },
      { "id": 2, "name": "Kahve", "icon": "coffee", "color": "#8B4513" },
      { "id": 3, "name": "Spor", "icon": "sports", "color": "#45B7D1" }
    ]
  }
}
```

---

## 4.9 Get Nearby Events
```http
GET /api/v1/events/nearby?lat=41.0082&lng=28.9784&radius=10&limit=50
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "...",
        "title": "...",
        "latitude": 40.9822,
        "longitude": 29.0244,
        "category": { "id": 1, "name": "Yemek", "icon": "restaurant", "color": "#FF6B6B" }
      }
    ]
  }
}
```

---

# 5. Application Endpoints

## 5.1 Apply to Event
```http
POST /api/v1/applications
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440010",
  "message": "Merhaba, katılmak istiyorum!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "status": "pending",
    "message": "Merhaba, katılmak istiyorum!",
    "createdAt": "2026-07-19T15:00:00Z"
  }
}
```

---

## 5.2 Get My Applications
```http
GET /api/v1/applications/sent?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440010",
          "title": "Akşam Yemeği @ Kadıköy",
          "date": "2026-07-20",
          "time": "20:00:00",
          "category": { "name": "Yemek", "icon": "restaurant" }
        },
        "status": "pending",
        "message": "Merhaba, katılmak istiyorum!",
        "createdAt": "2026-07-19T15:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 5.3 Get Incoming Applications
```http
GET /api/v1/applications/received?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "applicant": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "profile": {
            "fullName": "Zeynep Kaya",
            "avatarUrl": "https://...",
            "age": 26
          },
          "isVerified": true,
          "averageRating": 4.5
        },
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440010",
          "title": "Akşam Yemeği @ Kadıköy"
        },
        "status": "pending",
        "message": "Merhaba, katılmak istiyorum!",
        "createdAt": "2026-07-19T15:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 5.4 Update Application Status
```http
PATCH /api/v1/applications/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "status": "approved"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "status": "approved",
    "message": "Application status updated",
    "conversationId": "550e8400-e29b-41d4-a716-446655440030"
  }
}
```

---

## 5.5 Cancel Application
```http
DELETE /api/v1/applications/:id
Authorization: Bearer <token>
```

**Response (204):**
```
(No content)
```

---

# 6. Messaging Endpoints

## 6.1 Get Conversations
```http
GET /api/v1/conversations?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440010",
          "title": "Akşam Yemeği @ Kadıköy"
        },
        "otherUser": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "profile": {
            "fullName": "Zeynep Kaya",
            "avatarUrl": "https://..."
          }
        },
        "lastMessage": {
          "content": "Tamam, görüşürüz!",
          "createdAt": "2026-07-19T16:30:00Z"
        },
        "unreadCount": 2,
        "createdAt": "2026-07-19T15:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 6.2 Get Messages
```http
GET /api/v1/conversations/:id/messages?page=1&limit=50
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "senderId": "550e8400-e29b-41d4-a716-446655440000",
        "content": "Merhaba Ahmet, etkinliğine katılmak istiyorum.",
        "isRead": true,
        "createdAt": "2026-07-19T15:00:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440041",
        "senderId": "550e8400-e29b-41d4-a716-446655440002",
        "content": "Merhaba! Tabii, bekleriz. Saat 20:00'da Moda'dayız.",
        "isRead": true,
        "createdAt": "2026-07-19T15:05:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 6.3 Send Message (REST Fallback)
```http
POST /api/v1/messages
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440030",
  "content": "Harika, teşekkürler!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440042",
    "senderId": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Harika, teşekkürler!",
    "isRead": false,
    "createdAt": "2026-07-19T16:00:00Z"
  }
}
```

---

## 6.4 Mark Messages as Read
```http
PATCH /api/v1/conversations/:id/read
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Messages marked as read"
  }
}
```

---

# 7. Notification Endpoints

## 7.1 Get Notifications
```http
GET /api/v1/notifications?page=1&limit=30
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440050",
        "type": "new_application",
        "title": "Yeni Başvuru",
        "body": "Zeynep etkinliğine başvurdu",
        "data": {
          "eventId": "550e8400-e29b-41d4-a716-446655440010",
          "applicationId": "550e8400-e29b-41d4-a716-446655440020"
        },
        "isRead": false,
        "createdAt": "2026-07-19T15:00:00Z"
      }
    ],
    "pagination": { ... },
    "unreadCount": 5
  }
}
```

---

## 7.2 Mark Notification as Read
```http
PATCH /api/v1/notifications/:id/read
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Notification marked as read"
  }
}
```

---

## 7.3 Mark All Notifications as Read
```http
PATCH /api/v1/notifications/read-all
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "All notifications marked as read",
    "count": 5
  }
}
```

---

## 7.4 Update Notification Preferences
```http
PATCH /api/v1/notifications/preferences
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "pushEnabled": true,
  "emailEnabled": false,
  "eventReminders": true,
  "newApplications": true,
  "messages": true,
  "ratings": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "preferences": { ... }
  }
}
```

---

# 8. Rating Endpoints

## 8.1 Create Rating
```http
POST /api/v1/ratings
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440010",
  "ratedId": "550e8400-e29b-41d4-a716-446655440002",
  "respectScore": 5,
  "punctualityScore": 5,
  "communicationScore": 4,
  "overallScore": 5,
  "comment": "Harika bir etkinlikti, teşekkürler!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440060",
    "message": "Rating submitted successfully"
  }
}
```

---

## 8.2 Get My Ratings
```http
GET /api/v1/ratings/me?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440060",
        "event": {
          "id": "...",
          "title": "Akşam Yemeği @ Kadıköy"
        },
        "ratedUser": {
          "id": "...",
          "profile": {
            "fullName": "Zeynep Kaya",
            "avatarUrl": "https://..."
          }
        },
        "overallScore": 5,
        "comment": "Harika bir etkinlikti...",
        "createdAt": "2026-07-21T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 8.3 Get Ratings for User
```http
GET /api/v1/ratings/user/:userId?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.8,
    "totalRatings": 32,
    "breakdown": {
      "respect": 4.9,
      "punctuality": 4.7,
      "communication": 4.8,
      "overall": 4.8
    },
    "items": [
      {
        "id": "...",
        "event": { "title": "..." },
        "rater": {
          "profile": { "fullName": "...", "avatarUrl": "..." }
        },
        "overallScore": 5,
        "comment": "...",
        "createdAt": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

# 9. Upload Endpoints

## 9.1 Get Presigned URL
```http
POST /api/v1/upload/presigned-url
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "fileName": "profile-photo.jpg",
  "contentType": "image/jpeg",
  "folder": "avatars"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://loopin-media.s3.amazonaws.com/...",
    "publicUrl": "https://cdn.loopin.app/avatars/...",
    "expiresIn": 900
  }
}
```

---

## 9.2 Upload to S3 (Client-side)
```http
PUT https://loopin-media.s3.amazonaws.com/...
Content-Type: image/jpeg
x-amz-acl: public-read
```

**Request:**
```
<binary file data>
```

**Response (200):**
```
(No content - S3 success)
```

---

# 10. Payment Endpoints

## 10.1 Get Subscription Plans
```http
GET /api/v1/payments/plans
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "monthly",
        "name": "Aylık",
        "price": 99,
        "currency": "TRY",
        "period": "month",
        "features": [
          "Sınırsız etkinlik oluşturma",
          "Gelişmiş filtreleme",
          "Profil öne çıkarma"
        ]
      },
      {
        "id": "yearly",
        "name": "Yıllık",
        "price": 799,
        "currency": "TRY",
        "period": "year",
        "originalPrice": 999,
        "features": [
          "Sınırsız etkinlik oluşturma",
          "Gelişmiş filtreleme",
          "Profil öne çıkarma",
          "Öncelikli eşleşme"
        ]
      }
    ]
  }
}
```

---

## 10.2 Create Subscription
```http
POST /api/v1/payments/subscribe
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "planId": "monthly",
  "paymentMethod": "credit_card",
  "cardToken": "tok_visa"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "550e8400-e29b-41d4-a716-446655440070",
    "status": "active",
    "plan": "monthly",
    "expiresAt": "2026-08-20T10:00:00Z"
  }
}
```

---

## 10.3 Get Current Subscription
```http
GET /api/v1/payments/subscription
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440070",
    "plan": "monthly",
    "status": "active",
    "startedAt": "2026-07-20T10:00:00Z",
    "expiresAt": "2026-08-20T10:00:00Z",
    "autoRenew": true
  }
}
```

---

## 10.4 Cancel Subscription
```http
DELETE /api/v1/payments/subscription
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Subscription cancelled. Active until 2026-08-20."
  }
}
```

---

# 11. Report Endpoints

## 11.1 Create Report
```http
POST /api/v1/reports
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "reportedId": "550e8400-e29b-41d4-a716-446655440001",
  "eventId": "550e8400-e29b-41d4-a716-446655440010",
  "type": "inappropriate_behavior",
  "reason": "Uygunsuz davranış sergiledi."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440080",
    "message": "Report submitted successfully"
  }
}
```

---

# 12. Search Endpoints

## 12.1 Search Events
```http
GET /api/v1/search/events?q=kadikoy+yemek&city=Istanbul&page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { ... }
  }
}
```

---

## 12.2 Search Users
```http
GET /api/v1/search/users?q=ahmet&city=Istanbul&page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "profile": {
          "fullName": "Ahmet Yılmaz",
          "avatarUrl": "https://...",
          "city": "İstanbul"
        }
      }
    ],
    "pagination": { ... }
  }
}
```

---

# 13. Admin Endpoints

## 13.1 Get Dashboard Stats
```http
GET /api/v1/admin/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 15000,
    "activeUsers": 8500,
    "dailyEvents": 120,
    "premiumUsers": 1500,
    "newUsersToday": 45,
    "newEventsToday": 30,
    "applicationsToday": 150,
    "reportsPending": 12
  }
}
```

---

## 13.2 List Users (Admin)
```http
GET /api/v1/admin/users?page=1&limit=50&search=ahmet&role=user&status=active
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "phone": "+905551234567",
        "email": "user@example.com",
        "role": "user",
        "status": "active",
        "isVerified": true,
        "isPremium": false,
        "profile": {
          "fullName": "Ahmet Yılmaz",
          "city": "İstanbul"
        },
        "createdAt": "2026-01-15T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 13.3 Update User Status (Admin)
```http
PATCH /api/v1/admin/users/:id/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "status": "suspended",
  "reason": "Kuralları ihlal"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "User status updated to suspended"
  }
}
```

---

## 13.4 List Reports (Admin)
```http
GET /api/v1/admin/reports?page=1&limit=50&status=pending
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "reporter": { "id": "...", "profile": { "fullName": "..." } },
        "reported": { "id": "...", "profile": { "fullName": "..." } },
        "type": "inappropriate_behavior",
        "reason": "...",
        "status": "pending",
        "createdAt": "2026-07-19T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 13.5 Update Report Status (Admin)
```http
PATCH /api/v1/admin/reports/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "status": "resolved",
  "action": "warn_user"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Report resolved, user warned"
  }
}
```

---

# 14. WebSocket Events

## 14.1 Connection
```javascript
const socket = io('wss://api.loopin.app', {
  auth: {
    token: '<access_token>'
  }
});
```

## 14.2 Events

### Join Room
```javascript
socket.emit('join_room', { roomId: 'conv_550e8400-e29b-41d4-a716-446655440030' });
```

### Send Message
```javascript
socket.emit('send_message', {
  roomId: 'conv_550e8400-e29b-41d4-a716-446655440030',
  content: 'Merhaba!'
});
```

### Typing Indicator
```javascript
socket.emit('typing', {
  roomId: 'conv_550e8400-e29b-41d4-a716-446655440030',
  isTyping: true
});
```

### Listen for New Messages
```javascript
socket.on('new_message', (data) => {
  console.log(data);
  // { id, senderId, content, createdAt }
});
```

### Listen for Typing
```javascript
socket.on('user_typing', (data) => {
  console.log(data);
  // { userId, isTyping }
});
```

---

# 15. Health Check

```http
GET /api/v1/health
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-07-20T12:00:00Z",
    "version": "1.0.0",
    "services": {
      "database": "connected",
      "redis": "connected",
      "s3": "connected"
    }
  }
}
```

---

---

# 16. Sosyal & Zengin Etkinlik API Endpoint'leri

## 16.1 Create Nested Comment / Reply
```http
POST /api/v1/events/:id/comments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "parentId": "550e8400-e29b-41d4-a716-446655440001",
  "commentText": "Katılıyorum, harika bir etkinlik rotası!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "comment-uuid-99",
    "eventId": "event-uuid-01",
    "userId": "user-uuid-10",
    "parentId": "550e8400-e29b-41d4-a716-446655440001",
    "commentText": "Katılıyorum, harika bir etkinlik rotası!",
    "createdAt": "2026-07-20T16:00:00Z"
  }
}
```

---

## 16.2 Get Activity Feed (Etkinlik Duvarı)
```http
GET /api/v1/activity-feed?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "feed-1",
        "user": {
          "id": "user-1",
          "fullName": "Ayşe Kaya",
          "avatarUrl": "https://..."
        },
        "activityType": "JOINED_EVENT",
        "targetEvent": {
          "id": "event-1",
          "title": "Belgrad Ormanı Trekking"
        },
        "createdAt": "2026-07-20T15:30:00Z"
      }
    ]
  }
}
```

---

## 16.3 Verify QR Check-in
```http
POST /api/v1/events/:id/checkin/qr
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "qrCodeHash": "LOOPIN_QR_HASH_987654"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "user": {
      "id": "user-10",
      "fullName": "Ahmet Yılmaz"
    },
    "verifiedAt": "2026-07-20T10:05:00Z"
  }
}
```

---

## 16.4 Get Event Score
```http
GET /api/v1/events/:id/score
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "eventId": "event-1",
    "totalScore": 94.50,
    "attendanceRate": 90.0,
    "punctualityScore": 95.0,
    "satisfactionScore": 98.0,
    "commentDensity": 24,
    "photoSharingCount": 18,
    "rejoinIntentRate": 92.0
  }
}
```

---

## 16.5 Get AI Smart Recommendations
```http
GET /api/v1/ai/recommendations?weather=rainy
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Bugün hava yağmurlu. Sana yakın kapalı mekanlarda 12 sıcak etkinlik buldum!",
    "recommendedEvents": [
      {
        "id": "event-indoor-1",
        "title": "Kadıköy Sanat Galerisi & Kahve Sohbeti",
        "category": "Sanat & Kahve",
        "distance": "1.2 km"
      }
    ]
  }
}
```

---

# SONUÇ

Bu API dokümantasyonu, Loopin platformunun tüm REST API endpoint'lerini, WebSocket event'lerini ve zengin sosyal medya servislerini tanımlar.
"""

