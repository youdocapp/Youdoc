# Youdoc API Endpoints Documentation

This document provides a comprehensive list of all API endpoints available in the Youdoc backend system.

## Base URL
**Production URL**: https://youdoc.onrender.com
All API endpoints are prefixed with `/api/`

### Example API URLs:
- Authentication: `https://youdoc.onrender.com/api/auth/`
- Medications: `https://youdoc.onrender.com/api/medications/`
- Health Records: `https://youdoc.onrender.com/api/health-records/`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 1. Authentication Endpoints (`/api/auth/`)

| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/auth/register/` | POST | User registration | No |
| `/api/auth/login/` | POST | User login | No |
| `/api/auth/logout/` | POST | User logout | Yes |
| `/api/auth/token/refresh/` | POST | Refresh JWT token | No |
| `/api/auth/profile/` | GET/PUT/PATCH | Get/Update user profile | Yes |
| `/api/auth/change-password/` | POST | Change user password | Yes |
| `/api/auth/verify-otp/` | POST | Verify email OTP | No |
| `/api/auth/resend-verification/` | POST | Resend verification email | No |
| `/api/auth/password-reset-request/` | POST | Request password reset | No |
| `/api/auth/password-reset-confirm/` | POST | Confirm password reset | No |
| `/api/auth/delete-account/` | DELETE | Delete user account | Yes |
| `/api/auth/google/` | POST | Google OAuth authentication | No |
| `/api/auth/apple/` | POST | Apple OAuth authentication | No |

## 2. Medication Endpoints (`/api/medications/`)

| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/medications/` | GET/POST | List/Create medications | Yes |
| `/api/medications/{id}/` | GET/PUT/PATCH/DELETE | Medication details | Yes |
| `/api/medications/taken/` | GET/POST | List/Create taken records | Yes |
| `/api/medications/taken/{id}/` | GET/PUT/PATCH/DELETE | Taken record details | Yes |
| `/api/medications/{medication_id}/toggle-taken/` | POST | Toggle medication taken status | Yes |
| `/api/medications/calendar/` | GET | Medication calendar view | Yes |
| `/api/medications/today/` | GET | Today's medications | Yes |

## 3. Health Records Endpoints (`/api/health-records/`)

| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/health-records/` | GET/POST | List/Create health records | Yes |
| `/api/health-records/{id}/` | GET/PUT/PATCH/DELETE | Health record details | Yes |

## 4. Medical History Endpoints (`/api/medical-history/`)

### Medical Conditions
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/medical-history/conditions/` | GET/POST | List/Create medical conditions | Yes |
| `/api/medical-history/conditions/{id}/` | GET/PUT/PATCH/DELETE | Condition details | Yes |

### Surgeries
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/medical-history/surgeries/` | GET/POST | List/Create surgeries | Yes |
| `/api/medical-history/surgeries/{id}/` | GET/PUT/PATCH/DELETE | Surgery details | Yes |

### Allergies
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/medical-history/allergies/` | GET/POST | List/Create allergies | Yes |
| `/api/medical-history/allergies/{id}/` | GET/PUT/PATCH/DELETE | Allergy details | Yes |

## 5. Emergency Contacts Endpoints (`/api/emergency-contacts/`)

| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/emergency-contacts/` | GET/POST | List/Create emergency contacts | Yes |
| `/api/emergency-contacts/{id}/` | GET/PUT/PATCH/DELETE | Contact details | Yes |
| `/api/emergency-contacts/primary/` | GET | Get primary contact | Yes |
| `/api/emergency-contacts/set-primary/` | POST | Set primary contact | Yes |
| `/api/emergency-contacts/stats/` | GET | Get contact statistics | Yes |
| `/api/emergency-contacts/bulk-delete/` | DELETE | Bulk delete contacts | Yes |

## 6. Articles Endpoints (`/api/articles/`)

### Articles
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/articles/` | GET/POST | List/Create articles | GET: No, POST: Yes |
| `/api/articles/{id}/` | GET/PUT/PATCH/DELETE | Article details | GET: No, Others: Yes |
| `/api/articles/featured/` | GET | Get featured articles | No |
| `/api/articles/search/` | GET | Search articles | No |
| `/api/articles/bookmarked/` | GET | Get user's bookmarked articles | Yes |

### Article Interactions
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/articles/{article_id}/bookmark/` | POST | Toggle article bookmark | Yes |
| `/api/articles/{article_id}/like/` | POST | Toggle article like | Yes |

### Comments
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/articles/{article_id}/comments/` | GET/POST | List/Create comments | GET: No, POST: Yes |
| `/api/articles/{article_id}/comments/{id}/` | GET/PUT/PATCH/DELETE | Comment details | GET: No, Others: Yes |
| `/api/articles/{article_id}/comments/{comment_id}/like/` | POST | Toggle comment like | Yes |

