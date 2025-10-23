from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Medication, 
    MedicationReminder, 
    MedicationTaken
)


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'user', 'medication_type', 'dosage_display', 
        'frequency', 'start_date', 'end_date', 'is_active', 'reminder_enabled', 'reminder_count'
    ]
    list_filter = [
        'medication_type', 'frequency', 'is_active', 'reminder_enabled',
        'start_date', 'end_date', 'created_at'
    ]
    search_fields = ['name', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'created_at', 'updated_at', 'dosage_display', 'reminder_count']
    raw_id_fields = ['user']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'name', 'medication_type')
        }),
        ('Dosage Information', {
            'fields': ('dosage_amount', 'dosage_unit', 'dosage_display')
        }),
        ('Schedule', {
            'fields': ('frequency', 'start_date', 'end_date')
        }),
        ('Settings', {
            'fields': ('reminder_enabled', 'is_active', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
    
    def reminder_count(self, obj):
        """Show count of active reminders"""
        count = obj.reminder_times.filter(is_active=True).count()
        if count > 0:
            return format_html(
                '<span style="color: green; font-weight: bold;">{}</span>',
                count
            )
        return format_html(
            '<span style="color: red;">0</span>'
        )
    reminder_count.short_description = 'Reminders'


@admin.register(MedicationReminder)
class MedicationReminderAdmin(admin.ModelAdmin):
    list_display = ['medication', 'time', 'time_display', 'is_active', 'created_at']
    list_filter = ['is_active', 'time', 'created_at']
    search_fields = ['medication__name', 'medication__user__email']
    raw_id_fields = ['medication']
    ordering = ['medication__name', 'time']
    
    def time_display(self, obj):
        return obj.time.strftime('%I:%M %p')
    time_display.short_description = 'Time (12h)'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('medication', 'medication__user')


@admin.register(MedicationTaken)
class MedicationTakenAdmin(admin.ModelAdmin):
    list_display = [
        'medication', 'date', 'taken_status', 'created_at', 'updated_at'
    ]
    list_filter = ['taken', 'date', 'created_at']
    search_fields = [
        'medication__name', 'medication__user__email'
    ]
    raw_id_fields = ['medication']
    date_hierarchy = 'date'
    ordering = ['-date', 'medication__name']
    
    def taken_status(self, obj):
        """Show taken status with color coding"""
        if obj.taken:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Taken</span>'
            )
        return format_html(
            '<span style="color: red;">✗ Not Taken</span>'
        )
    taken_status.short_description = 'Status'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('medication', 'medication__user')