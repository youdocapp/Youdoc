# Youdoc Backend API Documentation

## Overview
Youdoc is a comprehensive health management platform that helps users track their medications, health records, and medical history. The backend provides a RESTful API built with Django and Django REST Framework.

## Architecture

### Technology Stack
- **Framework**: Django 5.2.7
- **API**: Django REST Framework
- **Authentication**: JWT (Simple JWT)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Email**: Gmail SMTP
- **Admin**: Jazzmin
- **CORS**: django-cors-headers

### Project Structure
```
backend/
├── youdoc_backend/          # Main project settings
├── authentication/          # User management & auth
├── medication/             # Medication tracking
├── health_records/         # Health document management
├── medical_history/        # Medical conditions & history
├── docs/                   # Documentation
└── manage.py              # Django management script
```

## Apps Overview

### 1. Authentication App
**Purpose**: User registration, login, email verification, and profile management

**Key Features**:
- Email-based authentication
- OTP email verification
- JWT token authentication
- Password reset functionality
- User profile management
- Email integration

**Documentation**: [authentication.md](./authentication.md)

### 2. Medication App
**Purpose**: Medication management, reminders, and adherence tracking

**Key Features**:
- Medication CRUD operations
- Dosage and frequency tracking
- Reminder management
- Adherence tracking
- Calendar view
- Today's medications

**Documentation**: [medication.md](./medication.md)

### 3. Health Records App
**Purpose**: Health document storage and management

**Key Features**:
- Document upload and storage
- File type validation
- Search and filtering
- Document categorization
- Secure file access

**Documentation**: [health_records.md](./health_records.md)

### 4. Medical History App
**Purpose**: Medical conditions, surgeries, and allergies tracking

**Key Features**:
- Medical conditions management
- Surgery history tracking
- Allergy management
- Status tracking
- Detailed notes

**Documentation**: [medical_history.md](./medical_history.md)

## API Endpoints

### Authentication Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | User registration |
| `/auth/verify-otp` | POST | Email verification |
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | User logout |
| `/auth/profile` | GET/PUT/PATCH | Profile management |
| `/auth/change-password` | POST | Change password |
| `/auth/password-reset-request` | POST | Request password reset |
| `/auth/password-reset-confirm` | POST | Confirm password reset |

### Medication Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/medications` | GET/POST | List/Create medications |
| `/medications/{id}` | GET/PUT/PATCH/DELETE | Medication details |
| `/medications/taken` | GET/POST | List/Create taken records |
| `/medications/{id}/toggle` | POST | Toggle taken status |
| `/medications/calendar` | GET | Calendar view |
| `/medications/today` | GET | Today's medications |

### Health Records Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health-records` | GET/POST | List/Create health records |
| `/health-records/{id}` | GET/PUT/PATCH/DELETE | Health record details |

### Medical History Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/medical-history/conditions` | GET/POST | List/Create conditions |
| `/medical-history/conditions/{id}` | GET/PUT/PATCH/DELETE | Condition details |
| `/medical-history/surgeries` | GET/POST | List/Create surgeries |
| `/medical-history/surgeries/{id}` | GET/PUT/PATCH/DELETE | Surgery details |
| `/medical-history/allergies` | GET/POST | List/Create allergies |
| `/medical-history/allergies/{id}` | GET/PUT/PATCH/DELETE | Allergy details |

## Authentication Flow

### 1. Registration
1. User submits registration form
2. Account created with `is_email_verified=False`
3. 6-digit OTP sent via email
4. No JWT tokens returned

### 2. Email Verification
1. User enters OTP code
2. Email marked as verified
3. Welcome email sent
4. JWT tokens generated
5. User automatically logged in

### 3. Login
1. User can only login if email is verified
2. JWT tokens returned on successful login
3. Error returned if email not verified

## Data Models

### User Model
- UUID primary key
- Email-based authentication
- Health profile fields (blood type, height, weight)
- Email verification status
- Notification preferences

### Medication Model
- Custom ID with MED- prefix
- Dosage and frequency tracking
- Date range management
- Reminder settings

### Health Record Model
- Custom ID with HR- prefix
- File upload support
- Document categorization
- Search functionality

### Medical History Models
- Medical conditions with status tracking
- Surgery history with provider details
- Allergies with severity levels

## Security Features

### Authentication
- JWT token-based authentication
- Email verification required
- Password reset functionality
- Secure token generation

### Authorization
- User-specific data access
- Permission validation
- Secure file access
- Input validation

### Data Protection
- UUID primary keys
- Secure file storage
- Input sanitization
- Error handling

## Configuration

### Environment Variables
```env
# Django Configuration
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/youdoc

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=yourapp@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Settings
- JWT token expiration: 60 minutes
- Refresh token expiration: 7 days
- Email verification OTP expiration: 10 minutes
- Password reset token expiration: 24 hours

## Installation & Setup

### Prerequisites
- Python 3.8+
- PostgreSQL (production)
- Gmail account with App Password

### Installation
```bash
# Clone repository
git clone <repository-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Testing
```bash
# Run tests
python manage.py test

# Test email functionality
python manage.py test_email --otp --email test@example.com
```

## API Usage Examples

### Registration
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "password_confirm": "securepassword",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Email Verification
```bash
curl -X POST http://localhost:8000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Create Medication
```bash
curl -X POST http://localhost:8000/medications \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aspirin",
    "medication_type": "Pill",
    "dosage_amount": 100,
    "dosage_unit": "mg",
    "frequency": "Daily",
    "start_date": "2024-01-01"
  }'
```

## Error Handling

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

```json
{
  "error": true,
  "message": "Error description",
  "details": { ... }
}
```

### Common Error Codes
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (permission denied)
- 404: Not Found (resource not found)
- 500: Internal Server Error

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints where appropriate
- Write comprehensive docstrings
- Implement proper error handling

### Testing
- Write unit tests for models
- Test API endpoints
- Validate serializers
- Test authentication flows

### Documentation
- Keep API documentation updated
- Document new features
- Provide usage examples
- Maintain changelog

## Deployment

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Configure production database
- [ ] Set up email service
- [ ] Configure CORS origins
- [ ] Set up static file serving
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Enable HTTPS

### Environment Setup
- Use environment variables for sensitive data
- Configure proper database settings
- Set up email service
- Configure CORS for frontend
- Set up file storage

## Monitoring & Logging

### Logging
- Configure Django logging
- Log authentication attempts
- Log API errors
- Monitor performance

### Monitoring
- Set up health checks
- Monitor database performance
- Track API usage
- Monitor error rates

## Support

### Documentation
- [Authentication App](./authentication.md)
- [Medication App](./medication.md)
- [Health Records App](./health_records.md)
- [Medical History App](./medical_history.md)

### Contact
- Email: support@youdoc.com
- Documentation: [docs.youdoc.com](https://docs.youdoc.com)
- Issues: [GitHub Issues](https://github.com/youdoc/backend/issues)

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- User authentication with email verification
- Medication management
- Health records storage
- Medical history tracking
- JWT authentication
- Email integration
- File upload support