### Categories and Authors
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/articles/categories/` | GET | Get article categories | No |
| `/api/articles/authors/` | GET | Get article authors | No |

## 7. Health Tracking Endpoints (`/api/health-tracking/`)

### Health Data
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/health-tracking/data/` | GET/POST | Get/Update health data | Yes |
| `/api/health-tracking/data/update/` | PUT/PATCH | Update health data | Yes |
| `/api/health-tracking/trends/` | GET | Get health trends | Yes |

### Connected Devices
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/health-tracking/devices/` | GET/POST | List/Create connected devices | Yes |
| `/api/health-tracking/devices/{id}/` | GET/PUT/PATCH/DELETE | Device details | Yes |
| `/api/health-tracking/devices/{device_id}/toggle/` | POST | Toggle device connection | Yes |
| `/api/health-tracking/devices/{device_id}/sync/` | POST | Sync health data from device | Yes |

### Health Goals
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/health-tracking/goals/` | GET/POST | List/Create health goals | Yes |
| `/api/health-tracking/goals/{id}/` | GET/PUT/PATCH/DELETE | Goal details | Yes |
| `/api/health-tracking/goals/progress/` | GET | Get goal progress | Yes |

### Health Insights
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/health-tracking/insights/` | GET | Get health insights | Yes |
| `/api/health-tracking/insights/{insight_id}/read/` | POST | Mark insight as read | Yes |

### Sync History
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/health-tracking/sync-history/` | GET | Get sync history | Yes |

## 8. Notifications Endpoints (`/api/notifications/`)

### Notification Management
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/notifications/` | GET/POST | List/Create notifications | Yes |
| `/api/notifications/create/` | POST | Create notification | Yes |
| `/api/notifications/stats/` | GET | Get notification statistics | Yes |
| `/api/notifications/{id}/` | GET/PUT/PATCH/DELETE | Notification details | Yes |
| `/api/notifications/{notification_id}/read/` | POST | Mark notification as read | Yes |
| `/api/notifications/mark-all-read/` | POST | Mark all notifications as read | Yes |
| `/api/notifications/bulk-action/` | POST | Bulk notification actions | Yes |

### Notification Preferences
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/notifications/preferences/` | GET/POST | List/Create preferences | Yes |
| `/api/notifications/preferences/update/` | PUT/PATCH | Update preferences | Yes |
| `/api/notifications/preferences/{id}/` | GET/PUT/PATCH/DELETE | Preference details | Yes |

### Device Token Management
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/notifications/device-tokens/` | GET/POST | List/Create device tokens | Yes |
| `/api/notifications/device-tokens/{id}/` | GET/PUT/PATCH/DELETE | Device token details | Yes |
| `/api/notifications/register-device/` | POST | Register device for push notifications | Yes |

### Templates and Testing
| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/notifications/templates/` | GET | List notification templates | Yes |
| `/api/notifications/test/medication-reminder/` | POST | Test medication reminder | Yes |
| `/api/notifications/test/health-tip/` | POST | Test health tip notification | Yes |
| `/api/notifications/test/sync-notification/` | POST | Test sync notification | Yes |

## 9. Admin Endpoints

| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/admin/` | GET | Django admin interface | Yes (Admin only) |

## 10. REST Framework Endpoints

| Endpoint | Method | Purpose | Authentication Required |
|----------|--------|---------|------------------------|
| `/api/` | GET | REST framework browsable API | Yes |

## Response Formats

### Success Response
```json
{
    "status": "success",
    "data": { ... },
    "message": "Operation completed successfully"
}
```

### Error Response
```json
{
    "status": "error",
    "error": "Error message",
    "details": { ... }
}
```

### Pagination Response
```json
{
    "count": 100,
    "next": "http://api.example.com/items/?page=2",
    "previous": null,
    "results": [ ... ]
}
```

## Authentication Methods

1. **JWT Token**: Include in Authorization header
2. **OAuth**: Google and Apple OAuth integration
3. **Session**: For admin interface

## Rate Limiting

- API calls are rate-limited per user
- Authentication endpoints have stricter limits
- Admin endpoints have higher limits

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Notes

- All timestamps are in UTC format
- File uploads are supported for health records and profile images
- WebSocket connections are available for real-time notifications
- API versioning is handled through URL prefixes
- CORS is configured for frontend integration
