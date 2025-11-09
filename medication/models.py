from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid
import secrets
import string

User = get_user_model()


def generate_medication_id():
    """Generate a medication ID with MED- prefix"""
    # Generate a 8-character alphanumeric suffix
    alphabet = string.ascii_uppercase + string.digits
    suffix = ''.join(secrets.choice(alphabet) for _ in range(8))
    return f"MED-{suffix}"


class MedicationType(models.TextChoices):
    """
    Medication type choices based on the frontend implementation
    """
    PILL = 'Pill', 'Pill'
    INJECTION = 'Injection', 'Injection'
    DROPS = 'Drops', 'Drops'
    INHALER = 'Inhaler', 'Inhaler'
    CREAM = 'Cream', 'Cream'
    SPRAY = 'Spray', 'Spray'


class FrequencyType(models.TextChoices):
    """
    Medication frequency choices
    """
    DAILY = 'Daily', 'Daily'
    WEEKLY = 'Weekly', 'Weekly'
    AS_NEEDED = 'As needed', 'As needed'


class DosageUnit(models.TextChoices):
    """
    Common dosage units for medications
    """
    MG = 'mg', 'mg'
    ML = 'ml', 'ml'
    MCG = 'mcg', 'mcg'
    G = 'g', 'g'
    IU = 'IU', 'IU'
    UNITS = 'units', 'units'
    TABLETS = 'tablets', 'tablets'
    CAPSULES = 'capsules', 'capsules'
    DROPS = 'drops', 'drops'
    PUFFS = 'puffs', 'puffs'
    APPLICATIONS = 'applications', 'applications'


class Medication(models.Model):
    """
    Main medication model matching the frontend Medication interface
    """
    id = models.CharField(
        primary_key=True,
        max_length=12,
        default=generate_medication_id,
        editable=False,
        help_text="Unique identifier for the medication (e.g., MED-ABC12345)"
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medications',
        help_text="User who owns this medication"
    )
    
    name = models.CharField(
        max_length=200,
        help_text="Name of the medication"
    )
    
    medication_type = models.CharField(
        max_length=50,
        choices=MedicationType.choices,
        default=MedicationType.PILL,
        help_text="Type of medication"
    )
    
    dosage_amount = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        validators=[MinValueValidator(Decimal('0.001'))],
        help_text="Dosage amount (numeric value)"
    )
    
    dosage_unit = models.CharField(
        max_length=20,
        choices=DosageUnit.choices,
        default=DosageUnit.MG,
        help_text="Unit of measurement for dosage"
    )
    
    frequency = models.CharField(
        max_length=50,
        choices=FrequencyType.choices,
        default=FrequencyType.DAILY,
        help_text="How often the medication should be taken"
    )
    
    start_date = models.DateField(
        help_text="Date when medication should start"
    )
    
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date when medication should end (optional)"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Additional notes or instructions"
    )
    
    reminder_enabled = models.BooleanField(
        default=True,
        help_text="Whether reminders are enabled for this medication"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this medication is currently active"
    )
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medication_medication'
        verbose_name = 'Medication'
        verbose_name_plural = 'Medications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'start_date']),
            models.Index(fields=['user', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.dosage_amount}{self.dosage_unit}) - {self.user.email}"
    
    @property
    def dosage_display(self):
        """Return formatted dosage string matching frontend format"""
        return f"{self.dosage_amount}{self.dosage_unit}"
    
    @property
    def is_current(self):
        """Check if medication is currently active based on dates"""
        today = timezone.now().date()
        if self.end_date:
            return self.start_date <= today <= self.end_date
        return self.start_date <= today
    
    def get_reminder_times(self):
        """Get all reminder times for this medication"""
        return self.reminder_times.all().order_by('time')
    
    def save(self, *args, **kwargs):
        """Override save to ensure unique ID"""
        if not self.id:
            # Generate unique ID if not set
            while True:
                self.id = generate_medication_id()
                if not Medication.objects.filter(id=self.id).exists():
                    break
        super().save(*args, **kwargs)


class MedicationReminder(models.Model):
    """
    Model for storing reminder times for medications
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the reminder"
    )
    
    medication = models.ForeignKey(
        Medication,
        on_delete=models.CASCADE,
        related_name='reminder_times',
        help_text="Medication this reminder belongs to"
    )
    
    time = models.TimeField(
        help_text="Time when reminder should be sent"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this reminder is active"
    )
    
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'medication_reminder'
        verbose_name = 'Medication Reminder'
        verbose_name_plural = 'Medication Reminders'
        ordering = ['time']
        unique_together = ['medication', 'time']
    
    def __str__(self):
        return f"{self.medication.name} - {self.time.strftime('%I:%M %p')}"


class MedicationTaken(models.Model):
    """
    Simplified model for tracking when medications are taken
    Matches frontend's simple boolean taken status
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the taken record"
    )
    
    medication = models.ForeignKey(
        Medication,
        on_delete=models.CASCADE,
        related_name='taken_records',
        help_text="Medication that was taken"
    )
    
    date = models.DateField(
        help_text="Date when medication was taken"
    )
    
    taken = models.BooleanField(
        default=False,
        help_text="Whether the medication was taken"
    )
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medication_taken'
        verbose_name = 'Medication Taken'
        verbose_name_plural = 'Medications Taken'
        ordering = ['-date']
        unique_together = ['medication', 'date']
        indexes = [
            models.Index(fields=['medication', 'date']),
            models.Index(fields=['date', 'taken']),
        ]
    
    def __str__(self):
        status = "Taken" if self.taken else "Not taken"
        return f"{self.medication.name} - {self.date} ({status})"