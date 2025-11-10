from rest_framework import serializers
from django.utils import timezone
from django.db import transaction
from datetime import datetime
from .models import (
    Medication, 
    MedicationReminder, 
    MedicationTaken, 
    MedicationType,
    FrequencyType,
    DosageUnit
)


class FlexibleTimeField(serializers.TimeField):
    """
    Custom time field that accepts multiple time formats
    Handles: 'HH:MM', 'HH:MM:SS', 'HH:MM AM/PM', etc.
    """
    def to_internal_value(self, data):
        """Parse time string in various formats"""
        if isinstance(data, str):
            # Try different time formats
            time_formats = [
                '%H:%M:%S',      # 08:00:00
                '%H:%M',         # 08:00
                '%I:%M:%S %p',   # 08:00:00 AM
                '%I:%M %p',      # 08:00 AM
                '%H:%M:%S.%f',   # 08:00:00.000000
            ]
            
            for fmt in time_formats:
                try:
                    # Use a dummy date to parse time-only strings
                    dt = datetime.strptime(f"2000-01-01 {data}", f"%Y-%m-%d {fmt}")
                    return dt.time()
                except ValueError:
                    continue
            
            # If all formats fail, try default TimeField parsing
            try:
                return super().to_internal_value(data)
            except ValueError:
                raise serializers.ValidationError(
                    f"Time must be in format 'HH:MM' or 'HH:MM:SS'. Got: {data}"
                )
        
        return super().to_internal_value(data)


