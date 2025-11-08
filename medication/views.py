from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import date, timedelta
from .models import (
    Medication, 
    MedicationReminder, 
    MedicationTaken
)
from .serializers import (
    MedicationSerializer,
    MedicationCreateSerializer,
    MedicationUpdateSerializer,
    MedicationListSerializer,
    MedicationTakenSerializer,
    MedicationTakenCreateSerializer,
    MedicationTakenUpdateSerializer
)


class MedicationListCreateView(generics.ListCreateAPIView):
    """
    List all medications for the authenticated user or create a new medication
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MedicationCreateSerializer
        return MedicationListSerializer
    
    def get_queryset(self):
        """Filter medications by user and optional date parameters"""
        queryset = Medication.objects.filter(user=self.request.user)
        
        # Filter by date if provided (for frontend calendar view)
        date_param = self.request.query_params.get('date')
        if date_param:
            try:
                filter_date = date.fromisoformat(date_param)
                queryset = queryset.filter(
                    Q(start_date__lte=filter_date) & 
                    (Q(end_date__isnull=True) | Q(end_date__gte=filter_date))
                )
            except ValueError:
                pass
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            try:
                start_date_obj = date.fromisoformat(start_date)
                end_date_obj = date.fromisoformat(end_date)
                queryset = queryset.filter(
                    Q(start_date__lte=end_date_obj) & 
                    (Q(end_date__isnull=True) | Q(end_date__gte=start_date_obj))
                )
            except ValueError:
                pass
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create medication for the authenticated user"""
        serializer.save(user=self.request.user)


class MedicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a medication
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return MedicationUpdateSerializer
        return MedicationSerializer
    
    def get_queryset(self):
        return Medication.objects.filter(user=self.request.user)


class MedicationTakenListView(generics.ListCreateAPIView):
    """
    List medication taken records or create a new one
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MedicationTakenCreateSerializer
        return MedicationTakenSerializer
    
    def get_queryset(self):
        """Filter taken records by user and optional parameters"""
        queryset = MedicationTaken.objects.filter(
            medication__user=self.request.user
        )
        
        # Filter by medication if provided
        medication_id = self.request.query_params.get('medication')
        if medication_id:
            queryset = queryset.filter(medication_id=medication_id)
        
        # Filter by date if provided
        date_param = self.request.query_params.get('date')
        if date_param:
            try:
                filter_date = date.fromisoformat(date_param)
                queryset = queryset.filter(date=filter_date)
            except ValueError:
                pass
        
        # Filter by taken status
        taken = self.request.query_params.get('taken')
        if taken is not None:
            queryset = queryset.filter(taken=taken.lower() == 'true')
        
        return queryset.order_by('-date')
    
    def perform_create(self, serializer):
        """Ensure medication belongs to user"""
        medication = serializer.validated_data['medication']
        if medication.user != self.request.user:
            raise permissions.PermissionDenied("You can only create records for your own medications")
        serializer.save()


class MedicationTakenDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a medication taken record
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MedicationTakenUpdateSerializer
    
    def get_queryset(self):
        return MedicationTaken.objects.filter(medication__user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_medication_taken(request, medication_id):
    """
    Toggle medication taken status for today - matches frontend toggleMedicationTaken function
    """
    medication = get_object_or_404(
        Medication, 
        id=medication_id, 
        user=request.user
    )
    
    today = timezone.now().date()
    
    # Get or create taken record for today
    taken_record, created = MedicationTaken.objects.get_or_create(
        medication=medication,
        date=today,
        defaults={'taken': False}
    )
    
    # Toggle the taken status
    taken_record.taken = not taken_record.taken
    taken_record.save()
    
    serializer = MedicationTakenSerializer(taken_record)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def medication_calendar(request):
    """
    Get medication data for calendar view - matches frontend calendar needs
    """
    user = request.user
    month = request.query_params.get('month')
    year = request.query_params.get('year')
    
    if not month or not year:
        return Response(
            {'error': 'Month and year parameters are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        month = int(month)
        year = int(year)
    except ValueError:
        return Response(
            {'error': 'Invalid month or year format'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get medications active in the specified month
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = date(year, month + 1, 1) - timedelta(days=1)
    
    medications = Medication.objects.filter(
        user=user,
        is_active=True,
        start_date__lte=end_date
    ).filter(
        Q(end_date__isnull=True) | Q(end_date__gte=start_date)
    )
    
    calendar_data = {}
    
    for medication in medications:
        # Get taken records for the month
        taken_records = MedicationTaken.objects.filter(
            medication=medication,
            date__range=[start_date, end_date]
        )
        
        # Create a map of dates to taken status
        taken_map = {record.date: record.taken for record in taken_records}
        
        # Add medication to calendar data for each day it's active
        for single_date in [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]:
            if single_date not in calendar_data:
                calendar_data[single_date.isoformat()] = []
            
            # Check if medication is active on this date
            if (medication.start_date <= single_date and 
                (medication.end_date is None or medication.end_date >= single_date)):
                
                calendar_data[single_date.isoformat()].append({
                    'id': str(medication.id),
                    'name': medication.name,
                    'dosage': medication.dosage_display,
                    'time': [rt.time.strftime('%I:%M %p') for rt in medication.reminder_times.filter(is_active=True)],
                    'taken': taken_map.get(single_date, False),
                    'medication_type': medication.medication_type
                })
    
    return Response(calendar_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def today_medications(request):
    """
    Get today's medications - matches frontend dashboard needs
    """
    user = request.user
    today = timezone.now().date()
    
    # Get medications active today
    today_medications = Medication.objects.filter(
        user=user,
        is_active=True,
        start_date__lte=today
    ).filter(
        Q(end_date__isnull=True) | Q(end_date__gte=today)
    )
    
    # Get taken records for today
    taken_records = MedicationTaken.objects.filter(
        medication__in=today_medications,
        date=today
    )
    taken_map = {record.medication_id: record.taken for record in taken_records}
    
    # Format response to match frontend expectations
    medications_data = []
    for medication in today_medications:
        medications_data.append({
            'id': str(medication.id),
            'name': medication.name,
            'dosage': medication.dosage_display,
            'time': [rt.time.strftime('%I:%M %p') for rt in medication.reminder_times.filter(is_active=True)],
            'taken': taken_map.get(medication.id, False),
            'medication_type': medication.medication_type,
            'notes': medication.notes
        })
    
    return Response(medications_data)