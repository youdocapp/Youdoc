from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid
import json


class NotificationType(models.TextChoices):
    MEDICATION = 'medication', 'Medication Reminder'
    HEALTH_TIP = 'health-tip', 'Health Tip'
    SYNC = 'sync', 'Sync Complete'
    GENERAL = 'general', 'General'


class NotificationStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    SENT = 'sent', 'Sent'
    DELIVERED = 'delivered', 'Delivered'
    FAILED = 'failed', 'Failed'


class Notification(models.Model):
    """
    Core notification model for storing all user notifications
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the notification"
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="User who will receive this notification"
    )
    
    type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        help_text="Type of notification"
    )
    
    title = models.CharField(
        max_length=200,
        help_text="Notification title"
    )
    
    message = models.TextField(
        help_text="Notification message content"
    )
    
    is_read = models.BooleanField(
        default=False,
        help_text="Whether the user has read this notification"
    )
    
    status = models.CharField(
        max_length=20,
        choices=NotificationStatus.choices,
        default=NotificationStatus.PENDING,
        help_text="Delivery status of the notification"
    )
    
    scheduled_for = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the notification should be sent (null for immediate)"
    )
    
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the notification was actually sent"
    )
    
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional data related to the notification (e.g., medication_id, article_id)"
    )
    
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When the notification was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the notification was last updated"
    )
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['type', 'status']),
            models.Index(fields=['scheduled_for']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.type})"
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.is_read = True
        self.save(update_fields=['is_read', 'updated_at'])
    
    def mark_as_sent(self):
        """Mark notification as sent"""
        self.status = NotificationStatus.SENT
        self.sent_at = timezone.now()
        self.save(update_fields=['status', 'sent_at', 'updated_at'])


class NotificationPreference(models.Model):
    """
    User notification preferences for different notification types
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the preference"
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_preference_objects',
        help_text="User these preferences belong to"
    )
    
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        help_text="Type of notification this preference applies to"
    )
    
    push_enabled = models.BooleanField(
        default=True,
        help_text="Whether push notifications are enabled for this type"
    )
    
    email_enabled = models.BooleanField(
        default=False,
        help_text="Whether email notifications are enabled for this type"
    )
    
    sms_enabled = models.BooleanField(
        default=False,
        help_text="Whether SMS notifications are enabled for this type"
    )
    
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When the preference was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the preference was last updated"
    )
    
    class Meta:
        db_table = 'notification_preferences'
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'
        unique_together = ['user', 'notification_type']
        ordering = ['user', 'notification_type']
    
    def __str__(self):
        return f"{self.user.username} - {self.notification_type} preferences"


class DeviceToken(models.Model):
    """
    Store device tokens for push notifications
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the device token"
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='device_tokens',
        help_text="User this device belongs to"
    )
    
    token = models.CharField(
        max_length=255,
        unique=True,
        help_text="Device token for push notifications"
    )
    
    device_type = models.CharField(
        max_length=20,
        choices=[
            ('ios', 'iOS'),
            ('android', 'Android'),
            ('web', 'Web'),
        ],
        help_text="Type of device"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this device token is active"
    )
    
    last_used = models.DateTimeField(
        default=timezone.now,
        help_text="When this token was last used"
    )
    
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When the token was registered"
    )
    
    class Meta:
        db_table = 'device_tokens'
        verbose_name = 'Device Token'
        verbose_name_plural = 'Device Tokens'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['token']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.device_type} ({self.token[:20]}...)"


class NotificationTemplate(models.Model):
    """
    Templates for different types of notifications
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the template"
    )
    
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Template name"
    )
    
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        help_text="Type of notification this template is for"
    )
    
    title_template = models.CharField(
        max_length=200,
        help_text="Title template with placeholders (e.g., 'Time to take {medication_name}')"
    )
    
    message_template = models.TextField(
        help_text="Message template with placeholders"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this template is active"
    )
    
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When the template was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the template was last updated"
    )
    
    class Meta:
        db_table = 'notification_templates'
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'
        ordering = ['notification_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.notification_type})"
    
    def render(self, **kwargs):
        """Render template with provided data"""
        try:
            title = self.title_template.format(**kwargs)
            message = self.message_template.format(**kwargs)
            return title, message
        except KeyError as e:
            raise ValueError(f"Missing template variable: {e}")


class NotificationLog(models.Model):
    """
    Log of notification delivery attempts and results
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the log entry"
    )
    
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name='delivery_logs',
        help_text="Notification this log entry is for"
    )
    
    delivery_method = models.CharField(
        max_length=20,
        choices=[
            ('push', 'Push Notification'),
            ('email', 'Email'),
            ('sms', 'SMS'),
        ],
        help_text="Method used to deliver the notification"
    )
    
    status = models.CharField(
        max_length=20,
        choices=NotificationStatus.choices,
        help_text="Delivery status"
    )
    
    error_message = models.TextField(
        blank=True,
        null=True,
        help_text="Error message if delivery failed"
    )
    
    response_data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Response data from delivery service"
    )
    
    attempted_at = models.DateTimeField(
        default=timezone.now,
        help_text="When the delivery was attempted"
    )
    
    class Meta:
        db_table = 'notification_logs'
        verbose_name = 'Notification Log'
        verbose_name_plural = 'Notification Logs'
        ordering = ['-attempted_at']
    
    def __str__(self):
        return f"{self.notification.title} - {self.delivery_method} ({self.status})"