class MedicationReminderSerializer(serializers.ModelSerializer):
    """
    Serializer for medication reminder times
    """
    time_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicationReminder
        fields = ['id', 'time', 'time_display', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_time_display(self, obj):
        """Return formatted time in 12-hour format"""
        return obj.time.strftime('%I:%M %p')


class MedicationTakenSerializer(serializers.ModelSerializer):
    """
    Serializer for medication taken records
    """
    class Meta:
        model = MedicationTaken
        fields = ['id', 'date', 'taken', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicationSerializer(serializers.ModelSerializer):
    """
    Main serializer for medications - matches frontend Medication interface exactly
    """
    dosage_display = serializers.ReadOnlyField()
    is_current = serializers.ReadOnlyField()
    reminder_times = MedicationReminderSerializer(many=True, read_only=True)
    taken_records = MedicationTakenSerializer(many=True, read_only=True)
    medication_type_display = serializers.SerializerMethodField()
    frequency_display = serializers.SerializerMethodField()
    dosage_unit_display = serializers.SerializerMethodField()
    
    # Frontend expects these fields
    time = serializers.SerializerMethodField()
    startDate = serializers.SerializerMethodField()
    endDate = serializers.SerializerMethodField()
    reminderEnabled = serializers.SerializerMethodField()
    dateAdded = serializers.SerializerMethodField()
    startDateObj = serializers.SerializerMethodField()
    endDateObj = serializers.SerializerMethodField()
    taken = serializers.SerializerMethodField()
    
    class Meta:
        model = Medication
        fields = [
            'id', 'name', 'medication_type', 'medication_type_display',
            'dosage_amount', 'dosage_unit', 'dosage_unit_display', 'dosage_display',
            'frequency', 'frequency_display', 'start_date', 'end_date',
            'notes', 'reminder_enabled', 'is_active', 'is_current',
            'reminder_times', 'taken_records', 'created_at', 'updated_at',
            # Frontend interface fields
            'time', 'startDate', 'endDate', 'reminderEnabled', 
            'dateAdded', 'startDateObj', 'endDateObj', 'taken'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_medication_type_display(self, obj):
        """Return human-readable medication type"""
        return dict(MedicationType.choices).get(obj.medication_type, obj.medication_type)
    
    def get_frequency_display(self, obj):
        """Return human-readable frequency"""
        return dict(FrequencyType.choices).get(obj.frequency, obj.frequency)
    
    def get_dosage_unit_display(self, obj):
        """Return human-readable dosage unit"""
        return dict(DosageUnit.choices).get(obj.dosage_unit, obj.dosage_unit)
    
    def get_time(self, obj):
        """Return reminder times as array of strings matching frontend format"""
        return [rt.time.strftime('%I:%M %p') for rt in obj.reminder_times.filter(is_active=True)]
    
    def get_startDate(self, obj):
        """Return start date in frontend format"""
        return obj.start_date.strftime('%B %d, %Y')
    
    def get_endDate(self, obj):
        """Return end date in frontend format"""
        return obj.end_date.strftime('%B %d, %Y') if obj.end_date else None
    
    def get_reminderEnabled(self, obj):
        """Return reminder enabled status"""
        return obj.reminder_enabled
    
    def get_dateAdded(self, obj):
        """Return date added in ISO format"""
        return obj.start_date.isoformat()
    
    def get_startDateObj(self, obj):
        """Return start date as ISO string"""
        return obj.start_date.isoformat()
    
    def get_endDateObj(self, obj):
        """Return end date as ISO string"""
        return obj.end_date.isoformat() if obj.end_date else None
    
    def get_taken(self, obj):
        """Return taken status for today"""
        today = timezone.now().date()
        taken_record = obj.taken_records.filter(date=today).first()
        return taken_record.taken if taken_record else False
    
    def validate(self, data):
        """Validate medication data"""
        # Validate date range
        if data.get('end_date') and data.get('start_date'):
            if data['end_date'] < data['start_date']:
                raise serializers.ValidationError(
                    "End date cannot be before start date"
                )
        
        # Validate dosage amount
        if data.get('dosage_amount') and data['dosage_amount'] <= 0:
            raise serializers.ValidationError(
                "Dosage amount must be greater than 0"
            )
        
        return data


class MedicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating medications with reminder times
    """
    reminder_times = serializers.ListField(
        child=FlexibleTimeField(),
        write_only=True,
        required=False,
        help_text="List of reminder times (e.g., ['08:00', '12:00', '08:00 AM'])"
    )
    
    class Meta:
        model = Medication
        fields = [
            'name', 'medication_type', 'dosage_amount', 'dosage_unit',
            'frequency', 'start_date', 'end_date', 'notes', 
            'reminder_enabled', 'reminder_times'
        ]
    
    def create(self, validated_data):
        """Create medication with reminder times"""
        reminder_times = validated_data.pop('reminder_times', [])
        
        # Use transaction to ensure atomicity
        with transaction.atomic():
            # Create the medication
            medication = Medication.objects.create(**validated_data)
            
            # Deduplicate reminder times - normalize times to seconds since midnight for comparison
            unique_times = []
            seen_time_seconds = set()
            for time in reminder_times:
                # Normalize time to seconds since midnight for accurate comparison
                if hasattr(time, 'hour') and hasattr(time, 'minute') and hasattr(time, 'second'):
                    time_seconds = time.hour * 3600 + time.minute * 60 + time.second
                else:
                    # Fallback to string comparison if not a time object
                    time_seconds = hash(str(time))
                
                if time_seconds not in seen_time_seconds:
                    seen_time_seconds.add(time_seconds)
                    unique_times.append(time)
            
            # Create reminder times - use get_or_create to avoid duplicates
            for time in unique_times:
                MedicationReminder.objects.get_or_create(
                    medication=medication,
                    time=time,
                    defaults={'is_active': True}
                )
        
        return medication


class MedicationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating medications
    """
    reminder_times = serializers.ListField(
        child=FlexibleTimeField(),
        write_only=True,
        required=False,
        help_text="List of reminder times (e.g., ['08:00', '12:00', '08:00 AM'])"
    )
    
    class Meta:
        model = Medication
        fields = [
            'name', 'medication_type', 'dosage_amount', 'dosage_unit',
            'frequency', 'start_date', 'end_date', 'notes', 
            'reminder_enabled', 'is_active', 'reminder_times'
        ]
    
    def update(self, instance, validated_data):
        """Update medication and its reminder times"""
        reminder_times = validated_data.pop('reminder_times', None)
        
        # Use transaction to ensure atomicity
        with transaction.atomic():
            # Update the medication
            medication = super().update(instance, validated_data)
            
            # Update reminder times if provided
            if reminder_times is not None:
                # Delete existing reminders
                medication.reminder_times.all().delete()
                
                # Deduplicate reminder times - normalize times to seconds since midnight for comparison
                unique_times = []
                seen_time_seconds = set()
                for time in reminder_times:
                    # Normalize time to seconds since midnight for accurate comparison
                    if hasattr(time, 'hour') and hasattr(time, 'minute') and hasattr(time, 'second'):
                        time_seconds = time.hour * 3600 + time.minute * 60 + time.second
                    else:
                        # Fallback to string comparison if not a time object
                        time_seconds = hash(str(time))
                    
                    if time_seconds not in seen_time_seconds:
                        seen_time_seconds.add(time_seconds)
                        unique_times.append(time)
                
                # Create new reminders
                for time in unique_times:
                    MedicationReminder.objects.create(
                        medication=medication,
                        time=time,
                        is_active=True
                    )
        
        return medication


class MedicationTakenUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating medication taken status
    """
    class Meta:
        model = MedicationTaken
        fields = ['taken']
    
    def update(self, instance, validated_data):
        """Update medication taken record"""
        return super().update(instance, validated_data)


class MedicationTakenCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating medication taken records
    """
    class Meta:
        model = MedicationTaken
        fields = ['medication', 'date', 'taken']
    
    def create(self, validated_data):
        """Create medication taken record"""
        return super().create(validated_data)


class MedicationListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for medication lists
    """
    dosage_display = serializers.ReadOnlyField()
    is_current = serializers.ReadOnlyField()
    reminder_count = serializers.SerializerMethodField()
    
    # Frontend interface fields
    time = serializers.SerializerMethodField()
    startDate = serializers.SerializerMethodField()
    endDate = serializers.SerializerMethodField()
    reminderEnabled = serializers.SerializerMethodField()
    dateAdded = serializers.SerializerMethodField()
    taken = serializers.SerializerMethodField()
    
    class Meta:
        model = Medication
        fields = [
            'id', 'name', 'medication_type', 'dosage_display', 'frequency',
            'start_date', 'end_date', 'is_active', 'is_current',
            'reminder_count', 'created_at',
            # Frontend interface fields
            'time', 'startDate', 'endDate', 'reminderEnabled', 
            'dateAdded', 'taken'
        ]
    
    def get_reminder_count(self, obj):
        """Get count of active reminders"""
        return obj.reminder_times.filter(is_active=True).count()
    
    def get_time(self, obj):
        """Return reminder times as array of strings"""
        return [rt.time.strftime('%I:%M %p') for rt in obj.reminder_times.filter(is_active=True)]
    
    def get_startDate(self, obj):
        """Return start date in frontend format"""
        return obj.start_date.strftime('%B %d, %Y')
    
    def get_endDate(self, obj):
        """Return end date in frontend format"""
        return obj.end_date.strftime('%B %d, %Y') if obj.end_date else None
    
    def get_reminderEnabled(self, obj):
        """Return reminder enabled status"""
        return obj.reminder_enabled
    
    def get_dateAdded(self, obj):
        """Return date added in ISO format"""
        return obj.start_date.isoformat()
    
    def get_taken(self, obj):
        """Return taken status for today"""
        today = timezone.now().date()
        taken_record = obj.taken_records.filter(date=today).first()
        return taken_record.taken if taken_record else False