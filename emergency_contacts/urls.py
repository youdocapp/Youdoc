from django.urls import path
from . import views

app_name = 'emergency_contacts'

urlpatterns = [
	# Main CRUD endpoints
	path('', views.EmergencyContactListCreateView.as_view(), name='contact-list-create'),
	path('<int:pk>', views.EmergencyContactDetailView.as_view(), name='contact-detail'),
	
	# Special endpoints
	path('primary', views.primary_contact, name='primary-contact'),
	path('set-primary', views.set_primary_contact, name='set-primary-contact'),
	path('stats', views.contact_stats, name='contact-stats'),
	path('bulk-delete', views.bulk_delete_contacts, name='bulk-delete-contacts'),
]
