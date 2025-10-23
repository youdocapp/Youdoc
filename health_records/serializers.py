from rest_framework import serializers
from .models import HealthRecord


class HealthRecordSerializer(serializers.ModelSerializer):
    """
    Main serializer for HealthRecord model matching frontend interface
    """
    file_uri = serializers.SerializerMethodField()
    file_name = serializers.CharField(source='file_name', read_only=True)
    
    class Meta:
        model = HealthRecord
        fields = [
            'id', 'title', 'type', 'date', 'description',
            'file', 'file_uri', 'file_name', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'file_uri', 'file_name', 'created_at', 'updated_at']
    
    def get_file_uri(self, obj):
        """Return the file URL if file exists"""
        if obj.file_uri:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file_uri)
            return obj.file_uri
        return None


class HealthRecordListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing health records
    """
    file_uri = serializers.SerializerMethodField()
    
    class Meta:
        model = HealthRecord
        fields = [
            'id', 'title', 'type', 'date', 'description',
            'file_uri', 'file_name', 'notes', 'created_at', 'updated_at'
        ]
    
    def get_file_uri(self, obj):
        """Return the file URL if file exists"""
        if obj.file_uri:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file_uri)
            return obj.file_uri
        return None