from rest_framework import serializers
from .models import (
    HealthMetric, ConnectedDevice, HealthGoal, HealthInsight, 
    HealthDataSnapshot, HealthSyncLog
)


class HealthMetricSerializer(serializers.ModelSerializer):
    """Serializer for individual health metrics"""
    
    class Meta:
        model = HealthMetric
        fields = [
            'id', 'metric_type', 'value', 'unit', 'device_type', 
            'timestamp', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ConnectedDeviceSerializer(serializers.ModelSerializer):
    """Serializer for connected devices - matches frontend interface"""
    lastSync = serializers.DateTimeField(source='last_sync', read_only=True)
    
    class Meta:
        model = ConnectedDevice
        fields = [
            'id', 'name', 'device_type', 'connected', 'lastSync', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        """Convert device_type to match frontend expectations"""
        data = super().to_representation(instance)
        # Frontend expects 'type' field
        data['type'] = data.pop('device_type')
        return data


class HealthGoalSerializer(serializers.ModelSerializer):
    """Serializer for health goals"""
    
    class Meta:
        model = HealthGoal
        fields = [
            'id', 'goal_type', 'target_value', 'unit', 'is_active',
            'start_date', 'end_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HealthInsightSerializer(serializers.ModelSerializer):
    """Serializer for health insights"""
    
    class Meta:
        model = HealthInsight
        fields = [
            'id', 'insight_type', 'title', 'description', 'metric_type',
            'value', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class HealthDataSnapshotSerializer(serializers.ModelSerializer):
    """Serializer for daily health data snapshots - matches frontend HealthData interface"""
    heartRate = serializers.FloatField(source='heart_rate', read_only=True)
    sleep = serializers.FloatField(source='sleep_hours', read_only=True)
    calories = serializers.IntegerField(source='calories_burned', read_only=True)
    bloodPressure = serializers.SerializerMethodField()
    lastSync = serializers.DateTimeField(source='last_sync', read_only=True)
    
    class Meta:
        model = HealthDataSnapshot
        fields = [
            'id', 'date', 'heartRate', 'steps', 'distance', 'sleep',
            'calories', 'weight', 'bloodPressure', 'device_type', 'lastSync',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_bloodPressure(self, obj):
        """Format blood pressure as frontend expects"""
        if obj.blood_pressure_systolic and obj.blood_pressure_diastolic:
            return {
                'systolic': obj.blood_pressure_systolic,
                'diastolic': obj.blood_pressure_diastolic
            }
        return None


class HealthDataUpdateSerializer(serializers.Serializer):
    """Serializer for updating health data - matches frontend HealthData interface"""
    heartRate = serializers.FloatField(required=False)
    steps = serializers.IntegerField(required=False)
    distance = serializers.FloatField(required=False)
    sleep = serializers.FloatField(required=False)
    calories = serializers.IntegerField(required=False)
    weight = serializers.FloatField(required=False)
    bloodPressure = serializers.DictField(required=False)
    device_type = serializers.CharField(required=False, default='manual')
    
    def validate_bloodPressure(self, value):
        """Validate blood pressure format"""
        if value and ('systolic' not in value or 'diastolic' not in value):
            raise serializers.ValidationError("Blood pressure must include systolic and diastolic values")
        return value


class HealthTrendSerializer(serializers.Serializer):
    """Serializer for health trends over time"""
    date = serializers.DateField()
    value = serializers.FloatField()
    metric_type = serializers.CharField()


class HealthInsightSummarySerializer(serializers.Serializer):
    """Serializer for health insights summary"""
    total_insights = serializers.IntegerField()
    unread_insights = serializers.IntegerField()
    recent_insights = HealthInsightSerializer(many=True)


class HealthSyncLogSerializer(serializers.ModelSerializer):
    """Serializer for sync logs"""
    device_name = serializers.CharField(source='device.name', read_only=True)
    
    class Meta:
        model = HealthSyncLog
        fields = [
            'id', 'device_name', 'status', 'metrics_synced', 
            'error_message', 'sync_duration', 'started_at', 'completed_at'
        ]
        read_only_fields = ['id', 'started_at']


class DeviceConnectionSerializer(serializers.Serializer):
    """Serializer for device connection requests"""
    device_type = serializers.ChoiceField(choices=ConnectedDevice.DEVICE_TYPES)
    device_id = serializers.CharField(required=False, allow_blank=True)
    access_token = serializers.CharField(required=False, allow_blank=True)
    refresh_token = serializers.CharField(required=False, allow_blank=True)


class HealthGoalProgressSerializer(serializers.Serializer):
    """Serializer for goal progress tracking"""
    goal = HealthGoalSerializer()
    current_value = serializers.FloatField()
    progress_percentage = serializers.FloatField()
    days_remaining = serializers.IntegerField()
    is_on_track = serializers.BooleanField()
