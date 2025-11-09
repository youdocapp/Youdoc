from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import secrets
import string

User = get_user_model()


def generate_health_record_id():
    """Generate a health record ID with HR- prefix"""
    # Generate a 8-character alphanumeric suffix
    alphabet = string.ascii_uppercase + string.digits
    suffix = ''.join(secrets.choice(alphabet) for _ in range(8))
    return f"HR-{suffix}"


def health_record_file_upload_path(instance, filename):
    """Dummy function for migration compatibility - no longer used"""
    return f'health_records/temp/{filename}'


class HealthRecordType(models.TextChoices):
    """
    Health record type choices based on the frontend implementation
    """
    LAB_RESULT = 'lab_result', 'Lab Result'
    PRESCRIPTION = 'prescription', 'Prescription'
    IMAGING = 'imaging', 'Imaging'
    VACCINATION = 'vaccination', 'Vaccination'
    OTHER = 'other', 'Other'


class HealthRecord(models.Model):
    """
    Main health record model matching the frontend HealthRecord interface
    """
    id = models.CharField(
        primary_key=True,
        max_length=12,
        default=generate_health_record_id,
        editable=False,
        help_text="Unique identifier for the health record (e.g., HR-ABC12345)"
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='health_records',
        help_text="User who owns this health record"
    )
    
    title = models.CharField(
        max_length=200,
        help_text="Title of the health record"
    )
    
    type = models.CharField(
        max_length=50,
        choices=HealthRecordType.choices,
        default=HealthRecordType.OTHER,
        help_text="Type of health record"
    )
    
    date = models.DateField(
        help_text="Date of the health record"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Description of the health record"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Additional notes for the health record"
    )
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'health_records_healthrecord'
        verbose_name = 'Health Record'
        verbose_name_plural = 'Health Records'
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'type']),
            models.Index(fields=['user', 'date']),
            models.Index(fields=['title']),  # For search functionality
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_type_display()}) - {self.user.email}"
    
    def save(self, *args, **kwargs):
        """Override save to ensure unique ID"""
        if not self.id:
            # Generate unique ID if not set
            while True:
                self.id = generate_health_record_id()
                if not HealthRecord.objects.filter(id=self.id).exists():
                    break
        
        super().save(*args, **kwargs)