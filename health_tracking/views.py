from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q, Avg, Max, Min, Count
from django.utils import timezone
from datetime import datetime, timedelta, date
from .models import (
    HealthMetric, ConnectedDevice, HealthGoal, HealthInsight, 
    HealthDataSnapshot, HealthSyncLog
)
from .serializers import (
    HealthMetricSerializer, ConnectedDeviceSerializer, HealthGoalSerializer,
    HealthInsightSerializer, HealthDataSnapshotSerializer, HealthDataUpdateSerializer,
    HealthTrendSerializer, HealthInsightSummarySerializer, HealthSyncLogSerializer,
    DeviceConnectionSerializer, HealthGoalProgressSerializer
)


class HealthDataView(generics.RetrieveAPIView):
    """Get current health data snapshot"""
    serializer_class = HealthDataSnapshotSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        """Get today's health data snapshot or create one"""
        today = date.today()
        snapshot, created = HealthDataSnapshot.objects.get_or_create(
            user=self.request.user,
            date=today,
            defaults={
                'heart_rate': None,
                'steps': None,
                'distance': None,
                'sleep_hours': None,
                'calories_burned': None,
                'weight': None,
                'blood_pressure_systolic': None,
                'blood_pressure_diastolic': None,
            }
        )
        return snapshot


class HealthDataUpdateView(generics.CreateAPIView):
    """Update health data"""
    serializer_class = HealthDataUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        today = date.today()
        
        # Get or create today's snapshot
        snapshot, created = HealthDataSnapshot.objects.get_or_create(
            user=request.user,
            date=today
        )
        
        # Update snapshot fields
        if 'heartRate' in data:
            snapshot.heart_rate = data['heartRate']
        if 'steps' in data:
            snapshot.steps = data['steps']
        if 'distance' in data:
            snapshot.distance = data['distance']
        if 'sleep' in data:
            snapshot.sleep_hours = data['sleep']
        if 'calories' in data:
            snapshot.calories_burned = data['calories']
        if 'weight' in data:
            snapshot.weight = data['weight']
        if 'bloodPressure' in data:
            bp = data['bloodPressure']
            snapshot.blood_pressure_systolic = bp.get('systolic')
            snapshot.blood_pressure_diastolic = bp.get('diastolic')
        
        snapshot.device_type = data.get('device_type', 'manual')
        snapshot.last_sync = timezone.now()
        snapshot.save()
        
        # Create individual metric records for history
        device_type = data.get('device_type', 'manual')
        timestamp = timezone.now()
        
        for field, value in data.items():
            if field == 'bloodPressure':
                if value:
                    HealthMetric.objects.create(
                        user=request.user,
                        metric_type='bloodPressure_systolic',
                        value=value['systolic'],
                        unit='mmHg',
                        device_type=device_type,
                        timestamp=timestamp
                    )
                    HealthMetric.objects.create(
                        user=request.user,
                        metric_type='bloodPressure_diastolic',
                        value=value['diastolic'],
                        unit='mmHg',
                        device_type=device_type,
                        timestamp=timestamp
                    )
            elif field in ['heartRate', 'steps', 'distance', 'sleep', 'calories', 'weight']:
                metric_type = field
                unit = {
                    'heartRate': 'bpm',
                    'steps': 'steps',
                    'distance': 'km',
                    'sleep': 'hours',
                    'calories': 'kcal',
                    'weight': 'kg'
                }.get(field, '')
                
                HealthMetric.objects.create(
                    user=request.user,
                    metric_type=metric_type,
                    value=value,
                    unit=unit,
                    device_type=device_type,
                    timestamp=timestamp
                )
        
        return Response(HealthDataSnapshotSerializer(snapshot).data, status=status.HTTP_201_CREATED)


