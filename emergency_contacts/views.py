from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import EmergencyContact
from .serializers import (
	EmergencyContactSerializer,
	EmergencyContactCreateSerializer,
	EmergencyContactUpdateSerializer,
	EmergencyContactListSerializer,
	SetPrimaryContactSerializer
)


class EmergencyContactListCreateView(generics.ListCreateAPIView):
	"""
	View for listing and creating emergency contacts.
	"""
	permission_classes = [IsAuthenticated]
	
	def get_queryset(self):
		"""
		Return emergency contacts for the authenticated user.
		"""
		return EmergencyContact.objects.filter(user=self.request.user)
	
	def get_serializer_class(self):
		"""
		Return appropriate serializer based on request method.
		"""
		if self.request.method == 'POST':
			return EmergencyContactCreateSerializer
		return EmergencyContactListSerializer
	
	def perform_create(self, serializer):
		"""
		Create a new emergency contact for the authenticated user.
		"""
		serializer.save(user=self.request.user)
	
	def list(self, request, *args, **kwargs):
		"""
		List emergency contacts with additional metadata.
		"""
		queryset = self.get_queryset()
		serializer = self.get_serializer(queryset, many=True)
		
		# Add metadata about contact limits
		total_contacts = queryset.count()
		max_contacts = 28
		remaining_slots = max_contacts - total_contacts
		
		response_data = {
			'contacts': serializer.data,
			'metadata': {
				'total_contacts': total_contacts,
				'max_contacts': max_contacts,
				'remaining_slots': remaining_slots,
				'can_add_more': remaining_slots > 0
			}
		}
		
		return Response(response_data)


class EmergencyContactDetailView(generics.RetrieveUpdateDestroyAPIView):
	"""
	View for retrieving, updating, and deleting a specific emergency contact.
	"""
	permission_classes = [IsAuthenticated]
	
	def get_queryset(self):
		"""
		Return emergency contacts for the authenticated user.
		"""
		return EmergencyContact.objects.filter(user=self.request.user)
	
	def get_serializer_class(self):
		"""
		Return appropriate serializer based on request method.
		"""
		if self.request.method in ['PUT', 'PATCH']:
			return EmergencyContactUpdateSerializer
		return EmergencyContactSerializer
	
	def perform_update(self, serializer):
		"""
		Update the emergency contact.
		"""
		serializer.save()
	
	def destroy(self, request, *args, **kwargs):
		"""
		Delete the emergency contact.
		"""
		instance = self.get_object()
		contact_name = instance.name
		self.perform_destroy(instance)
		
		return Response(
			{'message': f'Emergency contact "{contact_name}" has been deleted successfully.'},
			status=status.HTTP_200_OK
		)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_primary_contact(request):
	"""
	Set a specific emergency contact as the primary contact.
	"""
	serializer = SetPrimaryContactSerializer(
		data=request.data,
		context={'request': request}
	)
	
	if serializer.is_valid():
		contact_id = serializer.validated_data['contact_id']
		
		with transaction.atomic():
			# Get the contact
			contact = get_object_or_404(
				EmergencyContact,
				id=contact_id,
				user=request.user
			)
			
			# Unset all other primary contacts for this user
			EmergencyContact.objects.filter(
				user=request.user,
				is_primary=True
			).update(is_primary=False)
			
			# Set this contact as primary
			contact.is_primary = True
			contact.save()
		
		return Response(
			{
				'message': f'"{contact.name}" has been set as your primary emergency contact.',
				'contact': EmergencyContactSerializer(contact).data
			},
			status=status.HTTP_200_OK
		)
	
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def primary_contact(request):
	"""
	Get the primary emergency contact for the authenticated user.
	"""
	try:
		primary_contact = EmergencyContact.objects.get(
			user=request.user,
			is_primary=True
		)
		serializer = EmergencyContactSerializer(primary_contact)
		return Response(serializer.data)
	except EmergencyContact.DoesNotExist:
		return Response(
			{'message': 'No primary emergency contact found.'},
			status=status.HTTP_404_NOT_FOUND
		)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contact_stats(request):
	"""
	Get statistics about the user's emergency contacts.
	"""
	user_contacts = EmergencyContact.objects.filter(user=request.user)
	
	stats = {
		'total_contacts': user_contacts.count(),
		'max_contacts': 28,
		'remaining_slots': 28 - user_contacts.count(),
		'has_primary': user_contacts.filter(is_primary=True).exists(),
		'primary_contact_name': None
	}
	
	# Get primary contact name if exists
	primary_contact = user_contacts.filter(is_primary=True).first()
	if primary_contact:
		stats['primary_contact_name'] = primary_contact.name
	
	return Response(stats)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_delete_contacts(request):
	"""
	Delete multiple emergency contacts at once.
	"""
	contact_ids = request.data.get('contact_ids', [])
	
	if not contact_ids:
		return Response(
			{'error': 'No contact IDs provided.'},
			status=status.HTTP_400_BAD_REQUEST
		)
	
	if not isinstance(contact_ids, list):
		return Response(
			{'error': 'contact_ids must be a list.'},
			status=status.HTTP_400_BAD_REQUEST
		)
	
	# Get contacts that belong to the user
	contacts_to_delete = EmergencyContact.objects.filter(
		id__in=contact_ids,
		user=request.user
	)
	
	if not contacts_to_delete.exists():
		return Response(
			{'error': 'No valid contacts found to delete.'},
			status=status.HTTP_404_NOT_FOUND
		)
	
	# Get contact names before deletion
	deleted_names = list(contacts_to_delete.values_list('name', flat=True))
	
	# Delete the contacts
	deleted_count = contacts_to_delete.count()
	contacts_to_delete.delete()
	
	return Response(
		{
			'message': f'Successfully deleted {deleted_count} emergency contact(s).',
			'deleted_contacts': deleted_names,
			'deleted_count': deleted_count
		},
		status=status.HTTP_200_OK
	)