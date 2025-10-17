from django.contrib import admin
from .models import (
    HealthMetric, ConnectedDevice, HealthGoal, HealthInsight, 
    HealthDataSnapshot, HealthSyncLog
)


@admin.register(HealthMetric)
class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ['user', 'metric_type', 'value', 'unit', 'device_type', 'timestamp']
    list_filter = ['metric_type', 'device_type', 'timestamp']
    search_fields = ['user__username', 'user__email']
    ordering = ['-timestamp']
    date_hierarchy = 'timestamp'


@admin.register(ConnectedDevice)
class ConnectedDeviceAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'device_type', 'connected', 'last_sync', 'created_at']
    list_filter = ['device_type', 'connected', 'created_at']
    search_fields = ['user__username', 'user__email', 'name']
    ordering = ['-last_sync']
    date_hierarchy = 'created_at'


@admin.register(HealthGoal)
class HealthGoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'goal_type', 'target_value', 'unit', 'is_active', 'start_date']
    list_filter = ['goal_type', 'is_active', 'start_date']
    search_fields = ['user__username', 'user__email']
    ordering = ['-created_at']
    date_hierarchy = 'start_date'


@admin.register(HealthInsight)
class HealthInsightAdmin(admin.ModelAdmin):
    list_display = ['user', 'insight_type', 'title', 'is_read', 'created_at']
    list_filter = ['insight_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'user__email', 'title', 'description']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'


@admin.register(HealthDataSnapshot)
class HealthDataSnapshotAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'heart_rate', 'steps', 'sleep_hours', 'weight', 'last_sync']
    list_filter = ['date', 'device_type', 'last_sync']
    search_fields = ['user__username', 'user__email']
    ordering = ['-date']
    date_hierarchy = 'date'


@admin.register(HealthSyncLog)
class HealthSyncLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'device', 'status', 'metrics_synced', 'started_at', 'completed_at']
    list_filter = ['status', 'started_at', 'device__device_type']
    search_fields = ['user__username', 'user__email', 'device__name']
    ordering = ['-started_at']
    date_hierarchy = 'started_at'