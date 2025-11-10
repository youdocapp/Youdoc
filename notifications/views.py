from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.utils import timezone
import logging
from .models import (
    Notification,
    NotificationPreference,
    DeviceToken,
    NotificationTemplate,
    NotificationType
)
from .serializers import (
    NotificationSerializer,
    NotificationCreateSerializer,
    NotificationUpdateSerializer,
    NotificationPreferenceSerializer,
    NotificationPreferenceUpdateSerializer,
    DeviceTokenSerializer,
    DeviceTokenCreateSerializer,
    NotificationTemplateSerializer,
    NotificationStatsSerializer,
    BulkNotificationActionSerializer,
    NotificationPreferenceBulkUpdateSerializer
)
from .services import (
    NotificationService,
    PushNotificationService,
    MedicationReminderService,
    ArticleNotificationService,
    SyncNotificationService
)


class NotificationPagination(PageNumberPagination):
    """Custom pagination for notifications"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class NotificationListView(generics.ListAPIView):
    """
    List user's notifications with filtering and pagination
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationPagination
    
    def get_queryset(self):
        """Get notifications for the authenticated user"""
        queryset = Notification.objects.filter(user=self.request.user)
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        # Filter by notification type
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(type=notification_type)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset.order_by('-created_at')


class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific notification
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get notifications for the authenticated user"""
        return Notification.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        """Update notification (mainly for marking as read)"""
        instance = self.get_object()
        serializer = NotificationUpdateSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(NotificationSerializer(instance).data)


class NotificationCreateView(generics.CreateAPIView):
    """
    Create a new notification (admin/system use)
    """
    serializer_class = NotificationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """Create notification for the authenticated user"""
        serializer.save(user=self.request.user)


class NotificationStatsView(generics.RetrieveAPIView):
    """
    Get notification statistics for the user
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """Get notification statistics"""
        try:
            user = request.user
            
            # Get total and unread counts
            total_notifications = Notification.objects.filter(user=user).count()
            unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
            
            # Get notifications by type
            notifications_by_type = {}
            try:
                for notification_type, _ in NotificationType.choices:
                    count = Notification.objects.filter(
                        user=user,
                        type=notification_type
                    ).count()
                    notifications_by_type[notification_type] = count
            except Exception as e:
                # If there's an error getting types, use empty dict
                logger = logging.getLogger(__name__)
                logger.warning(f'Error getting notifications by type: {str(e)}')
                notifications_by_type = {}
            
            # Get recent notifications
            recent_notifications = []
            try:
                recent_queryset = Notification.objects.filter(user=user).order_by('-created_at')[:5]
                recent_serializer = NotificationSerializer(recent_queryset, many=True)
                recent_notifications = recent_serializer.data
            except Exception as e:
                # If there's an error serializing recent notifications, use empty list
                logger = logging.getLogger(__name__)
                logger.warning(f'Error serializing recent notifications: {str(e)}')
                recent_notifications = []
            
            stats_data = {
                'total_notifications': total_notifications,
                'unread_notifications': unread_notifications,
                'notifications_by_type': notifications_by_type,
                'recent_notifications': recent_notifications
            }
            
            serializer = NotificationStatsSerializer(stats_data)
            return Response(serializer.data)
            
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f'Error in NotificationStatsView: {str(e)}', exc_info=True)
            # Return default stats instead of 500 error
            return Response({
                'total_notifications': 0,
                'unread_notifications': 0,
                'notifications_by_type': {},
                'recent_notifications': []
            }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, notification_id):
    """
    Mark a specific notification as read
    """
    success = NotificationService.mark_as_read(notification_id, request.user)
    
    if success:
        return Response({'message': 'Notification marked as read'})
    else:
        return Response(
            {'error': 'Notification not found or already read'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    """
    Mark all notifications as read for the user
    """
    try:
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({
            'message': f'Marked {updated_count} notifications as read'
        })
    except Exception as e:
        return Response(
            {'error': 'Failed to mark notifications as read'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_notification_action(request):
    """
    Perform bulk actions on notifications
    """
    serializer = BulkNotificationActionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    notification_ids = serializer.validated_data['notification_ids']
    action = serializer.validated_data['action']
    
    # Get notifications that belong to the user
    notifications = Notification.objects.filter(
        id__in=notification_ids,
        user=request.user
    )
    
    if not notifications.exists():
        return Response(
            {'error': 'No valid notifications found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        if action == 'mark_read':
            updated_count = notifications.update(is_read=True)
            message = f'Marked {updated_count} notifications as read'
        elif action == 'mark_unread':
            updated_count = notifications.update(is_read=False)
            message = f'Marked {updated_count} notifications as unread'
        elif action == 'delete':
            deleted_count = notifications.count()
            notifications.delete()
            message = f'Deleted {deleted_count} notifications'
        
        return Response({'message': message})
        
    except Exception as e:
        return Response(
            {'error': 'Failed to perform bulk action'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class NotificationPreferenceListView(generics.ListCreateAPIView):
    """
    List and create notification preferences
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get preferences for the authenticated user"""
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create preference for the authenticated user"""
        serializer.save(user=self.request.user)


class NotificationPreferenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific notification preference
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get preferences for the authenticated user"""
        return NotificationPreference.objects.filter(user=self.request.user)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_notification_preferences(request):
    """
    Bulk update notification preferences
    """
    serializer = NotificationPreferenceBulkUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    preferences_data = serializer.validated_data['preferences']
    updated_count = 0
    
    try:
        for pref_data in preferences_data:
            preference, created = NotificationPreference.objects.get_or_create(
                user=request.user,
                notification_type=pref_data['notification_type'],
                defaults={
                    'push_enabled': pref_data.get('push_enabled', True),
                    'email_enabled': pref_data.get('email_enabled', False),
                    'sms_enabled': pref_data.get('sms_enabled', False)
                }
            )
            
            if not created:
                # Update existing preference
                preference.push_enabled = pref_data.get('push_enabled', preference.push_enabled)
                preference.email_enabled = pref_data.get('email_enabled', preference.email_enabled)
                preference.sms_enabled = pref_data.get('sms_enabled', preference.sms_enabled)
                preference.save()
            
            updated_count += 1
        
        return Response({
            'message': f'Updated {updated_count} notification preferences'
        })
        
    except Exception as e:
        return Response(
            {'error': 'Failed to update preferences'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class DeviceTokenListView(generics.ListCreateAPIView):
    """
    List and create device tokens
    """
    serializer_class = DeviceTokenSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get device tokens for the authenticated user"""
        return DeviceToken.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create device token for the authenticated user"""
        token = serializer.validated_data['token']
        device_type = serializer.validated_data['device_type']
        
        # Use service to register device token
        success = PushNotificationService.register_device_token(
            user=self.request.user,
            token=token,
            device_type=device_type
        )
        
        if not success:
            raise serializers.ValidationError('Failed to register device token')


class DeviceTokenDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific device token
    """
    serializer_class = DeviceTokenSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get device tokens for the authenticated user"""
        return DeviceToken.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def register_device_token(request):
    """
    Register a device token for push notifications
    """
    serializer = DeviceTokenCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    token = serializer.validated_data['token']
    device_type = serializer.validated_data['device_type']
    
    success = PushNotificationService.register_device_token(
        user=request.user,
        token=token,
        device_type=device_type
    )
    
    if success:
        return Response({'message': 'Device token registered successfully'})
    else:
        return Response(
            {'error': 'Failed to register device token'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class NotificationTemplateListView(generics.ListAPIView):
    """
    List notification templates (admin/system use)
    """
    queryset = NotificationTemplate.objects.filter(is_active=True)
    serializer_class = NotificationTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]


# Test endpoints for development
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def test_medication_reminder(request):
    """
    Test endpoint to create a medication reminder notification
    """
    try:
        notification = NotificationService.create_notification(
            user=request.user,
            notification_type=NotificationType.MEDICATION_REMINDER,
            title='Test Medication Reminder',
            message='This is a test medication reminder notification',
            metadata={'test': True}
        )
        
        # Send the notification
        NotificationService.send_notification(notification)
        
        return Response({
            'message': 'Test medication reminder sent',
            'notification_id': str(notification.id)
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to send test notification: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def test_health_tip(request):
    """
    Test endpoint to create a health tip notification
    """
    try:
        notification = NotificationService.create_notification(
            user=request.user,
            notification_type=NotificationType.HEALTH_TIP,
            title='New Health Tip',
            message='This is a test health tip notification',
            metadata={'test': True}
        )
        
        # Send the notification
        NotificationService.send_notification(notification)
        
        return Response({
            'message': 'Test health tip sent',
            'notification_id': str(notification.id)
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to send test notification: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def test_sync_notification(request):
    """
    Test endpoint to create a sync notification
    """
    try:
        notification = NotificationService.create_notification(
            user=request.user,
            notification_type=NotificationType.SYNC_COMPLETE,
            title='Sync Complete',
            message='Test device data synced successfully',
            metadata={'test': True, 'device_name': 'Test Device'}
        )
        
        # Send the notification
        NotificationService.send_notification(notification)
        
        return Response({
            'message': 'Test sync notification sent',
            'notification_id': str(notification.id)
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to send test notification: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )