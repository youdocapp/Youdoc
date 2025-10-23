from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import MedicalCondition, Surgery, Allergy
from .serializers import (
    MedicalConditionSerializer,
    SurgerySerializer,
    AllergySerializer,
    MedicalConditionCreateSerializer,
    SurgeryCreateSerializer,
    AllergyCreateSerializer
)


# Medical Conditions Views
class MedicalConditionListCreateView(generics.ListCreateAPIView):
    """
    List all medical conditions for the authenticated user or create a new one
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MedicalConditionCreateSerializer
        return MedicalConditionSerializer
    
    def get_queryset(self):
        return MedicalCondition.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """Custom list method to return success response"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': queryset.count()
        }, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        """Custom create method to return success response"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            response_serializer = MedicalConditionSerializer(serializer.instance)
            return Response({
                'success': True,
                'message': 'Medical condition added successfully',
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': True,
            'message': 'Failed to add medical condition',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class MedicalConditionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a medical condition
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MedicalConditionSerializer
    
    def get_queryset(self):
        return MedicalCondition.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """Custom retrieve method"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        """Custom update method"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Medical condition updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': True,
            'message': 'Failed to update medical condition',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Custom delete method"""
        instance = self.get_object()
        instance.delete()
        return Response({
            'success': True,
            'message': 'Medical condition deleted successfully'
        }, status=status.HTTP_200_OK)


# Surgery Views
class SurgeryListCreateView(generics.ListCreateAPIView):
    """
    List all surgeries for the authenticated user or create a new one
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SurgeryCreateSerializer
        return SurgerySerializer
    
    def get_queryset(self):
        return Surgery.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """Custom list method to return success response"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': queryset.count()
        }, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        """Custom create method to return success response"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            response_serializer = SurgerySerializer(serializer.instance)
            return Response({
                'success': True,
                'message': 'Surgery added successfully',
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': True,
            'message': 'Failed to add surgery',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class SurgeryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a surgery
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SurgerySerializer
    
    def get_queryset(self):
        return Surgery.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """Custom retrieve method"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        """Custom update method"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Surgery updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': True,
            'message': 'Failed to update surgery',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Custom delete method"""
        instance = self.get_object()
        instance.delete()
        return Response({
            'success': True,
            'message': 'Surgery deleted successfully'
        }, status=status.HTTP_200_OK)


# Allergy Views
class AllergyListCreateView(generics.ListCreateAPIView):
    """
    List all allergies for the authenticated user or create a new one
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AllergyCreateSerializer
        return AllergySerializer
    
    def get_queryset(self):
        return Allergy.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """Custom list method to return success response"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': queryset.count()
        }, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        """Custom create method to return success response"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            response_serializer = AllergySerializer(serializer.instance)
            return Response({
                'success': True,
                'message': 'Allergy added successfully',
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': True,
            'message': 'Failed to add allergy',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class AllergyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an allergy
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AllergySerializer
    
    def get_queryset(self):
        return Allergy.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """Custom retrieve method"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        """Custom update method"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Allergy updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': True,
            'message': 'Failed to update allergy',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Custom delete method"""
        instance = self.get_object()
        instance.delete()
        return Response({
            'success': True,
            'message': 'Allergy deleted successfully'
        }, status=status.HTTP_200_OK)

