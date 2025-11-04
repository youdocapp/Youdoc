from django.urls import path
from . import views

urlpatterns = [
    # Health data endpoints
    path('data', views.HealthDataView.as_view(), name='health-data'),
    path('data/update', views.HealthDataUpdateView.as_view(), name='health-data-update'),
    path('trends', views.health_trends, name='health-trends'),
    
    # Connected devices endpoints
    path('devices', views.ConnectedDevicesView.as_view(), name='connected-devices'),
    path('devices/<uuid:id>', views.ConnectedDeviceDetailView.as_view(), name='connected-device-detail'),
    path('devices/<uuid:device_id>/toggle', views.toggle_device_connection, name='toggle-device-connection'),
    path('devices/<uuid:device_id>/sync', views.sync_health_data, name='sync-health-data'),
    
    # Health goals endpoints
    path('goals', views.HealthGoalsView.as_view(), name='health-goals'),
    path('goals/<uuid:id>', views.HealthGoalDetailView.as_view(), name='health-goal-detail'),
    path('goals/progress', views.goal_progress, name='goal-progress'),
    
    # Health insights endpoints
    path('insights', views.health_insights, name='health-insights'),
    path('insights/<uuid:insight_id>/read', views.mark_insight_read, name='mark-insight-read'),
    
    # Sync history
    path('sync-history', views.sync_history, name='sync-history'),
]
