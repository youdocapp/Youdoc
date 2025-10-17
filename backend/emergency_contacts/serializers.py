from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import EmergencyContact


class EmergencyContactSerializer(serializers.ModelSerializer):
	"""
	Serializer for Emergency Contact model.
	"""
	user = serializers.HiddenField(default=serializers.CurrentUserDefault())
	display_relationship = serializers.ReadOnlyField()
	contact_info = serializers.ReadOnlyField()
	
	class Meta:
		model = EmergencyContact
		fields = [
			'id',
			'user',
			'name',
			'relationship',
			'phone_number',
			'email',
			'is_primary',
			'display_relationship',
			'contact_info',
			'created_at',
			'updated_at'
		]
		read_only_fields = ['id', 'created_at', 'updated_at']

	def validate_name(self, value):
		"""
		Validate the name field.
		"""
		if not value or not value.strip():
			raise serializers.ValidationError('Name is required and cannot be empty.')
		
		if len(value.strip()) < 2:
			raise serializers.ValidationError('Name must be at least 2 characters long.')
		
		return value.strip()

	def validate_phone_number(self, value):
		"""
		Validate the phone number field.
		"""
		if not value or not value.strip():
			raise serializers.ValidationError('Phone number is required and cannot be empty.')
		
		# Basic phone number validation (allows various formats)
		import re
		phone_pattern = r'^[\+]?[1-9][\d]{0,15}$'
		cleaned_phone = re.sub(r'[\s\-\(\)]', '', value)
		
		if not re.match(phone_pattern, cleaned_phone):
			raise serializers.ValidationError(
				'Please enter a valid phone number. Only digits, spaces, hyphens, parentheses, and + are allowed.'
			)
		
		return value.strip()

	def validate_email(self, value):
		"""
		Validate the email field (optional).
		"""
		if value and not value.strip():
			return None
		return value.strip() if value else None

	def validate_relationship(self, value):
		"""
		Validate the relationship field (optional).
		"""
		if value and not value.strip():
			return None
		return value.strip() if value else None

	def validate(self, attrs):
		"""
		Cross-field validation.
		"""
		user = attrs.get('user') or self.instance.user if self.instance else None
		
		if not user:
			raise serializers.ValidationError('User is required.')
		
		# Check contact limit for new contacts
		if not self.instance:  # Creating new contact
			existing_count = EmergencyContact.objects.filter(user=user).count()
			if existing_count >= 28:
				raise serializers.ValidationError(
					'Maximum of 28 emergency contacts allowed per user.'
				)
		
		# Validate primary contact logic
		is_primary = attrs.get('is_primary', False)
		if is_primary:
			# Check if another contact is already primary
			existing_primary = EmergencyContact.objects.filter(
				user=user,
				is_primary=True
			).exclude(pk=self.instance.pk if self.instance else None)
			
			if existing_primary.exists():
				# This will be handled in the model's save method
				pass
		
		return attrs


class EmergencyContactCreateSerializer(EmergencyContactSerializer):
	"""
	Serializer specifically for creating emergency contacts.
	"""
	class Meta(EmergencyContactSerializer.Meta):
		fields = [
			'name',
			'relationship',
			'phone_number',
			'email',
			'is_primary'
		]


class EmergencyContactUpdateSerializer(EmergencyContactSerializer):
	"""
	Serializer specifically for updating emergency contacts.
	"""
	class Meta(EmergencyContactSerializer.Meta):
		fields = [
			'name',
			'relationship',
			'phone_number',
			'email',
			'is_primary'
		]


class SetPrimaryContactSerializer(serializers.Serializer):
	"""
	Serializer for setting a contact as primary.
	"""
	contact_id = serializers.IntegerField()

	def validate_contact_id(self, value):
		"""
		Validate that the contact exists and belongs to the user.
		"""
		user = self.context['request'].user
		try:
			contact = EmergencyContact.objects.get(id=value, user=user)
		except EmergencyContact.DoesNotExist:
			raise serializers.ValidationError(
				'Emergency contact not found or does not belong to you.'
			)
		return value


class EmergencyContactListSerializer(serializers.ModelSerializer):
	"""
	Lightweight serializer for listing emergency contacts.
	"""
	display_relationship = serializers.ReadOnlyField()
	
	class Meta:
		model = EmergencyContact
		fields = [
			'id',
			'name',
			'relationship',
			'display_relationship',
			'phone_number',
			'email',
			'is_primary',
			'created_at'
		]
