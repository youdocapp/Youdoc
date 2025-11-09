from rest_framework import serializers
from .models import HealthRecord


class HealthRecordSerializer(serializers.ModelSerializer):
    """
    Main serializer for HealthRecord model matching frontend interface
    """
    class Meta:
        model = HealthRecord
        fields = [
            'id', 'title', 'type', 'date', 'description',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HealthRecordListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing health records
    """
    class Meta:
        model = HealthRecord
        fields = [
            'id', 'title', 'type', 'date', 'description',
            'notes', 'created_at', 'updated_at'
        ]