class ConnectedDevicesView(generics.ListCreateAPIView):
    """List and create connected devices"""
    serializer_class = ConnectedDeviceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ConnectedDevice.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConnectedDeviceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Manage individual connected device"""
    serializer_class = ConnectedDeviceSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        return ConnectedDevice.objects.filter(user=self.request.user)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_device_connection(request, device_id):
    """Toggle device connection status"""
    try:
        device = ConnectedDevice.objects.get(id=device_id, user=request.user)
    except ConnectedDevice.DoesNotExist:
        return Response({'error': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'POST':
        device.connected = True
        device.last_sync = timezone.now()
        device.save()
        return Response({'connected': True})
    else:  # DELETE
        device.connected = False
        device.last_sync = None
        device.save()
        return Response({'connected': False})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_health_data(request, device_id):
    """Trigger health data sync for a device"""
    try:
        device = ConnectedDevice.objects.get(id=device_id, user=request.user)
    except ConnectedDevice.DoesNotExist:
        return Response({'error': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if not device.connected:
        return Response({'error': 'Device not connected'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create sync log
    sync_log = HealthSyncLog.objects.create(
        user=request.user,
        device=device,
        status='success',  # This would be updated based on actual sync result
        metrics_synced=0
    )
    
    # Update device last sync
    device.last_sync = timezone.now()
    device.save()
    
    return Response({
        'message': 'Sync initiated',
        'sync_id': sync_log.id,
        'last_sync': device.last_sync
    })


class HealthGoalsView(generics.ListCreateAPIView):
    """List and create health goals"""
    serializer_class = HealthGoalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return HealthGoal.objects.filter(user=self.request.user, is_active=True)


class HealthGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Manage individual health goal"""
    serializer_class = HealthGoalSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        return HealthGoal.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_trends(request):
    """Get health trends over time"""
    metric_type = request.query_params.get('metric', 'heartRate')
    days = int(request.query_params.get('days', 30))
    
    start_date = timezone.now().date() - timedelta(days=days)
    
    # Get daily snapshots
    snapshots = HealthDataSnapshot.objects.filter(
        user=request.user,
        date__gte=start_date
    ).order_by('date')
    
    # Map metric types to snapshot fields
    field_mapping = {
        'heartRate': 'heart_rate',
        'steps': 'steps',
        'distance': 'distance',
        'sleep': 'sleep_hours',
        'calories': 'calories_burned',
        'weight': 'weight',
    }
    
    field_name = field_mapping.get(metric_type)
    if not field_name:
        return Response({'error': 'Invalid metric type'}, status=status.HTTP_400_BAD_REQUEST)
    
    trends = []
    for snapshot in snapshots:
        value = getattr(snapshot, field_name)
        if value is not None:
            trends.append({
                'date': snapshot.date,
                'value': value,
                'metric_type': metric_type
            })
    
    serializer = HealthTrendSerializer(trends, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_insights(request):
    """Get health insights and recommendations"""
    insights = HealthInsight.objects.filter(
        user=request.user
    ).order_by('-created_at')[:10]
    
    unread_count = HealthInsight.objects.filter(
        user=request.user,
        is_read=False
    ).count()
    
    summary = {
        'total_insights': insights.count(),
        'unread_insights': unread_count,
        'recent_insights': HealthInsightSerializer(insights, many=True).data
    }
    
    return Response(summary)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_insight_read(request, insight_id):
    """Mark an insight as read"""
    try:
        insight = HealthInsight.objects.get(id=insight_id, user=request.user)
        insight.is_read = True
        insight.save()
        return Response({'message': 'Insight marked as read'})
    except HealthInsight.DoesNotExist:
        return Response({'error': 'Insight not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def goal_progress(request):
    """Get progress towards health goals"""
    goals = HealthGoal.objects.filter(user=request.user, is_active=True)
    today = date.today()
    
    progress_data = []
    for goal in goals:
        # Get today's value for this goal
        try:
            snapshot = HealthDataSnapshot.objects.get(user=request.user, date=today)
            current_value = getattr(snapshot, goal.goal_type, 0) or 0
        except HealthDataSnapshot.DoesNotExist:
            current_value = 0
        
        # Calculate progress
        progress_percentage = min((current_value / goal.target_value) * 100, 100) if goal.target_value > 0 else 0
        
        # Calculate days remaining
        days_remaining = (goal.end_date - today).days if goal.end_date else None
        
        progress_data.append({
            'goal': HealthGoalSerializer(goal).data,
            'current_value': current_value,
            'progress_percentage': progress_percentage,
            'days_remaining': days_remaining,
            'is_on_track': progress_percentage >= 80  # 80% or more is considered on track
        })
    
    return Response(progress_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sync_history(request):
    """Get sync history for connected devices"""
    device_id = request.query_params.get('device_id')
    
    queryset = HealthSyncLog.objects.filter(user=request.user)
    if device_id:
        queryset = queryset.filter(device_id=device_id)
    
    logs = queryset.order_by('-started_at')[:50]  # Last 50 syncs
    serializer = HealthSyncLogSerializer(logs, many=True)
    return Response(serializer.data)