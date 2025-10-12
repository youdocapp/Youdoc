from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """
    Custom user manager for email-based authentication
    """
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password"""
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email and password"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model with additional fields required by the frontend
    """
    # Remove username field and use email as username
    username = None
    email = models.EmailField(unique=True)
    
    # Use custom manager
    objects = UserManager()
    
    # Additional fields for user profile
    mobile = models.CharField(max_length=15, blank=True, null=True, help_text="User's mobile phone number")
    date_of_birth = models.DateField(blank=True, null=True, help_text="User's date of birth")
    gender = models.CharField(
        max_length=20,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other'),
            ('prefer_not_to_say', 'Prefer not to say'),
        ],
        blank=True,
        null=True,
        help_text="User's gender"
    )
    blood_type = models.CharField(
        max_length=5,
        choices=[
            ('A+', 'A+'),
            ('A-', 'A-'),
            ('B+', 'B+'),
            ('B-', 'B-'),
            ('AB+', 'AB+'),
            ('AB-', 'AB-'),
            ('O+', 'O+'),
            ('O-', 'O-'),
        ],
        blank=True,
        null=True,
        help_text="User's blood type"
    )
    height = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="User's height in cm"
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="User's weight in kg"
    )
    
    # Email verification fields
    is_email_verified = models.BooleanField(default=False, help_text="Whether the user's email is verified")
    email_verification_token = models.CharField(max_length=100, blank=True, null=True)
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)
    
    # Password reset fields
    password_reset_token = models.CharField(max_length=100, blank=True, null=True)
    password_reset_sent_at = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    # User preferences
    notification_preferences = models.JSONField(
        default=dict,
        help_text="User's notification preferences"
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else self.email
    
    @property
    def full_name(self):
        """Return the user's full name"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_profile_data(self):
        """Return user profile data for frontend"""
        return {
            'id': self.id,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'mobile': self.mobile,
            'dateOfBirth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'bloodType': self.blood_type,
            'height': float(self.height) if self.height else None,
            'weight': float(self.weight) if self.weight else None,
            'isEmailVerified': self.is_email_verified,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
        }