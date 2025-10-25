"""
URL configuration for youdoc_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from datetime import datetime


# Customize admin site
admin.site.site_header = "Youdoc Administration"
admin.site.site_title = "Youdoc Admin"
admin.site.index_title = "Welcome to Youdoc Administration"

def api_root(request):
    """Root API endpoint with available endpoints information"""
    return JsonResponse({
        'message': 'Welcome to Youdoc Health Platform API',
        'version': '1.0.0',
        'status': 'active',
        'endpoints': {
            'admin': '/admin/',
            'authentication': '/api/auth/',
            'medications': '/api/medications/',
            'health_records': '/api/health-records/',
            'medical_history': '/api/medical-history/',
            'emergency_contacts': '/api/emergency-contacts/',
            'articles': '/api/articles/',
            'health_tracking': '/api/health-tracking/',
            'notifications': '/api/notifications/',
        },
        'documentation': 'https://github.com/your-repo/youdoc-backend'
    })

def health_check(request):
    """Health check endpoint for monitoring"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'youdoc-backend',
        'timestamp': str(datetime.now())
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('health/', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/', include('rest_framework.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/medications/', include('medication.urls')),
    path('api/health-records/', include('health_records.urls')),
    path('api/medical-history/', include('medical_history.urls')),
    path('api/emergency-contacts/', include('emergency_contacts.urls')),
    path('api/articles/', include('articles.urls')),
    path('api/health-tracking/', include('health_tracking.urls')),
    path('api/notifications/', include('notifications.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
