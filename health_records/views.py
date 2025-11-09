from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend

from .models import HealthRecord
from .serializers import HealthRecordSerializer, HealthRecordListSerializer


class HealthRecordListCreateView(generics.ListCreateAPIView):
    """
    List all health records for the authenticated user or create a new one
    """
    authentication_classes = [JWTAuthentication]
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['title', 'description', 'notes']
    ordering_fields = ['date', 'created_at', 'title']
    ordering = ['-date', '-created_at']
    
    def dispatch(self, request, *args, **kwargs):
        """Debug logging for request headers"""
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f'🔍 Health Records {request.method} Request Headers:')
        logger.info(f'  Authorization: {request.headers.get("Authorization", "NOT FOUND")}')
        logger.info(f'  HTTP_AUTHORIZATION: {request.META.get("HTTP_AUTHORIZATION", "NOT FOUND")}')
        logger.info(f'  All headers: {dict(request.headers)}')
        return super().dispatch(request, *args, **kwargs)
    
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
    
    def create(self, request, *args, **kwargs):
        """Override create to return proper response"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            # Log the error for debugging
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e), 'detail': 'Failed to create health record'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class HealthRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a health record
    """
    authentication_classes = [JWTAuthentication]
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return health records for the authenticated user"""
        return HealthRecord.objects.filter(user=self.request.user).select_related('user')