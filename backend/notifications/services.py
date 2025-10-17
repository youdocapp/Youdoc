import logging
from typing import Dict, List, Optional, Any
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()
from .models import (
    Notification, 
    NotificationPreference, 
    DeviceToken, 
    NotificationTemplate,
    NotificationLog,
    NotificationType,
    NotificationStatus
)

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Core service for managing notifications
    """
    
    @staticmethod
    def create_notification(
        user,
        notification_type: str,
        title: str,
        message: str,
        scheduled_for: Optional[timezone.datetime] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """
        Create a new notification for a user
        
        Args:
            user: User to send notification to
            notification_type: Type of notification
            title: Notification title
            message: Notification message
            scheduled_for: When to send (None for immediate)
            metadata: Additional data
            
        Returns:
            Created notification instance
        """
        notification = Notification.objects.create(
            user=user,
            type=notification_type,
            title=title,
            message=message,
            scheduled_for=scheduled_for,
            metadata=metadata or {}
        )
        
        logger.info(f"Created notification {notification.id} for user {user.username}")
        return notification
    
    @staticmethod
    def create_notification_from_template(
        user,
        template_name: str,
        scheduled_for: Optional[timezone.datetime] = None,
        **template_data
    ) -> Optional[Notification]:
        """
        Create notification from template
        
        Args:
            user: User to send notification to
            template_name: Name of the template
            scheduled_for: When to send (None for immediate)
            **template_data: Data to fill template placeholders
            
        Returns:
            Created notification or None if template not found
        """
        try:
            template = NotificationTemplate.objects.get(
                name=template_name,
                is_active=True
            )
            
            title, message = template.render(**template_data)
            
            return NotificationService.create_notification(
                user=user,
                notification_type=template.notification_type,
                title=title,
                message=message,
                scheduled_for=scheduled_for,
                metadata=template_data
            )
        except NotificationTemplate.DoesNotExist:
            logger.error(f"Template {template_name} not found")
            return None
        except ValueError as e:
            logger.error(f"Template rendering error: {e}")
            return None
    
    @staticmethod
    def send_notification(notification: Notification) -> bool:
        """
        Send a notification to the user
        
        Args:
            notification: Notification to send
            
        Returns:
            True if sent successfully, False otherwise
        """
        try:
            # Check user preferences
            preferences = NotificationPreference.objects.filter(
                user=notification.user,
                notification_type=notification.type
            ).first()
            
            if not preferences:
                # Create default preferences if none exist
                preferences = NotificationPreference.objects.create(
                    user=notification.user,
                    notification_type=notification.type,
                    push_enabled=True,
                    email_enabled=False,
                    sms_enabled=False
                )
            
            success = False
            
            # Send push notification if enabled
            if preferences.push_enabled:
                if PushNotificationService.send_push_notification(notification):
                    success = True
            
            # Send email if enabled
            if preferences.email_enabled:
                if EmailNotificationService.send_email_notification(notification):
                    success = True
            
            # Send SMS if enabled
            if preferences.sms_enabled:
                if SMSNotificationService.send_sms_notification(notification):
                    success = True
            
            if success:
                notification.mark_as_sent()
                logger.info(f"Successfully sent notification {notification.id}")
                return True
            else:
                notification.status = NotificationStatus.FAILED
                notification.save(update_fields=['status'])
                logger.error(f"Failed to send notification {notification.id}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending notification {notification.id}: {e}")
            notification.status = NotificationStatus.FAILED
            notification.save(update_fields=['status'])
            return False
    
    @staticmethod
    def mark_as_read(notification_id: str, user) -> bool:
        """
        Mark notification as read
        
        Args:
            notification_id: ID of notification to mark as read
            user: User making the request
            
        Returns:
            True if successful, False otherwise
        """
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=user
            )
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            logger.error(f"Notification {notification_id} not found for user {user.username}")
            return False
    
    @staticmethod
    def get_user_notifications(
        user,
        limit: int = 50,
        offset: int = 0,
        unread_only: bool = False
    ) -> List[Notification]:
        """
        Get notifications for a user
        
        Args:
            user: User to get notifications for
            limit: Maximum number of notifications to return
            offset: Number of notifications to skip
            unread_only: Only return unread notifications
            
        Returns:
            List of notifications
        """
        queryset = Notification.objects.filter(user=user)
        
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        return list(queryset[offset:offset + limit])
    
    @staticmethod
    def get_unread_count(user) -> int:
        """
        Get count of unread notifications for user
        
        Args:
            user: User to get count for
            
        Returns:
            Number of unread notifications
        """
        return Notification.objects.filter(user=user, is_read=False).count()


class PushNotificationService:
    """
    Service for handling push notifications
    """
    
    @staticmethod
    def send_push_notification(notification: Notification) -> bool:
        """
        Send push notification to user's devices
        
        Args:
            notification: Notification to send
            
        Returns:
            True if sent successfully, False otherwise
        """
        try:
            # Get active device tokens for user
            device_tokens = DeviceToken.objects.filter(
                user=notification.user,
                is_active=True
            )
            
            if not device_tokens.exists():
                logger.warning(f"No active device tokens for user {notification.user.username}")
                return False
            
            # For now, we'll simulate push notification sending
            # In production, integrate with FCM/APNS
            success_count = 0
            
            for device_token in device_tokens:
                try:
                    # Simulate push notification sending
                    # TODO: Replace with actual FCM/APNS implementation
                    result = PushNotificationService._send_to_device(
                        device_token.token,
                        device_token.device_type,
                        notification.title,
                        notification.message,
                        notification.metadata
                    )
                    
                    if result['success']:
                        success_count += 1
                        # Log successful delivery
                        NotificationLog.objects.create(
                            notification=notification,
                            delivery_method='push',
                            status=NotificationStatus.DELIVERED,
                            response_data=result
                        )
                    else:
                        # Log failed delivery
                        NotificationLog.objects.create(
                            notification=notification,
                            delivery_method='push',
                            status=NotificationStatus.FAILED,
                            error_message=result.get('error', 'Unknown error'),
                            response_data=result
                        )
                        
                except Exception as e:
                    logger.error(f"Error sending to device {device_token.token}: {e}")
                    NotificationLog.objects.create(
                        notification=notification,
                        delivery_method='push',
                        status=NotificationStatus.FAILED,
                        error_message=str(e)
                    )
            
            return success_count > 0
            
        except Exception as e:
            logger.error(f"Error in push notification service: {e}")
            return False
    
    @staticmethod
    def _send_to_device(token: str, device_type: str, title: str, message: str, data: Dict) -> Dict:
        """
        Send push notification to a specific device
        
        Args:
            token: Device token
            device_type: Type of device (ios/android/web)
            title: Notification title
            message: Notification message
            data: Additional data
            
        Returns:
            Result dictionary with success status and response data
        """
        # TODO: Implement actual FCM/APNS integration
        # For now, simulate successful sending
        logger.info(f"Simulating push notification to {device_type} device: {title}")
        
        return {
            'success': True,
            'message_id': f"sim_{timezone.now().timestamp()}",
            'device_type': device_type,
            'token': token[:20] + "..."
        }
    
    @staticmethod
    def register_device_token(user, token: str, device_type: str) -> bool:
        """
        Register a device token for push notifications
        
        Args:
            user: User to register token for
            token: Device token
            device_type: Type of device
            
        Returns:
            True if registered successfully, False otherwise
        """
        try:
            device_token, created = DeviceToken.objects.get_or_create(
                token=token,
                defaults={
                    'user': user,
                    'device_type': device_type,
                    'is_active': True
                }
            )
            
            if not created:
                # Update existing token
                device_token.user = user
                device_token.device_type = device_type
                device_token.is_active = True
                device_token.last_used = timezone.now()
                device_token.save()
            
            logger.info(f"Registered device token for user {user.username}")
            return True
            
        except Exception as e:
            logger.error(f"Error registering device token: {e}")
            return False


class EmailNotificationService:
    """
    Service for handling email notifications
    """
    
    @staticmethod
    def send_email_notification(notification: Notification) -> bool:
        """
        Send email notification to user
        
        Args:
            notification: Notification to send
            
        Returns:
            True if sent successfully, False otherwise
        """
        try:
            # TODO: Implement actual email sending
            # For now, simulate email sending
            logger.info(f"Simulating email notification: {notification.title}")
            
            # Log email delivery attempt
            NotificationLog.objects.create(
                notification=notification,
                delivery_method='email',
                status=NotificationStatus.DELIVERED,
                response_data={'simulated': True}
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending email notification: {e}")
            NotificationLog.objects.create(
                notification=notification,
                delivery_method='email',
                status=NotificationStatus.FAILED,
                error_message=str(e)
            )
            return False


class SMSNotificationService:
    """
    Service for handling SMS notifications
    """
    
    @staticmethod
    def send_sms_notification(notification: Notification) -> bool:
        """
        Send SMS notification to user
        
        Args:
            notification: Notification to send
            
        Returns:
            True if sent successfully, False otherwise
        """
        try:
            # TODO: Implement actual SMS sending
            # For now, simulate SMS sending
            logger.info(f"Simulating SMS notification: {notification.title}")
            
            # Log SMS delivery attempt
            NotificationLog.objects.create(
                notification=notification,
                delivery_method='sms',
                status=NotificationStatus.DELIVERED,
                response_data={'simulated': True}
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending SMS notification: {e}")
            NotificationLog.objects.create(
                notification=notification,
                delivery_method='sms',
                status=NotificationStatus.FAILED,
                error_message=str(e)
            )
            return False


class MedicationReminderService:
    """
    Service for handling medication reminders
    """
    
    @staticmethod
    def schedule_medication_reminder(medication, reminder_time):
        """
        Schedule a medication reminder notification
        
        Args:
            medication: Medication instance
            reminder_time: Time for the reminder
        """
        try:
            # Calculate next occurrence of reminder time
            now = timezone.now()
            scheduled_time = now.replace(
                hour=reminder_time.hour,
                minute=reminder_time.minute,
                second=0,
                microsecond=0
            )
            
            # If time has passed today, schedule for tomorrow
            if scheduled_time <= now:
                scheduled_time += timezone.timedelta(days=1)
            
            # Create notification using template
            notification = NotificationService.create_notification_from_template(
                user=medication.user,
                template_name='medication_reminder',
                scheduled_for=scheduled_time,
                medication_name=medication.name,
                dosage=medication.dosage_display,
                time=reminder_time.strftime('%I:%M %p')
            )
            
            if notification:
                logger.info(f"Scheduled medication reminder for {medication.name}")
                return notification
            else:
                logger.error(f"Failed to schedule medication reminder for {medication.name}")
                return None
                
        except Exception as e:
            logger.error(f"Error scheduling medication reminder: {e}")
            return None
    
    @staticmethod
    def check_due_medications():
        """
        Check for medications that are due and send reminders
        This should be called by a cron job
        """
        try:
            now = timezone.now()
            due_notifications = Notification.objects.filter(
                type=NotificationType.MEDICATION_REMINDER,
                status=NotificationStatus.PENDING,
                scheduled_for__lte=now
            )
            
            for notification in due_notifications:
                NotificationService.send_notification(notification)
                
            logger.info(f"Processed {due_notifications.count()} due medication reminders")
            
        except Exception as e:
            logger.error(f"Error checking due medications: {e}")


class ArticleNotificationService:
    """
    Service for handling article notifications
    """
    
    @staticmethod
    def notify_new_article(article):
        """
        Send notifications to users about a new article
        
        Args:
            article: Article instance
        """
        try:
            # Get users who have health tip notifications enabled
            users = User.objects.filter(
                notification_preference_objects__notification_type=NotificationType.HEALTH_TIP,
                notification_preference_objects__push_enabled=True
            ).distinct()
            
            notifications_created = 0
            
            for user in users:
                notification = NotificationService.create_notification_from_template(
                    user=user,
                    template_name='new_health_article',
                    article_title=article.title,
                    article_id=str(article.id)
                )
                
                if notification:
                    notifications_created += 1
                    # Send immediately
                    NotificationService.send_notification(notification)
            
            logger.info(f"Sent {notifications_created} article notifications for '{article.title}'")
            
        except Exception as e:
            logger.error(f"Error sending article notifications: {e}")


class SyncNotificationService:
    """
    Service for handling sync notifications
    """
    
    @staticmethod
    def notify_sync_complete(user, device_name, metrics_count=0):
        """
        Send notification when health data sync completes
        
        Args:
            user: User who synced data
            device_name: Name of the device that synced
            metrics_count: Number of metrics synced
        """
        try:
            notification = NotificationService.create_notification_from_template(
                user=user,
                template_name='sync_complete',
                device_name=device_name,
                metrics_count=metrics_count
            )
            
            if notification:
                NotificationService.send_notification(notification)
                logger.info(f"Sent sync notification to {user.username}")
                return notification
            else:
                logger.error(f"Failed to send sync notification to {user.username}")
                return None
                
        except Exception as e:
            logger.error(f"Error sending sync notification: {e}")
            return None
