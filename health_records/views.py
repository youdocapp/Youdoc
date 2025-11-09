from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import HealthRecord
from .serializers import HealthRecordSerializer, HealthRecordListSerializer


class HealthRecordListCreateView(generics.ListCreateAPIView):
    """
    List all health records for the authenticated user or create a new one
    """
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['title', 'description', 'notes']
    ordering_fields = ['date', 'created_at', 'title']
    ordering = ['-date', '-created_at']
    
    def get_queryset(self):
        """Return health records for the authenticated user"""
        queryset = HealthRecord.objects.filter(user=self.request.user).select_related('user')
        
        # Apply additional filters from query parameters
        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        return queryset
    
    def get_serializer_class(self):
        """Use list serializer for GET requests"""
        if self.request.method == 'GET':
            return HealthRecordListSerializer
        return HealthRecordSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a new health record"""
        serializer.save(user=self.request.user)


class HealthRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a health record
    """
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return health records for the authenticated user"""
        return HealthRecord.objects.filter(user=self.request.user).select_related('user')