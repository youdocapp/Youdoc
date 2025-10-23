from django.urls import path, include
from . import views

app_name = 'medical_history'

urlpatterns = [
    # Medical Conditions
    path('conditions/', views.MedicalConditionListCreateView.as_view(), name='condition_list_create'),
    path('conditions/<uuid:pk>/', views.MedicalConditionDetailView.as_view(), name='condition_detail'),
    
    # Surgeries
    path('surgeries/', views.SurgeryListCreateView.as_view(), name='surgery_list_create'),
    path('surgeries/<uuid:pk>/', views.SurgeryDetailView.as_view(), name='surgery_detail'),
    
    # Allergies
    path('allergies/', views.AllergyListCreateView.as_view(), name='allergy_list_create'),
    path('allergies/<uuid:pk>/', views.AllergyDetailView.as_view(), name='allergy_detail'),
]
