from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Notification,
    NotificationPreference,
    DeviceToken,
    NotificationTemplate,
    NotificationLog
)


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model
    """
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'type',
            'type_display',
            'title',
            'message',
            'is_read',
            'status',
            'status_display',
            'scheduled_for',
            'sent_at',
            'metadata',
            'created_at',
            'updated_at',
            'time_ago'
        ]
        read_only_fields = [
            'id',
            'type_display',
            'status_display',
            'sent_at',
            'created_at',
            'updated_at',
            'time_ago'
        ]
    
    def get_time_ago(self, obj):
        """Get human-readable time ago"""
        from django.utils import timezone
        from django.utils.timesince import timesince
        
        if obj.sent_at:
            return timesince(obj.sent_at, timezone.now())
        elif obj.created_at:
            return timesince(obj.created_at, timezone.now())
        return "Just now"


class NotificationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating notifications
    """
    class Meta:
        model = Notification
        fields = [
            'type',
            'title',
            'message',
            'scheduled_for',
            'metadata'
        ]
    
    def validate_type(self, value):
        """Validate notification type"""
        valid_types = [choice[0] for choice in Notification._meta.get_field('type').choices]
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid notification type. Must be one of: {valid_types}")
        return value


class NotificationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating notifications (mainly for marking as read)
    """
    class Meta:
        model = Notification
        fields = ['is_read']
    
    def update(self, instance, validated_data):
        """Update notification"""
        if 'is_read' in validated_data and validated_data['is_read']:
            instance.mark_as_read()
        return instance


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationPreference model
    """
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = NotificationPreference
        fields = [
            'id',
            'notification_type',
            'notification_type_display',
            'push_enabled',
            'email_enabled',
            'sms_enabled',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'notification_type_display', 'created_at', 'updated_at']


class NotificationPreferenceUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating notification preferences
    """
    class Meta:
        model = NotificationPreference
        fields = ['push_enabled', 'email_enabled', 'sms_enabled']


class DeviceTokenSerializer(serializers.ModelSerializer):
    """
    Serializer for DeviceToken model
    """
    device_type_display = serializers.CharField(source='get_device_type_display', read_only=True)
    token_masked = serializers.SerializerMethodField()
    
    class Meta:
        model = DeviceToken
        fields = [
            'id',
            'token',
            'token_masked',
            'device_type',
            'device_type_display',
            'is_active',
            'last_used',
            'created_at'
        ]
        read_only_fields = [
            'id',
            'token_masked',
            'device_type_display',
            'last_used',
            'created_at'
        ]
    
    def get_token_masked(self, obj):
        """Return masked token for security"""
        if len(obj.token) > 20:
            return obj.token[:10] + "..." + obj.token[-10:]
        return obj.token[:5] + "..."


class DeviceTokenCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating device tokens
    """
    class Meta:
        model = DeviceToken
        fields = ['token', 'device_type']
    
    def validate_device_type(self, value):
        """Validate device type"""
        valid_types = [choice[0] for choice in DeviceToken._meta.get_field('device_type').choices]
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid device type. Must be one of: {valid_types}")
        return value


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationTemplate model
    """
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = NotificationTemplate
        fields = [
            'id',
            'name',
            'notification_type',
            'notification_type_display',
            'title_template',
            'message_template',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'notification_type_display',
            'created_at',
            'updated_at'
        ]


class NotificationLogSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationLog model
    """
    delivery_method_display = serializers.CharField(source='get_delivery_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = NotificationLog
        fields = [
            'id',
            'delivery_method',
            'delivery_method_display',
            'status',
            'status_display',
            'error_message',
            'response_data',
            'attempted_at'
        ]
        read_only_fields = [
            'id',
            'delivery_method_display',
            'status_display',
            'attempted_at'
        ]


class NotificationStatsSerializer(serializers.Serializer):
    """
    Serializer for notification statistics
    """
    total_notifications = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
    notifications_by_type = serializers.DictField()
    recent_notifications = NotificationSerializer(many=True)


class BulkNotificationActionSerializer(serializers.Serializer):
    """
    Serializer for bulk notification actions
    """
    notification_ids = serializers.ListField(
        child=serializers.UUIDField(),
        help_text="List of notification IDs to perform action on"
    )
    action = serializers.ChoiceField(
        choices=['mark_read', 'mark_unread', 'delete'],
        help_text="Action to perform on selected notifications"
    )
    
    def validate_notification_ids(self, value):
        """Validate notification IDs belong to the user"""
        if not value:
            raise serializers.ValidationError("At least one notification ID is required")
        return value


class NotificationPreferenceBulkUpdateSerializer(serializers.Serializer):
    """
    Serializer for bulk updating notification preferences
    """
    preferences = serializers.ListField(
        child=serializers.DictField(),
        help_text="List of preference updates"
    )
    
    def validate_preferences(self, value):
        """Validate preferences data"""
        valid_types = [choice[0] for choice in NotificationPreference._meta.get_field('notification_type').choices]
        
        for pref in value:
            if 'notification_type' not in pref:
                raise serializers.ValidationError("Each preference must have a notification_type")
            
            if pref['notification_type'] not in valid_types:
                raise serializers.ValidationError(f"Invalid notification type: {pref['notification_type']}")
            
            # Validate boolean fields
            for field in ['push_enabled', 'email_enabled', 'sms_enabled']:
                if field in pref and not isinstance(pref[field], bool):
                    raise serializers.ValidationError(f"{field} must be a boolean value")
        
        return value
