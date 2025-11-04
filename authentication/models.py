from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
import uuid


class BloodType(models.TextChoices):
    """
    Blood type choices following international medical standards.
    These are standardized values that rarely change.
    """
    A_POSITIVE = 'A+', 'A+'
    A_NEGATIVE = 'A-', 'A-'
    B_POSITIVE = 'B+', 'B+'
    B_NEGATIVE = 'B-', 'B-'
    AB_POSITIVE = 'AB+', 'AB+'
    AB_NEGATIVE = 'AB-', 'AB-'
    O_POSITIVE = 'O+', 'O+'
    O_NEGATIVE = 'O-', 'O-'


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
    # Use UUID as primary key instead of sequential integer
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the user"
    )
    
    # Public ID for API responses (shorter, more user-friendly)
    public_id = models.CharField(
        max_length=12,
        unique=True,
        editable=False,
        default='temp_id',
        help_text="Short public identifier for the user"
    )
    
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
        choices=BloodType.choices,
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
    
    def generate_public_id(self):
        """Generate a short, unique public ID"""
        import secrets
        import string
        
        # Generate a 10-character alphanumeric ID
        alphabet = string.ascii_letters + string.digits
        
        # Try up to 10 times to find a unique ID (very unlikely to need more)
        max_attempts = 10
        for _ in range(max_attempts):
            public_id = ''.join(secrets.choice(alphabet) for _ in range(10))
            # Check uniqueness efficiently
            if not User.objects.filter(public_id=public_id).exists():
                return public_id
        
        # Fallback: use longer ID with timestamp to ensure uniqueness
        import time
        timestamp = str(int(time.time()))[-6:]  # Last 6 digits of timestamp
        public_id = ''.join(secrets.choice(alphabet) for _ in range(4)) + timestamp
        return public_id
    
    def save(self, *args, **kwargs):
        """Override save to generate public_id if not set"""
        if not self.public_id or self.public_id == 'temp_id':
            self.public_id = self.generate_public_id()
        super().save(*args, **kwargs)
    
    def get_profile_data(self):
        """Return user profile data for frontend"""
        return {
            'publicId': self.public_id,  # Only return public ID for security
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