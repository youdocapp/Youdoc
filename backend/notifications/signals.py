from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import NotificationType
from .services import (
    MedicationReminderService,
    ArticleNotificationService,
    SyncNotificationService
)


# Medication-related signals
@receiver(post_save, sender='medication.Medication')
def schedule_medication_reminders(sender, instance, created, **kwargs):
    """
    Schedule medication reminders when a medication is created or updated
    """
    try:
        if created and instance.reminder_enabled:
            # Schedule reminders for all reminder times
            for reminder in instance.reminder_times.all():
                if reminder.is_active:
                    MedicationReminderService.schedule_medication_reminder(
                        medication=instance,
                        reminder_time=reminder.time
                    )
        elif not created and instance.reminder_enabled:
            # If medication was updated and reminders are enabled, reschedule
            # This is a simplified approach - in production, you might want to
            # check if reminder times changed and only reschedule if needed
            for reminder in instance.reminder_times.all():
                if reminder.is_active:
                    MedicationReminderService.schedule_medication_reminder(
                        medication=instance,
                        reminder_time=reminder.time
                    )
    except Exception as e:
        # Log error but don't break the medication creation process
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error scheduling medication reminders: {e}")


@receiver(post_save, sender='medication.MedicationReminder')
def schedule_medication_reminder(sender, instance, created, **kwargs):
    """
    Schedule a medication reminder when a reminder time is created
    """
    try:
        if created and instance.is_active:
            MedicationReminderService.schedule_medication_reminder(
                medication=instance.medication,
                reminder_time=instance.time
            )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error scheduling medication reminder: {e}")


# Article-related signals
@receiver(post_save, sender='articles.Article')
def notify_new_article(sender, instance, created, **kwargs):
    """
    Send notifications when a new article is published
    """
    try:
        # Only send notifications for newly created, published articles
        if created and hasattr(instance, 'is_published') and instance.is_published:
            ArticleNotificationService.notify_new_article(instance)
        elif not created and hasattr(instance, 'is_published') and instance.is_published:
            # Check if article was just published (wasn't published before)
            # This requires tracking the previous state, which is more complex
            # For now, we'll only handle newly created articles
            pass
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error sending article notifications: {e}")


# Health tracking sync signals
@receiver(post_save, sender='health_tracking.HealthSyncLog')
def notify_sync_complete(sender, instance, created, **kwargs):
    """
    Send notification when health data sync completes successfully
    """
    try:
        if instance.status == 'success':
            SyncNotificationService.notify_sync_complete(
                user=instance.user,
                device_name=instance.device.name,
                metrics_count=instance.metrics_synced
            )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error sending sync notification: {e}")


# User-related signals for default preferences
@receiver(post_save, sender='auth.User')
def create_default_notification_preferences(sender, instance, created, **kwargs):
    """
    Create default notification preferences for new users
    """
    try:
        if created:
            from .models import NotificationPreference
            
            # Create default preferences for all notification types
            for notification_type, _ in NotificationType.choices:
                NotificationPreference.objects.get_or_create(
                    user=instance,
                    notification_type=notification_type,
                    defaults={
                        'push_enabled': True,
                        'email_enabled': False,
                        'sms_enabled': False
                    }
                )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error creating default notification preferences: {e}")


# Cleanup signals
@receiver(post_delete, sender='medication.Medication')
def cleanup_medication_notifications(sender, instance, **kwargs):
    """
    Clean up scheduled notifications when a medication is deleted
    """
    try:
        from .models import Notification
        
        # Delete pending medication reminder notifications for this medication
        Notification.objects.filter(
            type=NotificationType.MEDICATION_REMINDER,
            status='pending',
            metadata__medication_id=str(instance.id)
        ).delete()
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error cleaning up medication notifications: {e}")


@receiver(post_delete, sender='auth.User')
def cleanup_user_notifications(sender, instance, **kwargs):
    """
    Clean up all notifications when a user is deleted
    """
    try:
        from .models import Notification, NotificationPreference, DeviceToken
        
        # Delete all user-related notification data
        Notification.objects.filter(user=instance).delete()
        NotificationPreference.objects.filter(user=instance).delete()
        DeviceToken.objects.filter(user=instance).delete()
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error cleaning up user notifications: {e}")


# Custom signal for manual notification triggers
from django.dispatch import Signal

# Define custom signals for manual notification triggers
article_published = Signal()
medication_due = Signal()
sync_completed = Signal()
emergency_alert = Signal()


@receiver(article_published)
def handle_article_published(sender, article, **kwargs):
    """
    Handle manual article published signal
    """
    try:
        ArticleNotificationService.notify_new_article(article)
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error handling article published signal: {e}")


@receiver(medication_due)
def handle_medication_due(sender, medication, reminder_time, **kwargs):
    """
    Handle manual medication due signal
    """
    try:
        MedicationReminderService.schedule_medication_reminder(
            medication=medication,
            reminder_time=reminder_time
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error handling medication due signal: {e}")


@receiver(sync_completed)
def handle_sync_completed(sender, user, device_name, metrics_count, **kwargs):
    """
    Handle manual sync completed signal
    """
    try:
        SyncNotificationService.notify_sync_complete(
            user=user,
            device_name=device_name,
            metrics_count=metrics_count
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error handling sync completed signal: {e}")


@receiver(emergency_alert)
def handle_emergency_alert(sender, user, alert_type, message, **kwargs):
    """
    Handle emergency alert signal
    """
    try:
        from .services import NotificationService
        
        notification = NotificationService.create_notification(
            user=user,
            notification_type=NotificationType.GENERAL,
            title=f"Emergency Alert: {alert_type}",
            message=message,
            metadata={'alert_type': alert_type, 'emergency': True}
        )
        
        # Send immediately regardless of preferences
        NotificationService.send_notification(notification)
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error handling emergency alert signal: {e}")
