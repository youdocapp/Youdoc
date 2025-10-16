from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import HealthRecord


@admin.register(HealthRecord)
class HealthRecordAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'title', 'user', 'type', 'date', 'has_file',
        'created_at'
    ]
    list_filter = [
        'type', 'created_at', 'date',
        ('user', admin.RelatedOnlyFieldListFilter)
    ]
    search_fields = ['title', 'description', 'notes', 'user__email', 'file_name']
    readonly_fields = ['id', 'created_at', 'updated_at', 'file_uri_display']
    raw_id_fields = ['user']
    date_hierarchy = 'date'
    ordering = ['-date', '-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'title', 'type', 'date')
        }),
        ('Content', {
            'fields': ('description', 'notes')
        }),
        ('File Information', {
            'fields': ('file', 'file_uri_display', 'file_name')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_file(self, obj):
        """Display whether the record has a file"""
        return bool(obj.file)
    has_file.boolean = True
    has_file.short_description = 'Has File'
    
    def file_uri_display(self, obj):
        """Display file URI as a clickable link"""
        if obj.file_uri:
            return format_html(
                '<a href="{}" target="_blank">View File</a>',
                obj.file_uri
            )
        return '-'
    file_uri_display.short_description = 'File Link'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('user')