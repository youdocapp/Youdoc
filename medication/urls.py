from django.urls import path
from . import views

app_name = 'medication'

urlpatterns = [
    # Medication CRUD operations
    path('', views.MedicationListCreateView.as_view(), name='medication-list-create'),
    path('/<str:pk>', views.MedicationDetailView.as_view(), name='medication-detail'),
    
    # Medication taken records
    path('/taken', views.MedicationTakenListView.as_view(), name='medication-taken-list'),
    path('/taken/<uuid:pk>', views.MedicationTakenDetailView.as_view(), name='medication-taken-detail'),
    
    # Frontend-specific endpoints
    path('/<str:medication_id>/toggle-taken', views.toggle_medication_taken, name='toggle-medication-taken'),
    path('/calendar', views.medication_calendar, name='medication-calendar'),
    path('/today', views.today_medications, name='today-medications'),
]