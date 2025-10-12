from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User admin configuration for email-based authentication
    """
    list_display = [
        'email', 'full_name', 'mobile', 'is_email_verified', 
        'is_active', 'is_staff', 'date_joined'
    ]
    list_filter = [
        'is_active', 'is_staff', 'is_superuser', 'is_email_verified',
        'gender', 'blood_type', 'date_joined'
    ]
    search_fields = ['email', 'first_name', 'last_name', 'mobile']
    ordering = ['-date_joined']
    
    # Use email as the username field
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {
            'fields': (
                'first_name', 'last_name', 'mobile', 'date_of_birth',
                'gender', 'blood_type', 'height', 'weight'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'
            ),
        }),
        ('Email Verification', {
            'fields': (
                'is_email_verified', 'email_verification_token', 'email_verification_sent_at'
            ),
        }),
        ('Password Reset', {
            'fields': (
                'password_reset_token', 'password_reset_sent_at'
            ),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'password1', 'password2'
            ),
        }),
    )
    
    readonly_fields = [
        'date_joined', 'last_login', 'email_verification_sent_at', 
        'password_reset_sent_at'
    ]
    
    def full_name(self, obj):
        """Display full name"""
        return obj.full_name
    full_name.short_description = 'Full Name'
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related()