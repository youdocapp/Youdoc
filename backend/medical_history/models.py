from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()


class MedicalCondition(models.Model):
    """
    Model for tracking medical conditions
    """
    CONDITION_STATUS_CHOICES = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('chronic', 'Chronic'),
    ]
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the medical condition"
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medical_conditions',
        help_text="User who has this condition"
    )
    
    name = models.CharField(
        max_length=200,
        help_text="Name of the medical condition"
    )
    
    diagnosed_date = models.DateField(
        help_text="Date when the condition was diagnosed"
    )
    
    status = models.CharField(
        max_length=20,
        choices=CONDITION_STATUS_CHOICES,
        default='active',
        help_text="Current status of the condition"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the condition"
    )
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_conditions'
        verbose_name = 'Medical Condition'
        verbose_name_plural = 'Medical Conditions'
        ordering = ['-diagnosed_date', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"


class Surgery(models.Model):
    """
    Model for tracking surgical procedures
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the surgery"
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='surgeries',
        help_text="User who had this surgery"
    )
    
    name = models.CharField(
        max_length=200,
        help_text="Name of the surgical procedure"
    )
    
    date = models.DateField(
        help_text="Date when the surgery was performed"
    )
    
    hospital = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Hospital where the surgery was performed"
    )
    
    surgeon = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Name of the surgeon who performed the surgery"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the surgery"
    )
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'surgeries'
        verbose_name = 'Surgery'
        verbose_name_plural = 'Surgeries'
        ordering = ['-date', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.date})"


class Allergy(models.Model):
    """
    Model for tracking allergies
    """
    SEVERITY_CHOICES = [
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the allergy"
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='allergies',
        help_text="User who has this allergy"
    )
    
    allergen = models.CharField(
        max_length=200,
        help_text="Substance that causes the allergic reaction"
    )
    
    reaction = models.CharField(
        max_length=500,
        help_text="Description of the allergic reaction"
    )
    
    severity = models.CharField(
        max_length=20,
        choices=SEVERITY_CHOICES,
        default='moderate',
        help_text="Severity level of the allergic reaction"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the allergy"
    )
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'allergies'
        verbose_name = 'Allergy'
        verbose_name_plural = 'Allergies'
        ordering = ['-severity', 'allergen']
        unique_together = ['user', 'allergen']  # Prevent duplicate allergies for same user
    
    def __str__(self):
        return f"{self.allergen} ({self.get_severity_display()})"