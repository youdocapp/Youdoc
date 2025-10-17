from django.contrib import admin
from django.utils.html import format_html
from .models import EmergencyContact


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
	"""
	Admin interface for Emergency Contact management.
	"""
	list_display = [
		'name',
		'user_email',
		'relationship',
		'phone_number',
		'email',
		'is_primary_display',
		'created_at'
	]
	list_filter = [
		'is_primary',
		'created_at',
		'updated_at',
		'user__is_active'
	]
	search_fields = [
		'name',
		'phone_number',
		'email',
		'user__email',
		'user__first_name',
		'user__last_name'
	]
	readonly_fields = ['created_at', 'updated_at']
	ordering = ['-is_primary', 'name']
	
	fieldsets = (
		('Contact Information', {
			'fields': ('user', 'name', 'relationship', 'phone_number', 'email')
		}),
		('Settings', {
			'fields': ('is_primary',)
		}),
		('Timestamps', {
			'fields': ('created_at', 'updated_at'),
			'classes': ('collapse',)
		})
	)

	def user_email(self, obj):
		"""
		Display user's email address.
		"""
		return obj.user.email
	user_email.short_description = 'User Email'
	user_email.admin_order_field = 'user__email'

	def is_primary_display(self, obj):
		"""
		Display primary status with color coding.
		"""
		if obj.is_primary:
			return format_html(
				'<span style="color: green; font-weight: bold;">✓ Primary</span>'
			)
		return format_html('<span style="color: gray;">Secondary</span>')
	is_primary_display.short_description = 'Primary Status'
	is_primary_display.admin_order_field = 'is_primary'

	def get_queryset(self, request):
		"""
		Optimize queryset with select_related.
		"""
		return super().get_queryset(request).select_related('user')

	def has_add_permission(self, request):
		"""
		Allow adding emergency contacts.
		"""
		return True

	def has_change_permission(self, request, obj=None):
		"""
		Allow changing emergency contacts.
		"""
		return True

	def has_delete_permission(self, request, obj=None):
		"""
		Allow deleting emergency contacts.
		"""
		return True