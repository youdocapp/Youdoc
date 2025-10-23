from rest_framework import serializers
from django.utils import timezone
from .models import MedicalCondition, Surgery, Allergy


class MedicalConditionSerializer(serializers.ModelSerializer):
    """
    Serializer for MedicalCondition model
    """
    id = serializers.UUIDField(read_only=True)
    diagnosedDate = serializers.DateField(source='diagnosed_date')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    class Meta:
        model = MedicalCondition
        fields = [
            'id', 'name', 'diagnosedDate', 'status', 'notes',
            'createdAt', 'updatedAt'
        ]
    
    def validate_name(self, value):
        """Validate condition name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Condition name cannot be empty")
        return value.strip()
    
    def validate_diagnosedDate(self, value):
        """Validate diagnosed date"""
        if value > timezone.now().date():
            raise serializers.ValidationError("Diagnosed date cannot be in the future")
        return value


class SurgerySerializer(serializers.ModelSerializer):
    """
    Serializer for Surgery model
    """
    id = serializers.UUIDField(read_only=True)
    date = serializers.DateField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    class Meta:
        model = Surgery
        fields = [
            'id', 'name', 'date', 'hospital', 'surgeon', 'notes',
            'createdAt', 'updatedAt'
        ]
    
    def validate_name(self, value):
        """Validate surgery name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Surgery name cannot be empty")
        return value.strip()
    
    def validate_date(self, value):
        """Validate surgery date"""
        if value > timezone.now().date():
            raise serializers.ValidationError("Surgery date cannot be in the future")
        return value


class AllergySerializer(serializers.ModelSerializer):
    """
    Serializer for Allergy model
    """
    id = serializers.UUIDField(read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    class Meta:
        model = Allergy
        fields = [
            'id', 'allergen', 'reaction', 'severity', 'notes',
            'createdAt', 'updatedAt'
        ]
    
    def validate_allergen(self, value):
        """Validate allergen name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Allergen cannot be empty")
        return value.strip()
    
    def validate_reaction(self, value):
        """Validate reaction description"""
        if not value or not value.strip():
            raise serializers.ValidationError("Reaction description cannot be empty")
        return value.strip()


class MedicalConditionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating medical conditions
    """
    diagnosedDate = serializers.DateField(source='diagnosed_date')
    
    class Meta:
        model = MedicalCondition
        fields = ['name', 'diagnosedDate', 'status', 'notes']
    
    def validate_name(self, value):
        """Validate condition name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Condition name cannot be empty")
        return value.strip()
    
    def validate_diagnosedDate(self, value):
        """Validate diagnosed date"""
        if value > timezone.now().date():
            raise serializers.ValidationError("Diagnosed date cannot be in the future")
        return value


class SurgeryCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating surgeries
    """
    class Meta:
        model = Surgery
        fields = ['name', 'date', 'hospital', 'surgeon', 'notes']
    
    def validate_name(self, value):
        """Validate surgery name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Surgery name cannot be empty")
        return value.strip()
    
    def validate_date(self, value):
        """Validate surgery date"""
        if value > timezone.now().date():
            raise serializers.ValidationError("Surgery date cannot be in the future")
        return value


class AllergyCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating allergies
    """
    class Meta:
        model = Allergy
        fields = ['allergen', 'reaction', 'severity', 'notes']
    
    def validate_allergen(self, value):
        """Validate allergen name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Allergen cannot be empty")
        return value.strip()
    
    def validate_reaction(self, value):
        """Validate reaction description"""
        if not value or not value.strip():
            raise serializers.ValidationError("Reaction description cannot be empty")
        return value.strip()


