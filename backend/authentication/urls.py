from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from . import oauth_views

app_name = 'authentication'

urlpatterns = [
    # Authentication endpoints
    path('register/', views.register, name='register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile management
    path('profile/', views.profile, name='profile'),
    path('change-password/', views.change_password, name='change_password'),
    
    # Email verification
    path('verify-email/', views.verify_email, name='verify_email'),
    path('resend-verification/', views.resend_verification_email, name='resend_verification'),
    
    # Password reset
    path('password-reset-request/', views.password_reset_request, name='password_reset_request'),
    path('password-reset-confirm/', views.password_reset_confirm, name='password_reset_confirm'),
    
    # Account management
    path('delete-account/', views.delete_account, name='delete_account'),
    
    # OAuth endpoints
    path('google/', oauth_views.google_auth, name='google_auth'),
    path('apple/', oauth_views.apple_auth, name='apple_auth'),
]
