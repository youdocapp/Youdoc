from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for viewsets (if any)
router = DefaultRouter()

urlpatterns = [
    # Notification management
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('create', views.NotificationCreateView.as_view(), name='notification-create'),
    path('stats', views.NotificationStatsView.as_view(), name='notification-stats'),
    path('<uuid:pk>', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('<uuid:notification_id>/read', views.mark_notification_read, name='notification-mark-read'),
    path('mark-all-read', views.mark_all_notifications_read, name='notification-mark-all-read'),
    path('bulk-action', views.bulk_notification_action, name='notification-bulk-action'),
    
    # Notification preferences
    path('preferences', views.NotificationPreferenceListView.as_view(), name='notification-preference-list'),
    path('preferences/update', views.update_notification_preferences, name='notification-preference-bulk-update'),
    path('preferences/<uuid:pk>', views.NotificationPreferenceDetailView.as_view(), name='notification-preference-detail'),
    
    # Device token management
    path('device-tokens', views.DeviceTokenListView.as_view(), name='device-token-list'),
    path('device-tokens/<uuid:pk>', views.DeviceTokenDetailView.as_view(), name='device-token-detail'),
    path('register-device', views.register_device_token, name='device-token-register'),
    
    # Templates (admin/system use)
    path('templates', views.NotificationTemplateListView.as_view(), name='notification-template-list'),
    
    # Test endpoints (for development)
    path('test/medication-reminder', views.test_medication_reminder, name='test-medication-reminder'),
    path('test/health-tip', views.test_health_tip, name='test-health-tip'),
    path('test/sync-notification', views.test_sync_notification, name='test-sync-notification'),
]

# Include router URLs if any viewsets are added
urlpatterns += router.urls
