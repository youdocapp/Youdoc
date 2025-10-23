# Youdoc Backend API

Django REST API backend for the Youdoc health platform.

## Deployment on Render

This backend is configured for deployment on Render with the following settings:

- **Runtime**: Python 3.11
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn youdoc_backend.wsgi:application --bind 0.0.0.0:$PORT`

## Environment Variables

Make sure to set these environment variables in your Render dashboard:

- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False` for production
- `ALLOWED_HOSTS` - Your Render domain
- `DATABASE_URL` - PostgreSQL database URL
- `CORS_ALLOWED_ORIGINS` - Your frontend domain
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `EMAIL_HOST_USER` - Email configuration
- `EMAIL_HOST_PASSWORD` - Email password

## Local Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
