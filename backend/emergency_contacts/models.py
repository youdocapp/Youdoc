from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class EmergencyContact(models.Model):
	"""
	Emergency contact information for users.
	Each user can have up to 28 emergency contacts with one primary contact.
	"""
	user = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		related_name='emergency_contacts',
		help_text='The user who owns this emergency contact'
	)
	name = models.CharField(
		max_length=100,
		help_text='Full name of the emergency contact'
	)
	relationship = models.CharField(
		max_length=50,
		blank=True,
		help_text='Relationship to the user (e.g., Spouse, Parent, Friend)'
	)
	phone_number = models.CharField(
		max_length=20,
		help_text='Phone number of the emergency contact'
	)
	email = models.EmailField(
		blank=True,
		help_text='Email address of the emergency contact (optional)'
	)
	is_primary = models.BooleanField(
		default=False,
		help_text='Whether this is the primary emergency contact'
	)
	created_at = models.DateTimeField(
		auto_now_add=True,
		help_text='When this contact was created'
	)
	updated_at = models.DateTimeField(
		auto_now=True,
		help_text='When this contact was last updated'
	)

	class Meta:
		db_table = 'emergency_contacts'
		verbose_name = 'Emergency Contact'
		verbose_name_plural = 'Emergency Contacts'
		ordering = ['-is_primary', 'name']
		constraints = [
			models.UniqueConstraint(
				fields=['user', 'is_primary'],
				condition=models.Q(is_primary=True),
				name='unique_primary_contact_per_user'
			)
		]

	def __str__(self):
		primary_indicator = ' (Primary)' if self.is_primary else ''
		return f'{self.name} - {self.user.email}{primary_indicator}'

	def clean(self):
		"""
		Validate the emergency contact data.
		"""
		super().clean()
		
		# Check contact limit (28 max per user)
		if not self.pk:  # Only check for new contacts
			existing_count = EmergencyContact.objects.filter(user=self.user).count()
			if existing_count >= 28:
				raise ValidationError('Maximum of 28 emergency contacts allowed per user.')

	def save(self, *args, **kwargs):
		"""
		Override save to handle primary contact logic and validation.
		"""
		self.full_clean()
		
		# If setting this contact as primary, unset all other primary contacts for this user
		if self.is_primary:
			EmergencyContact.objects.filter(
				user=self.user,
				is_primary=True
			).exclude(pk=self.pk).update(is_primary=False)
		
		super().save(*args, **kwargs)

	@property
	def display_relationship(self):
		"""
		Return a user-friendly relationship display.
		"""
		return self.relationship if self.relationship else 'Not specified'

	@property
	def contact_info(self):
		"""
		Return formatted contact information.
		"""
		info = f'Phone: {self.phone_number}'
		if self.email:
			info += f', Email: {self.email}'
		return info