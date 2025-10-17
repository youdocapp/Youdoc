from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    Notification,
    NotificationPreference,
    DeviceToken,
    NotificationTemplate,
    NotificationLog
)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'type',
        'title',
        'is_read',
        'status',
        'created_at',
        'scheduled_for',
        'sent_at'
    ]
    list_filter = [
        'type',
        'status',
        'is_read',
        'created_at',
        'scheduled_for'
    ]
    search_fields = [
        'user__username',
        'user__email',
        'title',
        'message'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'sent_at'
    ]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'type', 'title', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'status', 'scheduled_for', 'sent_at')
        }),
        ('Metadata', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('user')
    
    def has_add_permission(self, request):
        """Allow adding notifications for testing"""
        return True
    
    def has_change_permission(self, request, obj=None):
        """Allow changing notifications"""
        return True
    
    def has_delete_permission(self, request, obj=None):
        """Allow deleting notifications"""
        return True


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'notification_type',
        'push_enabled',
        'email_enabled',
        'sms_enabled',
        'updated_at'
    ]
    list_filter = [
        'notification_type',
        'push_enabled',
        'email_enabled',
        'sms_enabled',
        'updated_at'
    ]
    search_fields = [
        'user__username',
        'user__email'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at'
    ]
    ordering = ['user', 'notification_type']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'notification_type')
        }),
        ('Preferences', {
            'fields': ('push_enabled', 'email_enabled', 'sms_enabled')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('user')


@admin.register(DeviceToken)
class DeviceTokenAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'device_type',
        'token_display',
        'is_active',
        'last_used',
        'created_at'
    ]
    list_filter = [
        'device_type',
        'is_active',
        'created_at',
        'last_used'
    ]
    search_fields = [
        'user__username',
        'user__email',
        'token'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'last_used'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'device_type', 'token')
        }),
        ('Status', {
            'fields': ('is_active', 'last_used')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )
    
    def token_display(self, obj):
        """Display masked token for security"""
        if len(obj.token) > 20:
            return f"{obj.token[:10]}...{obj.token[-10:]}"
        return f"{obj.token[:5]}..."
    token_display.short_description = 'Token'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('user')


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'notification_type',
        'is_active',
        'created_at',
        'updated_at'
    ]
    list_filter = [
        'notification_type',
        'is_active',
        'created_at',
        'updated_at'
    ]
    search_fields = [
        'name',
        'title_template',
        'message_template'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at'
    ]
    ordering = ['notification_type', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'notification_type', 'is_active')
        }),
        ('Templates', {
            'fields': ('title_template', 'message_template')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def has_add_permission(self, request):
        """Allow adding templates"""
        return True
    
    def has_change_permission(self, request, obj=None):
        """Allow changing templates"""
        return True
    
    def has_delete_permission(self, request, obj=None):
        """Allow deleting templates"""
        return True


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = [
        'notification',
        'delivery_method',
        'status',
        'attempted_at',
        'error_display'
    ]
    list_filter = [
        'delivery_method',
        'status',
        'attempted_at'
    ]
    search_fields = [
        'notification__title',
        'notification__user__username',
        'error_message'
    ]
    readonly_fields = [
        'id',
        'attempted_at'
    ]
    ordering = ['-attempted_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'notification', 'delivery_method', 'status')
        }),
        ('Details', {
            'fields': ('error_message', 'response_data')
        }),
        ('Timestamps', {
            'fields': ('attempted_at',),
            'classes': ('collapse',)
        })
    )
    
    def error_display(self, obj):
        """Display error message if any"""
        if obj.error_message:
            return format_html(
                '<span style="color: red;">{}</span>',
                obj.error_message[:50] + '...' if len(obj.error_message) > 50 else obj.error_message
            )
        return '-'
    error_display.short_description = 'Error'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('notification__user')
    
    def has_add_permission(self, request):
        """Don't allow adding logs manually"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Don't allow changing logs"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Allow deleting old logs"""
        return True


# Custom admin actions
@admin.action(description='Mark selected notifications as read')
def mark_notifications_read(modeladmin, request, queryset):
    """Admin action to mark notifications as read"""
    updated = queryset.update(is_read=True)
    modeladmin.message_user(request, f'{updated} notifications marked as read.')


@admin.action(description='Mark selected notifications as unread')
def mark_notifications_unread(modeladmin, request, queryset):
    """Admin action to mark notifications as unread"""
    updated = queryset.update(is_read=False)
    modeladmin.message_user(request, f'{updated} notifications marked as unread.')


@admin.action(description='Send selected notifications')
def send_notifications(modeladmin, request, queryset):
    """Admin action to send pending notifications"""
    from .services import NotificationService
    
    sent_count = 0
    for notification in queryset.filter(status='pending'):
        if NotificationService.send_notification(notification):
            sent_count += 1
    
    modeladmin.message_user(request, f'{sent_count} notifications sent successfully.')


# Add actions to NotificationAdmin
NotificationAdmin.actions = [
    mark_notifications_read,
    mark_notifications_unread,
    send_notifications
]


# Custom admin site configuration
admin.site.site_header = "YouDoc Notifications Admin"
admin.site.site_title = "YouDoc Notifications"
admin.site.index_title = "Notification Management"