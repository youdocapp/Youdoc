from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class HealthMetric(models.Model):
    """Individual health metric readings"""
    METRIC_TYPES = [
        ('heartRate', 'Heart Rate'),
        ('steps', 'Steps'),
        ('distance', 'Distance'),
        ('sleep', 'Sleep'),
        ('calories', 'Calories'),
        ('weight', 'Weight'),
        ('bloodPressure_systolic', 'Blood Pressure (Systolic)'),
        ('bloodPressure_diastolic', 'Blood Pressure (Diastolic)'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='health_metrics')
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES)
    value = models.FloatField()
    unit = models.CharField(max_length=20, default='')  # bpm, steps, km, hours, kcal, kg, mmHg
    device_type = models.CharField(max_length=50, blank=True)  # apple_health, google_fit, fitbit, etc.
    timestamp = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'metric_type', '-timestamp']),
            models.Index(fields=['user', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.metric_type}: {self.value} {self.unit}"


class ConnectedDevice(models.Model):
    """User's connected health devices"""
    DEVICE_TYPES = [
        ('apple_health', 'Apple Health'),
        ('google_fit', 'Google Fit'),
        ('fitbit', 'Fitbit'),
        ('garmin', 'Garmin'),
        ('samsung_health', 'Samsung Health'),
        ('custom', 'Custom Device'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='connected_devices')
    name = models.CharField(max_length=100)
    device_type = models.CharField(max_length=50, choices=DEVICE_TYPES)
    connected = models.BooleanField(default=False)
    last_sync = models.DateTimeField(null=True, blank=True)
    access_token = models.TextField(blank=True)  # Encrypted OAuth tokens
    refresh_token = models.TextField(blank=True)  # For token refresh
    device_id = models.CharField(max_length=200, blank=True)  # Device identifier
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'device_type', 'device_id']
        ordering = ['-last_sync']
    
    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.device_type})"


class HealthGoal(models.Model):
    """User's health goals and targets"""
    GOAL_TYPES = [
        ('steps', 'Daily Steps'),
        ('distance', 'Daily Distance'),
        ('calories', 'Daily Calories'),
        ('sleep', 'Sleep Duration'),
        ('weight', 'Weight Target'),
        ('heartRate', 'Heart Rate Zone'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='health_goals')
    goal_type = models.CharField(max_length=50, choices=GOAL_TYPES)
    target_value = models.FloatField()
    unit = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'goal_type', 'start_date']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.goal_type}: {self.target_value} {self.unit}"


class HealthInsight(models.Model):
    """Generated health insights and recommendations"""
    INSIGHT_TYPES = [
        ('trend', 'Trend Analysis'),
        ('goal_progress', 'Goal Progress'),
        ('recommendation', 'Health Recommendation'),
        ('alert', 'Health Alert'),
        ('achievement', 'Achievement'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='health_insights')
    insight_type = models.CharField(max_length=50, choices=INSIGHT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    metric_type = models.CharField(max_length=50, blank=True)
    value = models.FloatField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class HealthDataSnapshot(models.Model):
    """Daily snapshot of all health metrics for quick access"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='health_snapshots')
    date = models.DateField()
    
    # Health metrics
    heart_rate = models.FloatField(null=True, blank=True)
    steps = models.IntegerField(null=True, blank=True)
    distance = models.FloatField(null=True, blank=True)  # in km
    sleep_hours = models.FloatField(null=True, blank=True)
    calories_burned = models.IntegerField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)  # in kg
    blood_pressure_systolic = models.IntegerField(null=True, blank=True)
    blood_pressure_diastolic = models.IntegerField(null=True, blank=True)
    
    # Metadata
    device_type = models.CharField(max_length=50, blank=True)
    last_sync = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
        indexes = [
            models.Index(fields=['user', '-date']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.date}"


class HealthSyncLog(models.Model):
    """Log of health data synchronization attempts"""
    SYNC_STATUS = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('partial', 'Partial'),
        ('no_data', 'No Data'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sync_logs')
    device = models.ForeignKey(ConnectedDevice, on_delete=models.CASCADE, related_name='sync_logs')
    status = models.CharField(max_length=20, choices=SYNC_STATUS)
    metrics_synced = models.IntegerField(default=0)
    error_message = models.TextField(blank=True)
    sync_duration = models.FloatField(null=True, blank=True)  # in seconds
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['user', '-started_at']),
            models.Index(fields=['device', '-started_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.device.name} - {self.status}"