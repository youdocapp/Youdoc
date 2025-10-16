from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.core.files.storage import default_storage
import os
from .models import HealthRecord


@receiver(post_delete, sender=HealthRecord)
def delete_health_record_file(sender, instance, **kwargs):
    """
    Delete the associated file when a HealthRecord is deleted
    """
    if instance.file:
        try:
            # Delete the file from storage
            if default_storage.exists(instance.file.name):
                default_storage.delete(instance.file.name)
            
            # Also try to delete the directory if it's empty
            file_dir = os.path.dirname(instance.file.name)
            if file_dir and default_storage.exists(file_dir):
                # Check if directory is empty
                try:
                    files = default_storage.listdir(file_dir)[1]  # Get files only
                    if not files:  # If no files in directory
                        default_storage.delete(file_dir)
                except (OSError, ValueError):
                    # If we can't list the directory, just leave it
                    pass
        except Exception:
            # If file deletion fails, log it but don't raise an exception
            # This prevents the model deletion from failing
            pass


@receiver(pre_save, sender=HealthRecord)
def delete_old_health_record_file(sender, instance, **kwargs):
    """
    Delete the old file when a HealthRecord's file is updated
    """
    if instance.pk:
        try:
            old_instance = HealthRecord.objects.get(pk=instance.pk)
            if old_instance.file and old_instance.file != instance.file:
                # File has changed, delete the old one
                if default_storage.exists(old_instance.file.name):
                    default_storage.delete(old_instance.file.name)
        except HealthRecord.DoesNotExist:
            # Instance doesn't exist yet, nothing to delete
            pass
