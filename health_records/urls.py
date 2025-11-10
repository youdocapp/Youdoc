from django.urls import path
from . import views

app_name = 'health_records'

urlpatterns = [
    # Health Records CRUD
    path('', views.HealthRecordListCreateView.as_view(), name='health-record-list-create'),
    path('<str:pk>/', views.HealthRecordDetailView.as_view(), name='health-record-detail'),
]