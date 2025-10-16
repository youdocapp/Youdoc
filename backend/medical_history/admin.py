from django.contrib import admin
from .models import MedicalCondition, Surgery, Allergy


@admin.register(MedicalCondition)
class MedicalConditionAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'status', 'diagnosed_date', 'created_at']
    list_filter = ['status', 'diagnosed_date', 'created_at']
    search_fields = ['name', 'user__email', 'user__first_name', 'user__last_name', 'notes']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-diagnosed_date', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'diagnosed_date', 'status')
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Surgery)
class SurgeryAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'date', 'hospital', 'surgeon', 'created_at']
    list_filter = ['date', 'created_at']
    search_fields = ['name', 'user__email', 'user__first_name', 'user__last_name', 'hospital', 'surgeon', 'notes']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-date', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'date')
        }),
        ('Medical Details', {
            'fields': ('hospital', 'surgeon')
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Allergy)
class AllergyAdmin(admin.ModelAdmin):
    list_display = ['allergen', 'user', 'severity', 'reaction', 'created_at']
    list_filter = ['severity', 'created_at']
    search_fields = ['allergen', 'user__email', 'user__first_name', 'user__last_name', 'reaction', 'notes']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-severity', 'allergen']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'allergen', 'reaction', 'severity')
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )