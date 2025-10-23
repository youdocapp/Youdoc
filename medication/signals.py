from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import Medication, MedicationTaken, MedicationReminder


@receiver(post_save, sender=Medication)
def create_medication_reminders(sender, instance, created, **kwargs):
    """
    Create default reminder times when medication is created
    """
    if created and not instance.reminder_times.exists():
        # Create a default reminder time if none exist
        from datetime import time
        MedicationReminder.objects.create(
            medication=instance,
            time=time(8, 0)  # Default to 8:00 AM
        )


@receiver(post_save, sender=MedicationTaken)
def update_medication_status(sender, instance, created, **kwargs):
    """
    Update medication status when taken record is created/updated
    This could be used for notifications or other side effects
    """
    if created:
        # Log the action (could be used for analytics)
        pass
    else:
        # Handle updates to taken status
        pass


@receiver(post_delete, sender=Medication)
def cleanup_medication_data(sender, instance, **kwargs):
    """
    Clean up related data when medication is deleted
    """
    # This is handled automatically by CASCADE, but we could add additional cleanup here
    pass
